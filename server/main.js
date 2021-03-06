const debug = require('debug')('app:server')
import webpackConfig from '../build/webpack.config'
import path from 'path'
import webpack from 'webpack'
import config from '../config'
import Koa from 'koa'
import convert from 'koa-convert'
import serve from 'koa-static'
import routers from './routers'
import bodyParser from 'koa-bodyparser'
import session from 'koa-session'
import '../Public/utils'
import mongo from './dbHelps/mongodb'; //启动mongo
mongo()

const paths = config.utils_paths

const router = require('koa-router')();


const app = new Koa()

// const io = new IO()

app.keys = ['leviluo'];

var CONFIG = {
    key: 'koa:sess',
    /** (string) cookie key (default is koa:sess) */
    maxAge: 18640000,
    /** (number) maxAge in ms (default is 1 days) */
    overwrite: true,
    /** (boolean) can overwrite or not (default true) */
    httpOnly: true,
    /** (boolean) httpOnly or not (default true) */
    signed: true,
    /** (boolean) signed or not (default true) */
};

app.use(session(CONFIG, app));

app.use(bodyParser());
// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
if (config.env === 'development') {

  const compiler = webpack(webpackConfig)
  const devMiddleware = require('koa-webpack-dev-middleware')
  const hotMiddleware = require('koa-webpack-hot-middleware')

  app.use(devMiddleware(compiler, {
    publicPath  : webpackConfig.output.publicPath,
    contentBase : paths.client(),
    hot         : true,
    quiet       : config.compiler_quiet,
    noInfo      : config.compiler_quiet,
    lazy        : false,
    stats       : config.compiler_stats
  }))

  app.use(hotMiddleware(compiler))

  function sendIndexHtml(filename){
     return new Promise(function(reslove,reject){
            compiler.outputFileSystem.readFile(filename, (err, result) => {
              if (err) {
                  reslove(err)
              }else{
                  reslove(result)
              }
            })
     })
  }

router.get('*', async function (next) {

    await next

    if (this.body || this.response.status == 200) return

    if(/\/memberCenter/.test(this.request.url)){
      if (!this.session.user) {
        this.redirect('/login')
        return
      }
    }
    
    const filename = path.join(compiler.outputPath, 'index.html')
    const data = await sendIndexHtml(filename)
    this.res.writeHead(200, { "Content-Type": "text/html" });
    this.res.write(data, "binary");
    this.res.end();
    return
  })

  app.use(serve(paths.client('static')))

} else {
  // debug(
  //   'Server is being run outside of live development mode, meaning it will ' +
  //   'only serve the compiled application bundle in ~/dist. Generally you ' +
  //   'do not need an application server for this and can instead use a web ' +
  //   'server such as nginx to serve your static files. See the "deployment" ' +
  //   'section in the README for more information on deployment strategies.'
  // )

  // Serving ~/dist by default. Ideally these files should be served by
  // the web server and not the app server, but this helps to demo the
  // server in production.
  // console.log("0000")
  app.use(serve(paths.dist()))
}

routers(router);

app.use(router.routes())

//main processing file
import chat from './routers/chat'
 
// 必须放在在所有app.user()之后
var server = require('http').Server(app.callback());

chat.initialize(server);

export default server
