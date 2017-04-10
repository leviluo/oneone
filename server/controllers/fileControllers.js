var multiparty = require('multiparty')
var fs  = require('fs')
import { sqlStr } from '../dbHelps/mysql'
import config from '../config'

var gm = require('gm').subClass({imageMagick: true});
var qr = require('qr-image')

function getOriginImage(name,url){
    return new Promise(function(reslove,reject){
        fs.exists(`${url}${name}.jpg`, function (exists) {
                    if (exists) {
                        var file = `${url}${name}.jpg`
                    }else{
                        var file = `${url}default.jpg`
                    }
        fs.readFile(file, "binary", function(error, file) {
                if (error) {
                    reject(error)
                } else {
                    reslove(file)
                }
            });
        })
   }) 
}

function getThumbImage(name,url){
    return new Promise(function(reslove,reject){
        fs.exists(`${url}thumbs/${name}.jpg`, function (exists) {
                    if (exists) {
                        var file = `${url}thumbs/${name}.jpg` 
                        fs.readFile(file, "binary", function(error, file) {
                        // console.log("0000")
                            if (error) {
                                reject(error)
                            } else {
                                reslove(file)
                            }
                        });
                    }else{
                        fs.exists(`${url}${name}.jpg`, function (exists) {
                            if (exists) {
                                gm(`${url}${name}.jpg`)
                                .resize(180, 180)
                                .flatten() //透明PNG透明
                                .write(`${url}thumbs/${name}.jpg`, function(err){
                                  if (err) {
                                    reject(err);
                                  }
                                  var file = `${url}thumbs/${name}.jpg`
                                  fs.readFile(file, "binary", function(error, file) {
                                    // console.log("11111")
                                        if (error) {
                                            reject(error)
                                        } else {
                                            reslove(file)
                                        }
                                   });
                                });
                            }else{
                                var file = `${url}default.jpg`
                                fs.readFile(file, "binary", function(error, file) {
                                    // console.log("22222")
                                    if (error) {
                                        reject(error)
                                    } else {
                                        reslove(file)
                                    }
                                });
                            }
                        })
                    }    
        })
   }) 
}

function deleteImgs(name,url){
    return new Promise(function(reslove,reject){
        for (var i = 0; i < name.length; i++) {
            ((i)=>{
                fs.exists(`${url}thumbs/${name[i]}.jpg`, function (exists) {
                    if (exists) {
                        fs.unlinkSync(`${url}thumbs/${name[i]}.jpg`);
                    }
                    fs.exists(`${url}${name[i]}.jpg`, function (exists) {
                        if (exists) {
                            fs.unlinkSync(`${url}${name[i]}.jpg`);
                            reslove(true)
                        }
                    })
                })
            })(i)
        }
    })
}

function uploadOneImg(ob,user,url){
    return new Promise(function(reslove,reject){
          var form = new multiparty.Form({ uploadDir: url });
            //上传完成后处理
            form.parse(ob, function(err, fields, files) {
                if (err) {
                    reject(err)
                } else {
                        var inputFile = files.file[0];
                        var uploadedPath = inputFile.path;
                        var dstPath = url + user + '.jpg';
                       //重命名为真实文件名
                        fs.rename(uploadedPath, dstPath, function(err) {
                            if (err) {
                                reject({status:500,type:err})
                            } else {
                                reslove({status:200,msg:fields})
                            }   
                        })
                }
            })
    })
}

function uploadImgs(ob,name,url){
    return new Promise(function(reslove,reject){
          var form = new multiparty.Form({ uploadDir: url });
            //上传完成后处理
            form.parse(ob, function(err, fields, files) {
                if (err) {
                    reject(err)
                } else {    
                        fields.names=[]
                        // console.log(files)
                        if (files.file) {
                            for (var i = 0; i < files.file.length; i++) {
                                var inputFile = files.file[i]
                                var uploadedPath = inputFile.path;
                                var name = name + Date.parse(new Date())+ i
                                var dstPath = url + name + '.jpg';
                                fields.names.push(name)
                               //重命名为真实文件名
                                fs.rename(uploadedPath, dstPath, function(err) {
                                    if (err) {
                                        reject({status:500,type:err})
                                    } else {
                                    }   
                                })
                            }
                        };
                        reslove({status:200,msg:fields})
                }
            })
    })
}

