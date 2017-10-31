var multiparty = require('multiparty')
var fs  = require('fs')
import { sqlStr } from '../dbHelps/mysql'
import config from '../config'
var sizeOf = require('image-size');
import {parseRange} from "./utils"
import authController from '../controllers/authController'

var gm = require('gm').subClass({imageMagick: true});
var qr = require('qr-image')

function getFile(name,url){
    return new Promise(function(resolve,reject){
        fs.exists(`${url}${name}`, function (exists) {
            if (exists) {
                var file = `${url}${name}`
            }else{
                var file = `${url}default.${name.split('.')[1]}`
            }

            try {
                   var src = fs.createReadStream(file);
                   resolve(src)
               } catch (err) {
                    reject(err)
                   // this.body = fillError(err)
               }
        }) 
    }) 
}

function getThumbImage(query,url){
    return new Promise(function(resolve,reject){
        let width = query.width ? query.width : 200
        let imageName = query.name.split(/[_@]+/)
        let height = width*imageName[2]/imageName[1]
        let thumbName = `${url}thumbs/${imageName[0]}_${width}@${height}.jpg`        
        fs.exists(thumbName, function (exists) {
                    if (exists) {
                        fs.readFile(thumbName, "binary", function(error, file) {
                        // console.log("0000")
                            if (error) {
                                reject(error)
                            } else {
                                resolve(file)
                            }
                        });
                    }else{
                        fs.exists(`${url}${query.name}.jpg`, function (exists) {
                            if (exists) {
                                gm(`${url}${query.name}.jpg`)
                                .resize(width,height)
                                .flatten() //透明PNG透明
                                .write(thumbName, function(err){
                                  if (err) {
                                    reject(err);
                                  }
                                  fs.readFile(thumbName, "binary", function(error, file) {
                                    // console.log("11111")
                                        if (error) {
                                            reject(error)
                                        } else {
                                            resolve(file)
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
                                        resolve(file)
                                    }
                                });
                            }
                        })
                    }    
        })
   }) 
}

function deleteImgs(name,url){
    return new Promise(function(resolve,reject){
        for (var i = 0; i < name.length; i++) {
            ((i)=>{
                fs.exists(`${url}thumbs/${name[i]}.jpg`, function (exists) {
                    if (exists) {
                        fs.unlinkSync(`${url}thumbs/${name[i]}.jpg`);
                    }
                    fs.exists(`${url}${name[i]}.jpg`, function (exists) {
                        if (exists) {
                            fs.unlinkSync(`${url}${name[i]}.jpg`);
                            resolve(true)
                        }
                    })
                })
            })(i)
        }
    })
}

function uploadOneImg(ob,user,url){
    return new Promise(function(resolve,reject){
          var form = new multiparty.Form({ uploadDir: url });
            //上传完成后处理
            form.parse(ob, function(err, fields, files) {
                if (err) {
                    reject(err)
                } else {
                        var inputFile = files.file[0];
                        console.log(inputFile)
                        var uploadedPath = inputFile.path;
                        var dstPath = url + user + '.jpg';
                       //重命名为真实文件名
                        fs.rename(uploadedPath, dstPath, function(err) {
                            if (err) {
                                reject({status:500,type:err})
                            } else {
                                resolve({status:200,msg:fields})
                            }   
                        })
                }
            })
    })
}

function uploadOneVideo(ob,user,url){
    return new Promise(function(resolve,reject){
          var form = new multiparty.Form({ uploadDir: url });
            //上传完成后处理
            form.parse(ob, function(err, fields, files) {
                if (err) {
                    reject(err)
                } else {
                        var inputFile = files.file[0];
                        var uploadedPath = inputFile.path;
                        var name = `${user}${Date.parse(new Date())}`
                        var dstPath = `${url}${name}.mp4`;
                        fields.names = [name]
                        fields.type = "video"
                        // console.log(fields)
                       //重命名为真实文件名
                        fs.rename(uploadedPath, dstPath, function(err) {
                            if (err) {
                                reject({status:500,type:err})
                            } else {
                                resolve({status:200,msg:fields})
                            }   
                        })
                        // console.log(fields)
                        resolve({status:200,msg:fields})
                }
            })
    })
}

function uploadImgs(ob,name,url){
    // console.log("11111")
    return new Promise(function(resolve,reject){
        // console.log("22222")
          var form = new multiparty.Form({ uploadDir: url });
            //上传完成后处理
            var ss = name
            form.parse(ob, function(err, fields, files) {
                if (err) {
                    reject(err)
                } else {    
                        fields.names=[]
                        // console.log(files)
                        if (files.file) {
                            for (var i = 0; i < files.file.length; i++) {
                                var inputFile = files.file[i]
                                var dimensions = sizeOf(inputFile.path);
                                var uploadedPath = inputFile.path;
                                var name = `${ss}${Date.parse(new Date()) + i}_${dimensions.width}@${dimensions.height}`
                                var dstPath = `${url}${name}.jpg`;
                                console.log(name)
                                console.log(dstPath)
                                fields.names.push(name)
                                fields.type = "image"
                               //重命名为真实文件名
                                fs.rename(uploadedPath, dstPath, function(err) {
                                    if (err) {
                                        reject({status:500,type:err})
                                    } else {
                                    }   
                                })
                            }
                        };
                        resolve({status:200,msg:fields})
                }
            })
    })
}

function UploadMessageImage(ob,name,url,type){
    return new Promise(function(resolve,reject){
          var form = new multiparty.Form({ uploadDir: url });
            //上传完成后处理
            form.parse(ob, function(err, fields, files) {
                if (err) {
                    reject(err)
                } else {    
                        for(var key in files){
                            var inputFile = files[key][0]
                            var uploadedPath = inputFile.path;
                            var filename = Date.parse(new Date()) + key.toString().slice(2)
                            var dstPath = url + filename + '.jpg';
                            var reg = new RegExp(key)

                            fields.text[0] = fields.text[0].replace(reg,`<img src="/img?from=${type}&name=${filename}" />`)
                           //重命名为真实文件名
                            fs.rename(uploadedPath, dstPath, function(err) {
                                if (err) {
                                    reject({status:500,type:err})
                                } else {
                                }   
                            })
                        }
                        resolve({status:200,msg:fields})
                }
            })
    })
}

const fileController = {
    loadImg:async function(next){
        // switch(this.request.query.from){
        // case 'chat':
        //     var result = await getThumbImage(this.request.query.name,config.messageImgDir);
        //     break
        // case 'speciality':
        //     var result = await getThumbImage(this.request.query.name,config.specialityImgDir);
        //     break
        // case 'article':
        //     var result = await getThumbImage(this.request.query.name,config.articleImgDir);
        //     break
        // }
        var result = await getThumbImage(this.request.query,config[this.request.query.from + 'ImgDir']);
        this.res.writeHead(200, { "Content-Type": "image/png" });
        this.res.write(result, "binary");
        this.res.end();
    },
    loadOriginImg:async function(next){
        switch(this.request.query.from){
        case 'chat':
            var result = await getFile(this.request.query.name+'.jpg',config.messageImgDir);
            break
        case 'speciality':
            var result = await getFile(this.request.query.name+'.jpg',config.specialityImgDir);
            break
        case 'article':
            var result = await getFile(this.request.query.name+'.jpg',config.articleImgDir);
            break;
        case 'organizations':
            var result = await getFile(this.request.query.name+'.jpg',config.organizationImgDir);
            break;
        case 'member':
            var result = await getFile(this.request.query.name+'.jpg',config.headDir);
            break;
        case 'video':
            var result = await getFile(this.request.query.name+'.jpg',config.videoDir);
            break;
        }
        this.body = result
        // this.res.writeHead(200, { "Content-Type": "image/jpeg" });
        // this.res.write(result, "binary");
        // this.res.end();
    },
    loadVideo:async function(next){
        switch(this.request.query.from){
            case 'video':
                var realpath = config.videoDir+this.request.query.name+'.mp4'
                var response = this.res
                var request = this.request
                var stats = fs.statSync(realpath);
                var contentType = "video/mp4"
                var range = parseRange(request.headers["range"], stats.size);
                response.writeHead(206,"Partial Content",{
                                    "Content-Type":contentType,
                                    "Content-Length":(range.end - range.start + 1),
                                    "Content-Range":"bytes " + range.start + "-" + range.end + "/" + stats.size
                });
                 var stream = fs.createReadStream(realpath, {
                                    "start": range.start,
                                    "end": range.end
                                });
                 this.body = stream
            break;
        }
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
    },
    uploadHeadImg:async function(next){
        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
        var id = this.session.user
        // var id = await sqlStr("select id from member where phone = ?",[user])
        var result = await uploadOneImg(this.req,id,config.headDir)
        if (result.status != 200 ) {
            this.body = {status:500,msg:'上传失败'}
            return
        }
        this.request.body = result.msg
        next
    },
    uploadVideo:async function(next){
        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
        var id = this.session.user
        // var id = await sqlStr("select id from member where phone = ?",[user])
        var result = await uploadOneVideo(this.req,id,config.videoDir)
        if (result.status != 200 ) {
            this.body = {status:500,msg:'上传失败'}
            return
        }
        this.request.body = result.msg
    },
    uploadPhotos:async function(){  //可上传多张图片
        var me = this
        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
        var name = this.session.user
        console.log("uploadPhotos...")
        console.log(name)
        // authController.islogin(this).then(async function(result){
        //     console.log(result)
        //     if (typeof result == "object"){
        //         this.body = result
        //         return 
        //     }else{
                var result = await uploadImgs(me.req,name,config.specialityImgDir)
                console.log("result",result)
                // me.request.body.imgUrl = name
                if (result.status != 200) {
                    me.body = {status:500,msg:'上传失败'}
                    return
                }
                console.log("result.msg",result.msg)
                me.request.body = result.msg
            // }
        // })
        
        // return result.msg
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
        var result = await UploadMessageImage(this.req,name,config.messageImgDir,'chat')
        if (result.status != 200) {
            this.body = {status:500,msg:'上传失败'}
            return
        }
        this.request.body.text = result.msg.text[0]
        this.request.body.sendTo = result.msg.sendTo[0]
    },
    uploadArticleImg:async function(next){   //上传文章时
        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
        var name = this.session.user
        var result = await UploadMessageImage(this.req,name,config.articleImgDir,'article')

        if (result.status != 200) {
            this.body = {status:500,msg:'上传失败'}
            return
        }
        this.request.body = result.msg
    },
    uploadSuggestionImg:async function(next){   //上传文章时
        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
        var name = this.session.user
        var result = await UploadMessageImage(this.req,name,config.suggestionImgDir,'suggestion')

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
