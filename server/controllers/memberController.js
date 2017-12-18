import { sqlStr,getByItems, insert } from '../dbHelps/mysql'
import {queryid} from '../routers/chat.js'
import mongoose from 'mongoose'
import {save,find,update,remove,aggregate,findLimit} from '../dbHelps/mongodb'
import {mergeMulti} from './utils'
import authController from '../controllers/authController'
import fileController from '../controllers/fileControllers'


const memberController = {
    addSpeciality:async function(next){

        await next

        // 如果是web端
        // var brief = this.request.body.brief.trim().html2Escape()
        // var speciality = this.request.body.speciality.trim().html2Escape()
        // app端
        var brief = this.request.body.brief.trim()
        var speciality = this.request.body.speciality.trim()

        // console.log(brief,speciality)

        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }

        if (!speciality) {
        	this.body = { status: 500, msg: "缺少参数" }
            return
        }

        if (brief.length > 300) {
            this.body = { status: 500, msg: "简介超过了300个字符" }
            return
        }
        var resultcount = await sqlStr("select count(*) as count from memberSpeciality where memberId=?",[this.session.user])
        if(resultcount[0].count > 4){
            this.body = { status: 500, msg: "最多添加5项技能" }
            return
        }

        var resultrepeat = await sqlStr("select * from memberSpeciality where memberId=? and specialitiesId=(select id from specialities where name= ?)",[this.session.user,speciality])
        // console.log('resultrepeat',resultrepeat)
        if(resultrepeat.length > 0){
            this.body = { status: 500, msg: "已经添加了此技能" }
            return
        }

        var result = await sqlStr("insert into memberSpeciality set brief = ?,memberId=?,experience = '',specialitiesId=(select id from specialities where name= ?)",[brief,this.session.user,speciality])
        if (result.affectedRows == 1 ) {
            // console.log("success return data....")
            this.body = { status: 200,msg:"插入成功",data:{insertId:result.insertId}}
            return
        }else{
            this.body = { status: 500,msg:"插入数据失败"}
        }

    },
    // getMemberInfo:async function(next){
    //     if (!this.session.user) {
    //         this.body = { status: 600, msg: "尚未登录" }
    //         return
    //     }
    //     var result = await sqlStr("select m.address,m.sex,m.phone,m.id,m.brief,(select count(id) from follows where memberId = m.id) as follows,(select count(id) from follows where followId = m.id) as fans from member as m where id = ?",[this.session.user])
    //     this.body = {status:200,data:result}
    // },
    userinfo:async function(next){
        // console.log("app来了")
        // await next
        var id = this.request.query.id
        if (!id) {
            this.body = { status: 600, msg: "缺少参数" }
            return
        }
        if(this.session.user && this.session.user != id){
        var result = await sqlStr("select m.address,m.nickname,m.sex,m.id,m.brief,m.head,(select count(id) from follows where memberId = m.id) as follows,(select count(*) from follows where memberId = ? and followId = ?) as HimFocus,(select count(*) from blacklist where blackId = ? and memberId = ?) as isBlacklist,(select count(*) from follows where memberId = ? and followId = ?) as FocusHim,(select count(id) from follows where followId = m.id) as fans from member as m where id = ?",[id,this.session.user,id,this.session.user,this.session.user,id,id])
        }else{
        var result = await sqlStr("select m.address,m.nickname,m.sex,m.id,m.brief,m.head,(select count(id) from follows where memberId = m.id) as follows,(select count(id) from follows where followId = m.id) as fans from member as m where id = ?",[id])
        }
        this.body = {status:200,data:result[0]}
    },
    message:async function(next){
        await next
        var text = this.request.body.text
        var chatWith = this.request.body.sendTo
        var type = this.request.body.type


        if(!text || !chatWith || !type){
            this.body = { status: 500, msg: "缺少参数" }
            return
        }

        var result = await sqlStr("select * from blacklist where blackId = ? and memberId = ?",[this.session.user,chatWith])

        if(result.length > 0){
            this.body = { status: 600, msg: "因系统设置,您不能进行此操作" }
            return
        }

        var result = await sqlStr("select * from follows where (followId = ? and memberId = ?) or (followId = ? and memberId = ?)",[this.session.user,chatWith,chatWith,this.session.user])

        if(result.length < 2){
            this.body = { status: 600, msg: "只有相互关注的好友才可以聊天" }
            return
        }

        if (text.length > 1000) {
            this.body = { status: 500, msg: "消息过长" }
            return
        }

        var result = await sqlStr("insert into message set fromMember = ?,toMember = ?,text = ?,type = ?",[this.session.user,chatWith,text,type])
        if (result.affectedRows == 1) {
            // var toName = chatWith;
            // var info = await sqlStr("select * from member where id = ?",[this.session.user])
            // var message = mongoose.model('Message');
            var result = await sqlStr("select m.text,m.type,m.id,m.time,mF.id as sendFrom,mF.nickname as sendnickname,mF.head as sendFromHead,mT.id as sendTo,mT.nickname as sendTonickname,mT.head as sendTohead from message as m left join member as mF on mF.id = m.fromMember left join member as mT on mT.id=m.toMember where m.fromMember = ? and m.toMember = ? order by m.id desc limit 1",[this.session.user,chatWith])


            // var items = {hostId:chatWith,memberId:this.session.user,nickname:info[0].nickname};

            // var resultt = await save(data)
            // console.log(result)
            // console.log(resultt)
            // console.log(resultt)
            // console.log(chatWith)
            // if (resultt.id) {
                // 在线发送socket消息
                var toSocket = queryid(chatWith)
                result[0].ntype = "msg"
                result[0].hostId = result[0].sendTo
                queryid(this.session.user).emit('notice',result[0]);
                if (toSocket) {
                    // result[0].status = 1
                    console.log("私信通知")
                    // var resultt = await save('Chat',result[0])
                    toSocket.emit('notice',result[0]);
                    // toSocket.emit('primessage',{type:"privatemessage",hostId:this.request.body.sendTo,memberId:this.session.user,nickname:info[0].nickname})
                }else{
                    var resultt = await save('msg',result[0])
                }
                
                // if (resultt.hostId) {
                    this.body = { status: 200, data:"ok"}
                    return
                // }
            // }else{
            //      this.body = { status: 500, msg:"保存消息失败"}
            //     return
            // }

        }else{
            this.body = { status: 500,msg:'操作失败'}
        }
        this.body = { status: 500,msg:'操作失败'}
    },
    // historyChat:async function(next){
    //     await next
    //     var lastUpdate = this.request.query.lastUpdate
    //     var chatWith = this.request.query.chatWith
    //     var limit = this.request.query.limit
    //     if (!chatWith || !limit) {
    //         this.body = { status: 500, msg: "缺少参数" }
    //         return
    //     }
    //     // var limits = `${(p-1)*limit},${limit}`
    //     if (lastUpdate > 0) {
    //         var result = await sqlStr("select m.text,m.id,m.type,m.time,mF.id as sendFrom,mF.nickname as sendnickname,mF.head as sendFromHead,mT.id as sendTo,mT.nickname as sendTonickname,mT.head as sendTohead from message as m left join member as mF on mF.id = m.fromMember left join member as mT on mT.id=m.toMember where ((m.fromMember = ? and m.toMember = ?) or (m.toMember = ? and m.fromMember = ?)) and m.id <= ? order by m.id desc limit " + limit,[this.session.user,chatWith,this.session.user,chatWith,lastUpdate])
    //     }else{ 
    //         var result = await sqlStr("select m.text,m.id,m.type,m.time,mF.id as sendFrom,mF.nickname as sendnickname,mF.head as sendFromHead,mT.id as sendTo,mT.nickname as sendTonickname,mT.head as sendTohead from message as m left join member as mF on mF.id = m.fromMember left join member as mT on mT.id=m.toMember where (m.fromMember = ? and m.toMember = ?) or (m.toMember = ? and m.fromMember = ?) order by m.id desc limit " + limit,[this.session.user,chatWith,this.session.user,chatWith])

    //         // var updates = await update("Message",{hostId:this.session.user,status:0,type:"privatemessage"},{$set:{status:1}},{multi:true})
    //         // // console.log(updates)
    //         // if(updates.ok){
    //         //     this.body = {status:200,data:result}
    //         // }else{
    //         //     this.body = {status:500,msg:"更新通知状态失败"}
    //         // }
    //         var updateS = await sqlStr("update message set active = 1 where toMember = ? and fromMember = ? and active = 0",[this.session.user,chatWith])

    //         if(updateS.affectedRows === undefined){
    //             this.body = {status:600,msg:"更新状态失败"}
    //             return
    //         }

    //     }
    //     // var updates = await update("Chat",{hostId:this.session.user,status:0,memberId:chatWith},{$set:{status:1}},{multi:true})
        
    //     // if(updates.ok){
    //         this.body = {status:200,data:result.reverse()}
    //     //     return
    //     // }
    //     // this.body = {status:500,msg:"操作失败"}
    // },
    // updateActive:async function(next){
    //     await next;
    //     if (!this.request.query.chatWith) {
    //         this.body = { status: 500, msg: "缺少参数" }
    //         return
    //     }
    //     // var update = await remove("Chat",{id:this.request.query.chatWith})        
    //     // console.log(update)
    //     // if(resultt.result.n == 1){
    //     //     this.body = {status:200,data:"ok"}
    //     //     return
    //     // }
    //     //     this.body = {status:500,msg:"更新失败"}
    //     // var lastUpdate = this.request.query.lastUpdate
    //     // var chatWith = this.request.query.chatWith
    //     // if (!lastUpdate && this.body.status == 200) {
    //         var result = await sqlStr("update message set active = 1 where toMember = ? and fromMember = ? and active = 0",[this.session.user,this.request.query.chatWith])
    //         this.body = {status:200,data:"ok"}
    //     // }
    //     // this.body = this.body
    // },
    // getMessageList:async function(next){
    //     // if (!this.session.user || !this.request.query.limit) {
    //     //     this.body = { status: 600, msg: "尚未登录" }
    //     //     return
    //     // }
    //     await next
    //     var p = this.request.query.p
    //     var limit = this.request.query.limit
    //     var id = this.session.user
    //     var limits = `${(p-1)*limit},${limit}`
        
    //     var result = await sqlStr(`select message.time,message.text,message.type,member.nickname,member.head,member.id as memberId,if(message.fromMember=?,1,0) as isSend from message left join member on (member.id = message.fromMember or member.id = message.toMember) and member.id != ? where message.id in (select max(ms.id) from message as ms left join member as m on (m.id = ms.toMember or m.id = ms.fromMember) and m.id != ? where ms.fromMember = ? or ms.toMember = ? group by m.phone) order by message.time desc limit ${limits}`,[id,id,id,id,id])
    //     // var count = await sqlStr("select m.phone from message as ms left join member as m on (m.id = ms.toMember or m.id = ms.fromMember) and m.id != ? where ms.fromMember = ? or ms.toMember = ? group by m.phone;",[id,id,id])
    //     for (var i = 0; i < result.length; i++) {
    //         // result[i]
    //         // var count = await sqlStr("select count(*) as count from message where active = 0 and fromMember = ? and toMember = ?",[result[i].memberId,this.session.user])
    //         // result[i].noRead = count[0].count
    //         var count = await find("Chat",{sendTo:this.session.user,status:0,sendFrom:result[i].sendFrom})
    //         result[i].noRead = count.length
    //     }
    //     var updates = await update("Chat",{sendTo:this.session.user,status:0},{$set:{status:1}},{multi:true})
    //     // var updates = await update("Message",{hostId:this.session.user,status:0,type:"privatemessage"},{$set:{status:1}},{multi:true})
    //     if(updates.ok != undefined){
    //         // this.body = {status:200,data:result}
    //         this.body = {status:200,data:result}
    //     }else{
    //         this.body = {status:500,msg:"更新通知状态失败"}
    //     }
            
    // },
    // modifyNickname:async function(next){

    //     if (!this.session.user) {
    //         this.body = { status: 600, msg: "尚未登录" }
    //         return
    //     }

    //     var nickname = this.request.body.nickname.trim().html2Escape()

    //     var flag = nickname.StringFilter(1,20)
    //     if (flag) {
    //         this.body = { status: 500, msg: `昵称${flag}`}
    //         return
    //     }

    //     var result = await sqlStr("update member set nickname = ? where id = ?",[nickname,this.session.user])
    //     if (result.affectedRows == 1) {
    //     this.body = {status:200}
    //     return
    //     }
    //     this.body = {status:500,msg:"修改失败"}
    // },
    // modifyAddress:async function(next){

    //     if (!this.session.user) {
    //         this.body = { status: 600, msg: "尚未登录" }
    //         return
    //     }

    //     var address = this.request.body.address.trim().html2Escape()

    //     var flag = address.StringFilter(1,100)

    //     if (flag) {
    //         this.body = { status: 500, msg: `地址${flag}`}
    //         return
    //     }

    //     var result = await sqlStr("update member set address = ? where id = ?",[address,this.session.user])
    //     if (result.affectedRows == 1) {
    //     this.body = {status:200}
    //     return
    //     }
    //     this.body = {status:500,msg:"修改失败"}
    //     next
    // },
    // modifySpeciality:async function(next){
    //     await next

    //     var brief = this.request.body.brief.trim().html2Escape()
    //     // var experience = this.request.body.experience.trim().html2Escape()
    //     var speciality = this.request.body.speciality.trim().html2Escape()

    //     if (!this.session.user) {
    //         this.body = { status: 600, msg: "尚未登录" }
    //         return
    //     }

    //     if (!this.request.body.speciality || !brief) {
    //         this.body = { status: 500, msg: "缺少参数" }
    //         return
    //     }

    //     var flag = brief.StringLen(0,300)
    //     if (flag) {
    //         this.body = { status: 500, msg: `简介${flag}` }
    //         return
    //     }

    //     var result = await sqlStr("update memberSpeciality set brief = ? where specialitiesId = (select id from specialities where name = ?) and memberId = ?",[brief,speciality,this.session.user])
        
    //     if (result.affectedRows == 1) {
    //     this.body = {status:200}
    //     return
    //     }

    //     this.body = {status:500,msg:"修改失败"}
    //     next
    // },
  //   deleteSpeciality:async function(next){
  //       if (!this.session.user) {
  //           this.body = { status: 600, msg: "尚未登录" }
  //           return
  //       }
  //       if (!this.request.body.speciality) {
  //           this.body = { status: 500, msg: "缺少参数" }
  //           return
  //       }
  //       var result = await sqlStr("delete from memberSpeciality where specialitiesId = (select id from specialities where name = ?) and memberId = ?",[this.request.body.speciality,this.session.user])
        
  //       if (result.affectedRows == 1) {
  //       this.body = {status:200}
  //       return
  //       }

  //       this.body = {status:500,msg:"删除失败"}
  //       next
  //   },
  //   messages:async function(){
  // //私信                        “谁” 给你发了私信               属于消息（type="privatemessage"）
  // //文章评价                    “谁” 在 “文章”                  属于消息（type="articlecomment"）
  // //请求入群                    “谁” 请求加入 “社团”            属于消息（type="attendrequest"）
  // //文章中回复了你              “谁” 在 “文章”                  属于消息（type="articlereply"）
  //       if (!this.session.user) {
  //           this.body = { status: 600, msg: "尚未登录" }
  //           return
  //       }

  //       var result = await find("Message",{hostId:this.session.user,status:0},{sort:{'_id':-1}}) 
  //       this.body = {status:200,data:result}

  //   },
  //   notices:async function(){
  // //关注                        “谁“ 关注了你                   属于通知（type="focusyou"）
  // //通知                        “社团” 通过了你的加入请求       属于通知（type="attendapprove"）
  //   if (!this.session.user) {
  //       this.body = { status: 600, msg: "尚未登录" }
  //       return
  //   }
  //   // var notice = mongoose.model('Notice');
  //   if (this.request.query.type == 'noread') {

  //       var result = await find("Notice",{hostId:this.session.user,status:0},{sort:{'_id':-1}}) 

  //       var updates = await update("Notice",{hostId:this.session.user,status:0},{$set:{status:1}},{multi:true})

  //       if(updates.ok){
  //           this.body = {status:200,data:result}
  //       }else{
  //           this.body = {status:500,msg:"更新通知状态失败"}
  //       }
        
  //   }else if (this.request.query.type == 'all') {

  //       var result = await findLimit("Notice",{hostId:this.session.user},{sort:{'_id':-1},p:this.request.query.p,limit:parseInt(this.request.query.limit)}) 

  //       var count = await aggregate("Notice",{_id:"$hostId",total:{$sum:1}})

  //       var updates = await update("Notice",{hostId:this.session.user,status:0},{$set:{status:1}},{multi:true})

  //       if(updates.ok){
  //           this.body = {status:200,data:result,count:count[0].total}
  //       }else{
  //           this.body = {status:500,msg:"更新通知状态失败"}
  //       }

  //   }

  //   },
    // updatenotices:async function(){
    //     if (!this.session.user) {
    //         this.body = { status: 600, msg: "尚未登录" }
    //         return
    //     }
    //     // var notice = mongoose.model('Notice');
    //     var updates = await update("Notice",{hostId:this.session.user,status:0},{$set:{status:1}},{multi:true})
    //     // console.log(updates)
    //     if(updates.ok){
    //         this.body = {status:200}
    //     }else{
    //         this.body = {status:500,msg:"更新通知状态失败"}
    //     }
    // },
    // allnotices:async function(){
    //    if (!this.session.user) {
    //     this.body = { status: 600, msg: "尚未登录" }
    //     return
    // }
    // // var notice = mongoose.model('Notice');
    // var result = await find("Notice",{hostId:this.session.user},{sort:{'_id':-1}}) 
    
    // this.body = {status:200,data:result}
    // },
    submitPhotos:async function(next){
      await next 

      var names = this.request.body.names
      var id = this.request.body.id[0]
      var type = this.request.body.type
      var text = this.request.body.text ? this.request.body.text[0] : ""

      if (!id || !this.request.body.id) {
        this.body = {status:500,msg:"缺少参数"}
        return
      }

      if (names.length > 0) {

        var resultt = await sqlStr("insert into memberupdates set memberId = ?,type = ?,text = ?",[this.session.user,type,text])
        if (resultt.insertId) {

            var str = ''
            var arr = []
            for (var i = 0; i < names.length; i++) {
              str += `(?,?,?),`,
              arr.push(id)
              arr.push(names[i])
              arr.push(resultt.insertId)
            }
            var result = await sqlStr("insert into works(`memberSpecialityId`,`name`,`updateId`) values "+str.slice(0,-1),arr)
            // if(names.length > 8){
            //     names = names.splice(0,8) 
            // }
           if (result.affectedRows > 0 && resultt.affectedRows == 1) {
                this.body = {status:200,msg:"发布成功"}
                return
            }

        }
        this.body= {status:500,msg:"写入数据库失败"}
      }else{
        this.body = {status:500,msg:"上传图片失败"}
      }
    },
    addLike: async function(next){
        await next
        var id = this.request.query.id
        // if (!this.session.user) {
        //     this.body = { status: 600, msg: "尚未登录" }
        //     return
        // }
        if (!id) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        var result = await sqlStr("select * from blacklist where blackId = ? and memberId = (select memberId from memberUpdates where id = ?)",[this.session.user,id])
        if(result.length > 0){
            this.body = { status: 600, msg: "因系统设置,您不能进行此操作" }
            return
        }
        var result = await sqlStr("delete from likes where memberId = ? and updatesId = ?",[this.session.user,id])
        if (result.affectedRows == 1) {
            // this.body = {status:200,data:"ok"}
            var resultt = await remove("notice",{status:0,ntype:"like",memberId:this.session.user,updatesId:parseInt(id)})
                if(resultt.result.ok == 1){
                    this.body = {status:200,data:"ok"}
                    return
                }
        }else if(result.affectedRows == 0){
            var result = await sqlStr("insert into likes set memberId = ?,updatesId = ?",[this.session.user,id])
            if (result.affectedRows == 1) {
                var info = await sqlStr("select mu.memberId,mu.type,w.name from memberupdates as mu left join works as w on w.updateId = mu.id where mu.id = ? order by w.id desc limit 1",[id])
                var myinfo = await sqlStr("select nickname,head from member where id = ?",[this.session.user])
                if (info[0].memberId != this.session.user){

             // 点赞通知
                 var items = {hostId:info[0].memberId,time:new Date().myFormat(),type:info[0].type,updatesId:parseInt(id),nickname:myinfo[0].nickname,head:myinfo[0].head,memberId:this.session.user,workname:info[0].name};

                    
                    if(info[0].memberId){

                        var toSocket = queryid(info[0].memberId)

                        items.ntype = "like"

                        if (toSocket) {
                            // items.status = 1
                            toSocket.emit('notice',items);
                            console.log("赞通知")
                        }else{
                            var resultt = await save('notice',items)
                        }
                        
                        // if (resultt.hostId) {
                            this.body = {status:200,data:"ok"}
                            return
                        // }
                    }else{
                        this.body = {status:500,msg:"操作失败"}
                        return
                    }
                }else{
                    this.body = {status:200,data:"ok"}
                        return
                }
            }
            // this.body = {status:500,msg:"插入数据失败"}
        }
        this.body = {status:500,msg:"操作数据库失败"}
    },
    // deletePhoto:async function(next){
    //     if (!this.session.user) {
    //         this.body = { status: 600, msg: "尚未登录" }
    //         return
    //     }
    //     if (!this.request.query.id) {
    //         this.body = { status: 500, msg: "缺少参数" }
    //         return
    //     }
    //     if (!this.request.query.name) {
    //         this.body = { status: 500, msg: "缺少参数" }
    //         return
    //     }
    //     await next

    //     var result = await sqlStr("delete l.*,w.* from works as w left join likes as l on l.worksId = w.id left join memberSpeciality as m on m.id = w.memberSpecialityId where w.id = ? and m.memberId = ?",[this.request.query.id,this.session.user])

    //     if (result.affectedRows == 1) {
    //         this.body = {status:200}
    //     }else{
    //         this.body = {status:500,msg:"删除失败"}
    //     }
    // },
    followOne:async function(next){
        await next
        var id = this.request.query.id

        // if (!this.session.user) {
        //     this.body = { status: 600, msg: "尚未登录" }
        //     return
        // }
        if (!id) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        var result = await sqlStr("select * from blacklist where blackId = ? and memberId = ?",[this.session.user,id])
        if(result.length > 0){
            this.body = { status: 600, msg: "因系统设置,您不能进行此操作" }
            return
        }
        var result = await sqlStr("select * from follows where memberId = ? and followId = ?",[this.session.user,id])
        if (result.length > 0) {
            this.body = { status: 500, msg: "请不要重复关注" }
            return
        }else{
            result = await sqlStr("insert into follows set memberId = ?,followId = ?",[this.session.user,id])
            if (result.affectedRows == 1) {
                var myinfo = await sqlStr("select nickname,head from member where id = ?",[this.session.user])
                
                // 取关后通知
                // var notice = mongoose.model('Notice');

                var items = {hostId:parseInt(id),time:new Date().myFormat(),memberId:this.session.user,nickname:myinfo[0].nickname,head:myinfo[0].head};

                
                // if(resultt.id){

                    var toSocket = queryid(id)

                    items.ntype = "focus"
                    if (toSocket) {
                        // items.status = 1
                        toSocket.emit('notice',items);
                        console.log("通知关注")
                    }else{
                        var resultt = await save('notice',items)
                    }
                    // if (resultt) {}
                    // if (resultt.hostId) {
                        this.body = {status:200,data:"ok"}
                        return
                    // }
                // }else{
                //     this.body = {status:500,msg:"操作失败"}
                // }

            }else{
                this.body = {status:500,msg:"操作失败"}
            }
        }
        this.body = {status:500,msg:"操作失败"}
    },
    // isFocus:async function(){
    //     var id = this.request.query.id

    //     if (!this.session.user) {
    //         this.body = { status: 600, msg: "尚未登录" }
    //         return
    //     }
    //     var result = await sqlStr("select * from follows where memberId = ? and followId = ?",[this.session.user,id])
    //     if (result.length > 0) {
    //         this.body = { status: 200, msg: "ok", data:"是" }
    //         return
    //     }else{
    //         this.body = { status: 200, msg: "ok", data:"否" }
    //         return
    //     }
    // },
    // isFriend:async function(){
    //     var id = this.request.query.id

    //     if (!this.session.user) {
    //         this.body = { status: 600, msg: "尚未登录" }
    //         return
    //     }
    //     var result = await sqlStr("select * from follows where (memberId = ? and followId = ?) or (followId = ? and memberId = ?)",[this.session.user,id,this.session.user,id])
    //     if (result.length == 2) {
    //         this.body = { status: 200, msg: "ok", data:"是" }
    //         return
    //     }else{
    //         this.body = { status: 200, msg: "ok", data:"否" }
    //         return
    //     }
    // },
    followOutOne:async function(next){
        await next
        var id = this.request.query.id
        // if (!this.session.user) {
        //     this.body = { status: 600, msg: "尚未登录" }
        //     return
        // }
        if (!id) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        
        var result = await sqlStr("delete from follows where memberId = ? and followId = ?",[this.session.user,id])
        if (result.affectedRows == 1) {
            this.body ={status:200}
            // 取关后删除通知
                // var notice = mongoose.model('Notice');
                var resultt = await remove("notice",{status:0,hostId:id,memberId:this.session.user,ntype:"focus"})
                if(resultt.result.ok == 1){
                    this.body = {status:200,data:"ok"}
                    return
                }

        }else{
            this.body ={status:500,msg:"操作失败"}
        }
    },
    // modifyBrief:async function(){
    //     if (!this.session.user) {
    //         this.body = { status: 600, msg: "尚未登录" }
    //         return
    //     }
    //     var brief = this.request.body.brief.trim().html2Escape()
    //     var flag = brief.StringFilter(1,100)
    //     if (flag) {
    //         this.body = { status: 500, msg: `简介${flag}`}
    //         return
    //     }
    //     var result = await sqlStr("update member set brief = ? where phone = ?",[brief,this.session.user])
    //     if (result.affectedRows == 1) {
    //         this.body ={status:200}
    //     }else{
    //         this.body ={status:500,msg:"操作失败"}
    //     }
    // },
    // ifliked:async function(){
    //     if (!this.session.user) {
    //         this.body = { status: 600, msg: "尚未登录" }
    //         return
    //     }
    //     if (!this.request.query.id) {
    //         this.body = { status: 500, msg: "缺少参数" }
    //         return
    //     }
    //     var result = await sqlStr("select * from likes where worksId = ? and memberId = ?",[this.request.query.id,this.session.user])
    //     if (result.length == 1) {
    //         this.body = { status: 200, msg: 1 }
    //     } else{
    //         this.body = { status: 200, msg: 0 }
    //     }
    // },
    // getupdates:async function(){
    //     if (!this.session.user) {
    //         this.body = { status: 600, msg: "尚未登录" }
    //         return
    //     }
 
    //     var result = await sqlStr("select mu.id,mu.type,mu.createAt,mu.memberId,m.nickname from memberupdates as mu left join member as m on m.id = mu.memberId left join follows as f on f.followId = mu.memberId where f.memberId = ? order by id desc limit "+this.request.query.limit,[this.session.user])
    //     for (let i = 0; i < result.length; i++) {
    //       if (result[i].type == "article") {
    //         var items = await sqlStr("select a.title,a.id as articleId,if(a.type = 0,'活动','咨询') as titleType,o.name as organizationsName,a.organizationsId from article as a left join organizations as o on o.id = a.organizationsId where a.updateId = ?",[result[i].id])
    //         result[i].list = items
    //       }else if (result[i].type == "image") {
    //         var items = await sqlStr("select s.name as specialityName,ms.id as memberSpecialityId,w.name as workName,w.id as workId from works as w where w.updateId = ?",[result[i].id])
    //         result[i].list = items
    //       }
    //     }

    //     this.body = {status:200,data:result}
    // },
    // suggestions:async function(next){
    //       await next;
    //       if (!this.session.user) {
    //             this.body = { status: 600, msg: "尚未登录" }
    //             return
    //         }

    //       var data = this.request.body
    //       var contact = data.contact[0].trim().html2Escape()
    //       var content = data.text[0]

    //       if (!contact || contact.length > 40) {
    //             this.body = { status: 500, msg: "标题不能为空或者大于40个字符" }
    //             return
    //       }


    //     var resultt = await save('Suggestion',{contact:contact,content:content})

    //     if (resultt.id) {
    //         this.body = {status:200,msg:"谢谢您的建议！我们已收到"}
    //         return
    //     }else{
    //         this.body = {status:500,msg:"数据保存失败"}
    //         return
    //     }

    // },
    submitUserinfo:async function(next){
        await next
        var nickname = this.request.body.nickname[0].trim()
        var brief = this.request.body.brief[0].trim()
        var address = this.request.body.address[0].trim()
        // var price = this.request.body.price[0].trim()
        // console.log(this.request.body.names)
        var head = this.request.body.names[0]
        if (!nickname) {
            this.body = {status:"600",msg:"昵称不能为空"}
        }

        var result = await sqlStr("select * from member where nickname = ? and id != ?",[nickname,this.session.user])
        if (result.length > 1) {
            this.body = { status: 600, msg: "昵称不能重复" }
            return
        }else{
            var updates = await sqlStr("update member set nickname = ?,brief = ?,head=?,address = ? where id = ?",[nickname,brief,head,address,this.session.user])
            if (updates.affectedRows == 1) {
                this.body = {status:200,msg:"更新成功",data:{head:String(head)}}
                return
            }else{
                this.body = {status:500,msg:"更新失败"}
                return
            }
        }
        // console.log(this.request.body)
    },
    // noReadMessages:async function(next){
    //    // if (!this.session.user) {
    //    //          this.body = { status: 600, msg: "尚未登录" }
    //    //          return
    //    //      }
    //     await next
    //     var countMsg = await aggregate("Chat",[{$match:{sendTo:{$eq:this.session.user},status:{$eq:0}}},{$group:{_id:"$sendTo",total:{$sum:1}}}])
    //     var countLike = await aggregate("Like",[{$match:{hostId:{$eq:this.session.user},status:{$eq:0}}},{$group:{_id:"$hostId",total:{$sum:1}}}])
    //     var countFocus = await aggregate("Focus",[{$match:{hostId:{$eq:this.session.user},status:{$eq:0}}},{$group:{_id:"$hostId",total:{$sum:1}}}])
    //     var countReply = await aggregate("Reply",[{$match:{hostId:{$eq:this.session.user},status:{$eq:0}}},{$group:{_id:"$hostId",total:{$sum:1}}}])
    //     this.body = {status:200,data:{
    //         msg:countMsg[0] ? countMsg[0].total : 0,
    //         like:countLike[0] ? countLike[0].total : 0,
    //         reply:countReply[0] ? countReply[0].total : 0,
    //         focus:countFocus[0] ? countFocus[0].total : 0
    //     }}
      
    // },
    // notices:async function(next){
    //     // if (!this.session.user) {
    //     //         this.body = { status: 600, msg: "尚未登录" }
    //     //         return
    //     //     }
    //     await next
    //     var type = this.request.query.type
    //     var p = this.request.query.p
    //     var limit = this.request.query.limit
    //     if (!type || !p || !limit) {
    //             this.body = { status: 600, msg: "缺少参数" }
    //             return
    //         }
    //     if (type == "focus") {
    //         var result = await findLimit("Focus",{hostId:this.session.user},{sort:{'_id':-1},p:p,limit:parseInt(limit)})
    //         var updates = await update("Focus",{hostId:this.session.user,status:0},{$set:{status:1}},{multi:true})
    //     }else if(type == "reply"){
    //         var result = await findLimit("Reply",{hostId:this.session.user},{sort:{'_id':-1},p:p,limit:parseInt(limit)})
    //         var updates = await update("Reply",{hostId:this.session.user,status:0},{$set:{status:1}},{multi:true})
    //     }else{
    //         var result = await findLimit("Like",{hostId:this.session.user},{sort:{'_id':-1},p:p,limit:parseInt(limit)})
    //         var updates = await update("Like",{hostId:this.session.user,status:0},{$set:{status:1}},{multi:true})
    //     }
    //     if(updates.ok != undefined){
    //         this.body = {status:200,data:result}
    //     }else{
    //         this.body = {status:500,msg:"更新通知状态失败"}
    //     }
    // },
    getMylikes:async function(next){
        await next
        var id = this.request.query.id
        var limit = this.request.query.limit
        var p = this.request.query.p
        if (!id || !limit || !p) {
            this.body = {status:500,msg:"缺少参数"}
            return 
        }
        var limits = `${(p-1)*limit},${limit}`
        var result = await sqlStr("select m.id as memberId,m.head,m.nickname,mu.createAt,mu.type,mu.id as updateId from likes as l left join memberupdates as mu on l.updatesId = mu.id left join member as m on m.id = mu.memberId where l.memberId = ? and m.id != ? order by l.id desc limit " + limits,[this.session.user,this.session.user])

        for (let i = 0; i < result.length; i++) {
            var items = await sqlStr("select w.name as workName,w.id as workId from works as w where w.updateId = ?",[result[i].updateId])
            result[i].works = items
        }
        this.body = {status:200,data:result}
    },
    getFollows: async function(next){
      await next
      var id = this.request.query.id
        var limit = this.request.query.limit
        var p = this.request.query.p
        if (!id || !limit || !p) {
            this.body = {status:500,msg:"缺少参数"}
            return 
        }
        var limits = `${(p-1)*limit},${limit}`
      var result = await sqlStr("select m.nickname,m.head,m.brief,m.id from follows as f left join member as m on m.id = f.followId where f.memberId = ? limit "+limits,[id])
      this.body = {status:200,data:result}
    },
    getFans: async function(next){
      await next
      var id = this.request.query.id
        var limit = this.request.query.limit
        var p = this.request.query.p
        if (!id || !limit || !p) {
            this.body = {status:500,msg:"缺少参数"}
            return 
        }
        var limits = `${(p-1)*limit},${limit}`
      var result = await sqlStr("select m.nickname,m.brief,m.head,m.id,ff.id as focusHim from follows as f left join member as m on m.id = f.memberId left join follows as ff on ff.memberId = ? and ff.followId = m.id where f.followId = ? limit "+limits,[id,id])
      this.body = {status:200,data:result}
    },
    getFriends: async function(next){
      await next
      var id = this.request.query.id
        var teamId = this.request.query.teamId
        var limit = this.request.query.limit
        var p = this.request.query.p
        if (!id || !limit || !p) {
            this.body = {status:500,msg:"缺少参数"}
            return 
        }
        var limits = `${(p-1)*limit},${limit}`
        if (teamId) {
            var result = await sqlStr("select m.nickname,m.brief,m.id,m.head from follows as f left join member as m on m.id = f.memberId where f.followId = ? and (select count(*) from follows as ff where ff.memberId = ? and f.memberId = ff.followId) > 0 and m.id not in (select memberId from memberTeam where teamId = ?) limit "+limits,[id,id,teamId])
        }else{
            var result = await sqlStr("select m.nickname,m.brief,m.id,m.head from follows as f left join member as m on m.id = f.memberId where f.followId = ? and (select count(*) from follows as ff where ff.memberId = ? and f.memberId = ff.followId) > 0 limit "+limits,[id,id])
        }
      this.body = {status:200,data:result}
    },
    comments:async function(next){
      await next
      var id = this.request.query.id
      var limit = this.request.query.limit
      var p = this.request.query.p
      if (!id || !limit || !p) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
      var user = this.session.user ? this.session.user : 0
      var limits = `${(p-1)*limit},${limit}`
      if (p==1) {
        var result = await sqlStr("select mu.id,mu.type,mu.text,mu.createAt,(select count(*) from likes where updatesId = mu.id) as likes,(select count(*) from likes where updatesId = mu.id and memberId = ?) as isLiked,(select count(*) from comments where updatesId = mu.id) as comments,mu.memberId,m.nickname,m.head from memberupdates as mu left join member as m on m.id = mu.memberId where (mu.type = 'image' or mu.type = 'video') and mu.id = ?",[user,id])
        // console.log("result",result)
        var comments = await sqlStr("select c.comment,c.id,c.memberId,mm.nickname as replyTo,c.createdAt,m.nickname,m.head from comments as c left join reReply as r on r.commentsId = c.id left join member as m on m.id = c.memberId left join comments as cc on cc.id = r.replyTo left join member as mm on mm.id = cc.memberId where c.updatesId=? order by c.id limit " + limits,[id])
        // console.log("comments",comments)
        var items = await sqlStr("select s.name as specialityName,ms.id as memberSpecialityId,w.name as workName,w.id as workId from works as w left join memberSpeciality as ms on ms.id = w.memberSpecialityId left join specialities as s on s.id = ms.specialitiesId where w.updateId = ?",[id])
        result[0].works = items
        result[0].commentContent = comments
      }else{
        var result = await sqlStr("select c.comment,c.id,c.memberId,mm.nickname as replyTo,c.createdAt,m.nickname,m.head from comments as c left join reReply as r on r.commentsId = c.id left join member as m on m.id = c.memberId left join comments as cc on cc.id = r.replyTo left join member as mm on mm.id = cc.memberId where c.updatesId=? order by c.id limit " + limits,[id])
      }
      this.body = {status:200,data:result}
    },
    reply:async function(next){   //评论
      await next
      var comment = this.request.body.comment.trim().html2Escape()
      var updatesId = this.request.body.id

      if (!comment || !updatesId) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        var result = await sqlStr("select * from blacklist where blackId = ? and memberId = (select memberId from memberUpdates where id = ?)",[this.session.user,updatesId])
        if(result.length > 0){
            this.body = { status: 600, msg: "因系统设置,您不能进行此操作" }
            return
        }
        if (comment.length > 300) {
          this.body = { status: 500, msg: "回复内容不多于300个字符" }
          return
        }
      var result = await sqlStr("insert into comments set memberId = ?,updatesId=?,comment=?",[this.session.user,updatesId,comment])
  
      var myinfo = await sqlStr("select nickname,head from member where id = ?",[this.session.user])
      if (this.request.body.replyToId) { 
        // 回复通知
        var resultt = await sqlStr("insert into reReply set commentsId = (select id from comments where memberId = ? and updatesId=? order by id desc limit 1),replyTo = ?",[this.session.user,updatesId,this.request.body.replyToId])
        if (result.affectedRows == 1 && resultt.affectedRows == 1) {
              // 通知回复
              var info = await sqlStr("select m.id,w.name,mu.type from member as m left join comments as c on c.memberId = m.id left join works as w on w.updateId = c.updatesId left join memberUpdates as mu on mu.id = c.updatesId where c.id = ? limit 1",[this.request.body.replyToId])
              if (this.session.user != info[0].id){
                var items = {hostId:info[0].id,type:info[0].type,time:new Date().myFormat(),memberId:this.session.user,nickname:myinfo[0].nickname,head:myinfo[0].head,updatesId:parseInt(updatesId),workname:info[0].name,comment:comment,commentsId:result.insertId};

                  
                  if(info[0].id){

                      var toSocket = queryid(info[0].id)
                      items.ntype = "reply"
                      if (toSocket) {
                          // items.status = 1
                          toSocket.emit('notice',items);
                          console.log("通知回复消息")
                      }else{
                        var resultt = await save('notice',items)
                      }
                        // if (resultt.hostId) {
                          this.body = {status:200,data:{insertId:result.insertId}}
                          return
                        // }
                  }else{
                      this.body = {status:500,msg:"操作失败"}
                      return
                  }
              }else{
                  this.body = {status:200,data:{insertId:result.insertId}}
                  return
              }
        }
      }else{
        if (result.affectedRows == 1) {
             // 通知评论
            var info = await sqlStr("select m.id,w.name,mu.type from member as m left join memberupdates as mu on mu.memberId = m.id left join works as w on w.updateId = mu.id where mu.id = ? limit 1",[updatesId])

            if (this.session.user != info[0].id){
            var items = {hostId:info[0].id,time:new Date().myFormat(),type:info[0].type,memberId:this.session.user,nickname:myinfo[0].nickname,head:myinfo[0].head,updatesId:parseInt(updatesId),workname:info[0].name,comment:comment,commentsId:result.insertId};

                
                if(info[0].id){

                    var toSocket = queryid(info[0].id)

                    items.ntype = "reply"
                  if (toSocket) {
                      // items.status = 1
                      toSocket.emit('notice',items);
                      console.log("通知回复消息")
                  }else{
                    var resultt = await save('notice',items)
                    console.log("存储成功")
                  }
                    // if (resultt.hostId) {
                      this.body = {status:200,data:{insertId:result.insertId}}
                      return
                    // }
                }else{
                    this.body = {status:500,msg:"操作失败"}
                    return
                }
              }else{
                this.body = {status:200,data:{insertId:result.insertId}}
                  return
              }

        }
      }
      this.body = {status:500,msg:"操作失败"}
    },
    deleteReply:async function(next){
      await next
      if (!this.request.query.id) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
      var result = await sqlStr("delete c.*,r.* from comments as c left join reReply as r on r.commentsId = c.id where c.id = ?",[this.request.query.id])
      if (result.affectedRows > 0) {
            var resultt = await remove("notice",{ntype:"reply",memberId:this.session.user,commentsId:this.request.query.id,status:0})
            // console.log(resultt.result)
                if(resultt.result.ok == 1){
                    this.body = {status:200,data:"ok"}
                    return
                }
      }
      this.body = {status:500,msg:"操作失败"}
    },
    blacklist:async function(next){
        await next
        var id = this.request.body.id 
        if (!id) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        // 是否好友关系
        var result = await sqlStr("delete from follows where (memberId = ? and followId = ?) or (memberId = ? and followId = ?)",[this.session.user,id,id,this.session.user])
        // console.log(result)
        var resultt = await sqlStr("insert into blacklist set memberId = ?,blackId = ?",[this.session.user,id])
        if(resultt.affectedRows == 1){
            this.body = {status:200,data:"ok"}
            return
        }
        this.body = {status:500,data:"操作失败"}
        return
    },
    deleteblacklist:async function(next){
        await next
        var id = this.request.query.id 
        if (!id) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        var resultt = await sqlStr("delete from blacklist where memberId = ? and blackId = ?",[this.session.user,id])
        if(resultt.affectedRows == 1){
            this.body = {status:200,data:"ok"}
            return
        }
        this.body = {status:500,data:"操作失败"}
        return
    }
}
export default memberController;
