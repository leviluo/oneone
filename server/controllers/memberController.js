import { sqlStr,getByItems, insert } from '../dbHelps/mysql'
import {queryid} from '../routers/chat.js'
import mongoose from 'mongoose'
import {save,find,update,remove,aggregate,findLimit} from '../dbHelps/mongodb'
import {mergeMulti} from './utils'

const memberController = {
    addSpeciality:async function(next){

        await next

        var brief = this.request.body.brief.trim().html2Escape()
        var experience = this.request.body.experience.trim().html2Escape()
        var speciality = this.request.body.speciality.trim().html2Escape()

        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }

        if (!speciality || !brief || !experience ) {
        	this.body = { status: 500, msg: "缺少参数" }
            return
        }

        if (brief.length > 300) {
            this.body = { status: 500, msg: "简介超过了300个字符" }
            return
        }
        var resultcount = await sqlStr("select count(*) as count from memberSpeciality where memberId=?",[this.session.user])
        if(resultcount[0].count > 4){
            this.body = { status: 500, msg: "最多添加5项专业" }
            return
        }

        var resultrepeat = await sqlStr("select * from memberSpeciality where memberId=? and specialitiesId=(select id from specialities where name= ?)",[this.session.user,speciality])
        // console.log('resultrepeat',resultrepeat)
        if(resultrepeat.length > 0){
            this.body = { status: 500, msg: "已经添加了此专业" }
            return
        }

        var result = await sqlStr("insert into memberSpeciality set brief = ?,experience = ?,memberId=?,specialitiesId=(select id from specialities where name= ?)",[brief,experience,this.session.user,speciality])
        if (result.affectedRows == 1 ) {
            this.body = { status: 200,msg:"插入成功",result:{insertId:result.insertId}}
            return
        }else{
            this.body = { status: 500,msg:"插入数据失败"}
        }

    },
    getMemberInfo:async function(next){
        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            // this.body = { status: 500, msg: "缺少参数" }
            return
        }
        var result = await sqlStr("select m.address,m.sex,m.phone,m.id,m.brief,(select count(id) from follows where memberId = m.id) as follows,(select count(id) from follows where followId = m.id) as fans from member as m where id = ?",[this.session.user])
        this.body = {status:200,data:result}
    },
    message:async function(next){

        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
        await next

        var text = this.request.body.text

        if(!text || !this.request.body.sendTo){
            this.body = { status: 500, msg: "缺少参数" }
            return
        }

        if (text.length > 1000) {
            this.body = { status: 500, msg: "消息过长" }
            return
        }

        var result = await sqlStr("insert into message set fromMember = ?,toMember = ?,text = ?",[this.session.user,this.request.body.sendTo,text])
        if (result.affectedRows == 1) {
            var toName = this.request.body.sendTo;
            var info = await sqlStr("select * from member where id = ?",[this.session.user])

            // var message = mongoose.model('Message');

            var items = {type:"privatemessage",hostId:this.request.body.sendTo,memberId:this.session.user,nickname:info[0].nickname};

            // var resultt = await save(data)

            var resultt = await save('Message',items)

            if (resultt.id) {
                // 在线发送socket消息
                var toSocket = queryid(toName)
                // console.log("000")
                if (toSocket) {
                    // console.log("111")
                    toSocket.emit('message',{text:text,sendTo:this.request.body.sendTo,sendFrom:info[0].id,sendnickname:info[0].nickname});
                    toSocket.emit('primessage',{type:"privatemessage",hostId:this.request.body.sendTo,memberId:this.session.user,nickname:info[0].nickname})
                }else{
                    // console.log("不在线")
                    // toSocket.emit('message',{text:text,sendTo:this.request.body.sendTo,sendnickname:nickname[0].nickname});
                }

                this.body = { status: 200}
                return
            }else{
                 this.body = { status: 500, msg:"保存消息失败"}
                return
            }

        }else{
            this.body = { status: 500,msg:'数据库插入失败'}
        }
        await next
    },
    historyChat:async function(next){
        var lastUpdate = this.request.query.lastUpdate
        var chatWith = this.request.query.chatWith
        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
        if (!chatWith) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        if (lastUpdate) {
        var result = await sqlStr("select m.text,m.time,mF.id as send,mF.nickname as sendnickname,mT.id as sendTo,mT.nickname as sendTonickname from message as m left join member as mF on mF.id = m.fromMember left join member as mT on mT.id=m.toMember where ((m.fromMember = ? and m.toMember = ?) or (m.toMember = ? and m.fromMember = ?)) and unix_timestamp(m.time) < unix_timestamp(?) order by m.time desc limit 10",[this.session.user,chatWith,this.session.user,chatWith,lastUpdate])
        }else{ 
        var result = await sqlStr("select m.text,m.time,mF.id as send,mF.nickname as sendnickname,mT.id as sendTo,mT.nickname as sendTonickname from message as m left join member as mF on mF.id = m.fromMember left join member as mT on mT.id=m.toMember where (m.fromMember = ? and m.toMember = ?) or (m.toMember = ? and m.fromMember = ?) order by m.time desc limit 10",[this.session.user,chatWith,this.session.user,chatWith])

            // var updates = await update("Message",{hostId:this.session.user,status:0,type:"privatemessage"},{$set:{status:1}},{multi:true})
            // // console.log(updates)
            // if(updates.ok){
            //     this.body = {status:200,data:result}
            // }else{
            //     this.body = {status:500,msg:"更新通知状态失败"}
            // }

        }

        this.body = {status:200,data:result}
    },
    updateActive:async function(next){
        var lastUpdate = this.request.query.lastUpdate
        var chatWith = this.request.query.chatWith
        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
        await next;
        if (!lastUpdate && this.body.status == 200) {
            var result = await sqlStr("update message set active = 1 where toMember = ? and fromMember = ? and active = 0",[this.session.user,chatWith])
        }
        // this.body = this.body
    },
    getMessageList:async function(next){
        if (!this.session.user || !this.request.query.limit) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
        var id = this.session.user
        var result = await sqlStr(`select message.time,message.text,message.active,member.nickname,member.id as memberId,if(message.fromMember=?,1,0) as isSend from message left join member on (member.id = message.fromMember or member.id = message.toMember) and member.id != ? where message.id in (select max(ms.id) from message as ms left join member as m on (m.id = ms.toMember or m.id = ms.fromMember) and m.id != ? where ms.fromMember = ? or ms.toMember = ? group by m.phone) order by message.time desc limit ${this.request.query.limit};`,[id,id,id,id,id])
        var count = await sqlStr("select m.phone from message as ms left join member as m on (m.id = ms.toMember or m.id = ms.fromMember) and m.id != ? where ms.fromMember = ? or ms.toMember = ? group by m.phone;",[id,id,id])
        var updates = await update("Message",{hostId:this.session.user,status:0,type:"privatemessage"},{$set:{status:1}},{multi:true})
            // console.log(updates)
        if(updates.ok){
            // this.body = {status:200,data:result}
            this.body = {status:200,data:result,count:count.length}
        }else{
            this.body = {status:500,msg:"更新通知状态失败"}
        }
            
    },
    modifyNickname:async function(next){

        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }

        var nickname = this.request.body.nickname.trim().html2Escape()

        var flag = nickname.StringFilter(1,20)
        if (flag) {
            this.body = { status: 500, msg: `昵称${flag}`}
            return
        }

        var result = await sqlStr("update member set nickname = ? where id = ?",[nickname,this.session.user])
        if (result.affectedRows == 1) {
        this.body = {status:200}
        return
        }
        this.body = {status:500,msg:"修改失败"}
    },
    modifyAddress:async function(next){

        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }

        var address = this.request.body.address.trim().html2Escape()

        var flag = address.StringFilter(1,100)

        if (flag) {
            this.body = { status: 500, msg: `地址${flag}`}
            return
        }

        var result = await sqlStr("update member set address = ? where id = ?",[address,this.session.user])
        if (result.affectedRows == 1) {
        this.body = {status:200}
        return
        }
        this.body = {status:500,msg:"修改失败"}
        next
    },
    modifySpeciality:async function(next){
        await next

        var brief = this.request.body.brief.trim().html2Escape()
        var experience = this.request.body.experience.trim().html2Escape()
        var speciality = this.request.body.speciality.trim().html2Escape()

        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }

        if (!this.request.body.speciality || !brief || !experience ) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }

        var flag = brief.StringLen(0,300)
        if (flag) {
            this.body = { status: 500, msg: `简介${flag}` }
            return
        }

        var result = await sqlStr("update memberSpeciality set brief = ?,experience=? where specialitiesId = (select id from specialities where name = ?) and memberId = ?",[brief,experience,speciality,this.session.user])
        
        if (result.affectedRows == 1) {
        this.body = {status:200}
        return
        }

        this.body = {status:500,msg:"修改失败"}
        next
    },
    deleteSpeciality:async function(next){
        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
        if (!this.request.body.speciality) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        var result = await sqlStr("delete from memberSpeciality where specialitiesId = (select id from specialities where name = ?) and memberId = ?",[this.request.body.speciality,this.session.user])
        
        if (result.affectedRows == 1) {
        this.body = {status:200}
        return
        }

        this.body = {status:500,msg:"删除失败"}
        next
    },
    messages:async function(){
  //私信                        “谁” 给你发了私信               属于消息（type="privatemessage"）
  //文章评价                    “谁” 在 “文章”                  属于消息（type="articlecomment"）
  //请求入群                    “谁” 请求加入 “社团”            属于消息（type="attendrequest"）
  //文章中回复了你              “谁” 在 “文章”                  属于消息（type="articlereply"）
        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }

        var result = await find("Message",{hostId:this.session.user,status:0},{sort:{'_id':-1}}) 
        this.body = {status:200,data:result}

    },
    notices:async function(){
  //关注                        “谁“ 关注了你                   属于通知（type="focusyou"）
  //通知                        “社团” 通过了你的加入请求       属于通知（type="attendapprove"）
    if (!this.session.user) {
        this.body = { status: 600, msg: "尚未登录" }
        return
    }
    // var notice = mongoose.model('Notice');
    if (this.request.query.type == 'noread') {

        var result = await find("Notice",{hostId:this.session.user,status:0},{sort:{'_id':-1}}) 

        var updates = await update("Notice",{hostId:this.session.user,status:0},{$set:{status:1}},{multi:true})

        if(updates.ok){
            this.body = {status:200,data:result}
        }else{
            this.body = {status:500,msg:"更新通知状态失败"}
        }
        
    }else if (this.request.query.type == 'all') {

        var result = await findLimit("Notice",{hostId:this.session.user},{sort:{'_id':-1},p:this.request.query.p,limit:parseInt(this.request.query.limit)}) 

        var count = await aggregate("Notice",{_id:"$hostId",total:{$sum:1}})

        var updates = await update("Notice",{hostId:this.session.user,status:0},{$set:{status:1}},{multi:true})

        if(updates.ok){
            this.body = {status:200,data:result,count:count[0].total}
        }else{
            this.body = {status:500,msg:"更新通知状态失败"}
        }

    }

    },
    updatenotices:async function(){
        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
        // var notice = mongoose.model('Notice');
        var updates = await update("Notice",{hostId:this.session.user,status:0},{$set:{status:1}},{multi:true})
        // console.log(updates)
        if(updates.ok){
            this.body = {status:200}
        }else{
            this.body = {status:500,msg:"更新通知状态失败"}
        }
    },
    allnotices:async function(){
       if (!this.session.user) {
        this.body = { status: 600, msg: "尚未登录" }
        return
    }
    // var notice = mongoose.model('Notice');
    var result = await find("Notice",{hostId:this.session.user},{sort:{'_id':-1}}) 
    
    this.body = {status:200,data:result}
    },
    submitPhotos:async function(next){
        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
      await next
      var names = this.request.body.names
      var id = this.request.body.id[0]
      if (!id) {
        this.body = {status:500,msg:"缺少参数"}
        return
      }
      if (names.length > 0) {

        var resultt = await sqlStr("insert into memberupdates set memberId = ?,type = ?",[this.session.user,'image'])
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
                this.body = {status:200}
                return
            }

        }
        this.body= {status:500,msg:"写入数据库失败"}
      }else{
        this.body = {status:500,msg:"上传图片失败"}
      }
    },
    addLike: async function(){
        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
        if (!this.request.query.id) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        var result = await sqlStr("delete from likes where memberId = ? and worksId = ?",[this.session.user,this.request.query.id])
        if (result.affectedRows == 1) {
            this.body = {status:200}
            return
        }else if(result.affectedRows == 0){
            var result = await sqlStr("insert into likes set memberId = ?,worksId = ?",[this.session.user,this.request.query.id])
            if (result.affectedRows == 1) {
            this.body = {status:200}
            return
            }
        }
        this.body = {status:500,msg:"操作数据库失败"}
    },
    deletePhoto:async function(next){
        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
        if (!this.request.query.id) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        if (!this.request.query.name) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        await next

        var result = await sqlStr("delete l.*,w.* from works as w left join likes as l on l.worksId = w.id left join memberSpeciality as m on m.id = w.memberSpecialityId where w.id = ? and m.memberId = ?",[this.request.query.id,this.session.user])

        if (result.affectedRows == 1) {
            this.body = {status:200}
        }else{
            this.body = {status:500,msg:"删除失败"}
        }
    },
    followOne:async function(){

        var id = this.request.query.id

        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
        if (!id) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        var result = await sqlStr("select * from follows where memberId = ? and followId = ?",[this.session.user,id])
        if (result.length > 0) {
            this.body = { status: 500, msg: "请不要重复关注" }
            return
        }else{
            result = await sqlStr("insert into follows set memberId = ?,followId = ?",[this.session.user,id])
            if (result.affectedRows == 1) {
                var nickname = await sqlStr("select nickname from member where id = ?",[this.session.user])
                
                // 取关后通知
                // var notice = mongoose.model('Notice');

                var items = {type:"focusyou",hostId:id,memberId:this.session.user,nickname:nickname[0].nickname};

                var resultt = await save('Notice',items)
                
                if(resultt.id){

                    var toSocket = queryid(id)

                    if (toSocket) {
                        toSocket.emit('notice',resultt);
                    }

                    this.body = {status:200}
                }else{
                    this.body = {status:500,msg:"操作失败"}
                }

            }else{
                this.body = {status:500,msg:"操作失败"}
            }
        }
    },
    followOutOne:async function(){
        var id = this.request.query.id
        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
        if (!this.request.query.id) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        var result = await sqlStr("delete from follows where memberId = ? and followId = ?",[this.session.user,id])
        if (result.affectedRows == 1) {
            this.body ={status:200}
            // 取关后删除通知
                // var notice = mongoose.model('Notice');
                var resultt = await remove("Notice",{hostId:id,memberId:this.session.user,type:"focusyou"})
                if(resultt.result.n > 0){
                    this.body = {status:200}
                    return
                }

        }else{
            this.body ={status:500,msg:"操作失败"}
        }
    },
    modifyBrief:async function(){
        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
        var brief = this.request.body.brief.trim().html2Escape()
        var flag = brief.StringFilter(1,100)
        if (flag) {
            this.body = { status: 500, msg: `简介${flag}`}
            return
        }
        var result = await sqlStr("update member set brief = ? where phone = ?",[brief,this.session.user])
        if (result.affectedRows == 1) {
            this.body ={status:200}
        }else{
            this.body ={status:500,msg:"操作失败"}
        }
    },
    // addLikeByName:async function(){
    //     if (!this.session.user) {
    //         this.body = { status: 600, msg: "尚未登录" }
    //         return
    //     }
    //     if (!this.request.query.name) {
    //         this.body = { status: 500, msg: "缺少参数" }
    //         return
    //     }
    //     var result = await sqlStr("delete from likes where memberId = ? and worksId = (select id from works where name = ?)",[this.session.user,this.request.query.name])
    //     if (result.affectedRows == 1) {
    //         this.body = {status:200}
    //         return
    //     }else if(result.affectedRows == 0){
    //         var result = await sqlStr("insert into likes set memberId = ?,worksId = (select id from works where name = ?)",[this.session.user,this.request.query.name])
    //         if (result.affectedRows == 1) {
    //         this.body = {status:200}
    //         return
    //         }
    //     }
    //     this.body = {status:500,msg:"操作数据库失败"}
    // },
    ifliked:async function(){
        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
        if (!this.request.query.id) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        var result = await sqlStr("select * from likes where worksId = ? and memberId = ?",[this.request.query.id,this.session.user])
        if (result.length == 1) {
            this.body = { status: 200, msg: 1 }
        } else{
            this.body = { status: 200, msg: 0 }
        }
    },
    getupdates:async function(){
        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
 
        var result = await sqlStr("select mu.id,mu.type,mu.createAt,mu.memberId,m.nickname from memberupdates as mu left join member as m on m.id = mu.memberId left join follows as f on f.followId = mu.memberId where f.memberId = ? order by id desc limit "+this.request.query.limit,[this.session.user])
        for (let i = 0; i < result.length; i++) {
          if (result[i].type == "article") {
            var items = await sqlStr("select a.title,a.id as articleId,if(a.type = 0,'活动','咨询') as titleType,o.name as organizationsName,a.organizationsId from article as a left join organizations as o on o.id = a.organizationsId where a.updateId = ?",[result[i].id])
            result[i].list = items
          }else if (result[i].type == "image") {
            var items = await sqlStr("select s.name as specialityName,ms.id as memberSpecialityId,w.name as workName,w.id as workId from works as w left join memberSpeciality as ms on ms.id = w.memberSpecialityId left join specialities as s on s.id = ms.specialitiesId where w.updateId = ?",[result[i].id])
            result[i].list = items
          }
        }

        this.body = {status:200,data:result}
    },
    suggestions:async function(next){
          await next;
          if (!this.session.user) {
                this.body = { status: 600, msg: "尚未登录" }
                return
            }

          var data = this.request.body
          var contact = data.contact[0].trim().html2Escape()
          var content = data.text[0]

          if (!contact || contact.length > 40) {
                this.body = { status: 500, msg: "标题不能为空或者大于40个字符" }
                return
          }


        var resultt = await save('Suggestion',{contact:contact,content:content})

        if (resultt.id) {
            this.body = {status:200,msg:"谢谢您的建议！我们已收到"}
            return
        }else{
            this.body = {status:500,msg:"数据保存失败"}
            return
        }

    }
}
export default memberController;