function UploadMessageImage(ob,name,url){
    return new Promise(function(reslove,reject){
          var form = new multiparty.Form({ uploadDir: url });
            //上传完成后处理
            form.parse(ob, function(err, fields, files) {
                if (err) {
                    reject(err)
                } else {    
                    // console.log(files)
                        for(var key in files){
                            // console.log(files[key])
                            var inputFile = files[key][0]
                            var uploadedPath = inputFile.path;
                            var filename = Date.parse(new Date()) + key.toString().slice(2)
                            var dstPath = url + filename + '.jpg';
                            var reg = new RegExp(key)
                            fields.text[0] = fields.text[0].replace(reg,`<img src="/img?from=chat&name=${filename}" />`)
                           //重命名为真实文件名
                            fs.rename(uploadedPath, dstPath, function(err) {
                                if (err) {
                                    reject({status:500,type:err})
                                } else {
                                }   
                            })
                        }
                        reslove({status:200,msg:fields})
                }
            })
    })
}

const fileController = {
    loadImg:async function(next){
        switch(this.request.query.from){
        case 'chat':
            var result = await getThumbImage(this.request.query.name,config.messageImgDir);
            break
        case 'speciality':
            var result = await getThumbImage(this.request.query.name,config.specialityImgDir);
            break
        case 'article':
            var result = await getThumbImage(this.request.query.name,config.articleImgDir);
            break
        }
        this.res.writeHead(200, { "Content-Type": "image/png" });
        this.res.write(result, "binary");
        this.res.end();
    },
    loadOriginImg:async function(next){
        switch(this.request.query.from){
        case 'chat':
            var result = await getOriginImage(this.request.query.name,config.messageImgDir);
            break
        case 'speciality':
            var result = await getOriginImage(this.request.query.name,config.specialityImgDir);
            break
        case 'article':
            var result = await getOriginImage(this.request.query.name,config.articleImgDir);
            break;
        case 'organizations':
            var result = await getOriginImage(this.request.query.name,config.organizationImgDir);
            break;
        case 'member':
            var result = await getOriginImage(this.request.query.name,config.headDir);
            break;
        }
        this.res.writeHead(200, { "Content-Type": "image/png" });
        this.res.write(result, "binary");
        this.res.end();
    },
    qrCode:async function(){
        var qr_svg = qr.imageSync(this.request.query.text, { type: 'png' });
        this.res.writeHead(200, { "Content-Type": "image/png" });
        this.res.write(qr_svg, "binary");
        this.res.end();
    },
    uploadHeadImg:async function(next){
        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
        var id = this.session.user
        // var id = await sqlStr("select id from member where phone = ?",[user])
        var result = await uploadOneImg(this.req,id,config.headDir)
        if (result.status == 200 ) {
            this.body = {status:200}
            return
        }
        await next
    },
    uploadPhotos:async function(next){  //可上传多张图片
        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
        var name = this.session.user
        var result = await uploadImgs(this.req,name,config.specialityImgDir)

        // this.request.body.imgUrl = name
        if (result.status != 200) {
            this.body = {status:500,msg:'上传失败'}
            return
        }

        this.request.body = result.msg
    },
    uploadOrganizationImg:async function(next){
        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
        var name = this.session.user
        var result = await uploadImgs(this.req,name,config.organizationImgDir)

        if (result.status != 200) {
            this.body = {status:500,msg:'上传失败'}
            return
        }

        this.request.body = result.msg
    },

    submitMessage:async function(){
        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
        var name = this.session.user
        var result = await UploadMessageImage(this.req,name,config.messageImgDir)
        this.request.body.text = result.msg.text[0]
        this.request.body.sendTo = result.msg.sendTo[0]
    },
    uploadArticleImg:async function(next){
        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
        var name = this.session.user
        var result = await uploadImgs(this.req,name,config.articleImgDir)

        if (result.status != 200) {
            this.body = {status:500,msg:'上传失败'}
            return
        }
        
        this.request.body = result.msg
    },
    deletePhoto:async function(next){
        var result = await deleteImgs([this.request.query.name],config.specialityImgDir)
        if(!result){
            this.body = {status:500,mag:"删除失败"}
            return
        }
        next
    },
    deletePhotos:async function(next){
        await next
        console.log(this.request.body.deletImgs)
        if (this.request.body.deletImgs.length > 0) {
        console.log("000")
        var result = await deleteImgs(this.request.body.deletImgs,config.articleImgDir)
        if(!result){
            this.body = {status:500,mag:"删除失败"}
            return
        }

        }
        next
    }
}

export default fileController
