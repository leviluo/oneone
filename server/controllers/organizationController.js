import { sqlStr,getByItems } from '../dbHelps/mysql'
import chat,{queryid} from '../routers/chat.js'
import mongoose from 'mongoose'
import {save,find,remove,update} from '../dbHelps/mongodb'

const organizationController = {
    addOrganization:async function(next) {
       await next;

       var user = this.session.user;
       var name = this.request.body.name[0].trim().html2Escape()
       var brief = this.request.body.brief[0].trim().html2Escape()
       var names = this.request.body.names[0]
       var categoryId = this.request.body.categoryId[0]

       var resultcount = await sqlStr("select count(*) as count from organizations where createById=?",[user])
        if(resultcount[0].count > 4){
            this.body = { status: 500, msg: "最多可创建5个社团" }
            return
        }

      if (!name || name.length > 38) {
        this.body = { status: 500, msg: "名称不为空或者大于30位字符" }
        return
      }

      if (!brief || brief.length > 995) {
        this.body = { status: 500, msg: "简介不为空或者大于1000位字符" }
        return
      }

        var resultrepeat = await sqlStr("select * from organizations where createById=? and name=?",[user,name])

        if(resultrepeat.length > 0){
            this.body = { status: 500, msg: "社团名称不能重复" }
            return
        }

      var result = await sqlStr("insert into organizations set name = ?,brief=?,head=?,createById=?,categoryId=?",[name,brief,names,user,categoryId])
      var resultt = await sqlStr("insert into memberOrganizations set memberId = ?,organizationsId=(select id from organizations where name = ? and createById = ?);",[user,name,user])
 
      if (result.affectedRows == 1 && resultt.affectedRows == 1) {
          this.body = { status: 200}
          return
      }else{
          this.body = { status: 500,msg:"插入数据失败"}
      }
    },
    modifyOrganization:async function(next) {
      await next;

      var name = this.request.body.name[0].trim().html2Escape()
      var brief = this.request.body.brief[0].trim().html2Escape()
      var names = this.request.body.names[0]
      var id = this.request.body.id[0]

       if (!name || name.length > 38) {
        this.body = { status: 500, msg: "名称不为空或者大于30位字符" }
        return
      }

      if (!brief || brief.length > 995) {
        this.body = { status: 500, msg: "简介不为空或者大于1000位字符" }
        return
      }

       var resultrepeat = await sqlStr("select * from organizations where createById=? and name=? and id != ?",[this.session.user,name,id])

      if(resultrepeat.length > 0){
          this.body = { status: 500, msg: "社团名称不能重复" }
          return
      }

       if (names) {
       var result = await sqlStr("update organizations set name = ?,brief=?,head=? where id = ?",[name,brief,names,id])
       }else{
       var result = await sqlStr("update organizations set name = ?,brief=? where id = ?",[name,brief,id])
       }
        if (result.affectedRows == 1 ) {
            this.body = { status: 200}
            return
        }else{
            this.body = { status: 500,msg:"更新数据失败"}
        }
    },
    getOrganizationByMe:async function(){
        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
        var result = await sqlStr("select o.*,(select count(id) from organizationsrequest where organizationsId = o.id and status = 0) as requests,s.name as categoryName from organizations as o left join specialitycategory as s on s.id = o.categoryId where createById = ?",[this.session.user])
        this.body = {status:200,data:result}
    },
    getMyOrganization: async function(){
        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
        var result = await sqlStr("select o.*,s.name as categoryName from organizations as o left join specialitycategory as s on s.id = o.categoryId left join memberOrganizations as mo on mo.organizationsId = o.id where mo.memberId = ? and o.createById != ?;",[this.session.user,this.session.user])
        this.body = {status:200,data:result}
    },
    deleteOrganization:async function(){
       if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
        if (!this.request.body.id) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        var result = await sqlStr("delete o.*,mo.*,a.*,ro.* from organizations as o left join memberOrganizations as mo on mo.organizationsId = o.id left join article as a on a.organizationsId = o.id left join organizationsrequest as ro on ro.organizationsId = o.id where o.id = ?",[this.request.body.id])
        
        if (result.affectedRows > 0) {
            this.body = {status:200}
            return
        }

        this.body = {status:500,msg:"删除失败"}
    },
    basicInfo: async function(){
        if (!this.request.query.id) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        var result = await sqlStr("select o.*,s.name as categoryName,m.nickname,m.id as memberId from organizations as o left join member as m on m.id = o.createById left join specialitycategory as s on s.id = o.categoryId where o.id = ?",[this.request.query.id])
        this.body = {status:200,data:result}
    },
    getMembers: async function(){
        if (!this.request.query.id) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        var result = await sqlStr("select m.id,m.nickname from memberOrganizations as mo left join member as m on mo.memberId = m.id where mo.organizationsId = ?",[this.request.query.id])
        this.body = {status:200,data:result}
    },
    addArticle: async function(next){   //修改和添加文章
      await next;
      if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }

      var data = this.request.body
      var header = data.header[0].trim().html2Escape()
      var content = data.text[0]

      if (!header || header.length > 48) {
            this.body = { status: 500, msg: "标题不能为空或者大于50个字符" }
            return
      }

      if (!data.articleId) {

          var result = await sqlStr("insert into article set title = ?,type = ?,organizationsId =?,memberId = ?",[header,data.type[0],data.organizationId[0],this.session.user])
          if (result.insertId) {
              var items = {articleId:result.insertId,content:content};
              var resulttt = await save('Article',items)
            // 写入更新表
              var resultt = await sqlStr("insert into memberupdates set articleId = ?,memberId = ?",[result.insertId,this.session.user])
          }
          if (result.affectedRows == 1 && resultt.affectedRows == 1 && result.insertId == resulttt.articleId) {
                  this.body = {status:200}
                  return
          }
      }else{
        var result = await sqlStr("update article set title =?,type=?,updatedAt=now() where id = ?",[header,data.type[0],data.articleId[0]])
        var updates = await update("article",{articleId:data.articleId},{$set:{content:content}},{multi:true})
        // if (result.affectedRows == 1) {
        //       this.body = {status:200}
        //       return
        // }
        // console.log(result)
        // console.log(updates)
        if(updates.ok == 1 && result.affectedRows == 1){
            this.body = {status:200}
            return
        }

      }
      this.body = {status:500,msg:"发布失败"}
    },
     attendOrganization: async function(next){
      if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
      if (!this.request.body.id) {
        this.body = { status: 500, msg: "缺少参数" }
        return
      }
      var verified = this.request.body.verified.trim().html2Escape()
      var flag = verified.StringLen(0,300)
      if (flag) {
        this.body = { status: 500, msg: `验证${flag}`}
        return
      }


      var result = await sqlStr("select id from organizationsrequest where memberId = ? and organizationsId=?",[this.session.user,this.request.body.id])
      if (result.length > 0) {
          this.body = {status:500,msg:"您已申请过,等待审核"}
          return
      };
      result = await sqlStr("insert into organizationsrequest set memberId = ?,organizationsId=?,verified=?;",[this.session.user,this.request.body.id,verified])
      if (result.affectedRows == 1) {

        // 发出入社请求消息
        var info = await sqlStr("select m.memberId,o.name from memberOrganizations as m left join organizations as o on o.id = m.organizationsId where m.organizationsId = ?",[this.request.body.id])
        var nickname = await sqlStr("select nickname from member where id = ?",[this.session.user])

        var items = {type:"attendrequest",hostId:info[0].memberId,organizationsId:this.request.body.id,organizationsname:info[0].name,memberId:this.session.user,nickname:nickname[0].nickname};
        var resultt = await save('Message',items)
        
        if(resultt.id){

            var toSocket = queryid(info[0].memberId)

            if (toSocket) {
                toSocket.emit('primessage',resultt);
            }

            this.body = {status:200}
            return
        }else{
            this.body = {status:500,msg:"操作失败"}
            return
        }
      }

      this.body = {status:500,msg:"加入失败"}
    },
    quitOrganization: async function(next){
      if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
      var result = await sqlStr("delete from memberOrganizations where memberId = ? and organizationsId=?;",[this.session.user,this.request.query.id])
      if (result.affectedRows == 1) {
            this.body = {status:200}
            return
      }

      this.body = {status:500,msg:"操作失败"}
    },
    OrganizationsSortByHot:async function(next){
      var result = await sqlStr("select head,name,id,(select count(*) from memberOrganizations where organizations.id = memberOrganizations.organizationsId) as countt from organizations order by countt limit 20")
      this.body = {status:200,data:result}
    },
    getArticleList:async function(next){
      if (!this.request.query.id || !this.request.query.limit || !this.request.query.type) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
      var result = await sqlStr(`select a.id,a.title,a.updatedAt,m.nickname as publisher,m.id as memberId from article as a left join member as m on m.id = a.memberId where a.type = ? and a.organizationsId = ? limit ${this.request.query.limit}`,[this.request.query.type,this.request.query.id])
      var count = await sqlStr("select count(id) as count from article where type = ? and organizationsId = ?",[this.request.query.type,this.request.query.id])

      this.body = {status:200,data:result,count:count[0].count}
    },
    article:async function(){
      if (!this.request.query.id) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
      var result = await sqlStr("select a.*,m.nickname from article as a left join member as m on m.id = a.memberId where a.id = ?",[this.request.query.id])

      // var article = mongoose.model('Article');
      var content = await find("Article",{articleId:this.request.query.id})
      if (content[0]) {
      result[0].content = content[0].content
      }

      this.body = {status:200,data:result[0]}
    },
    reply:async function(){   //评论
      var comment = this.request.body.comment.trim().html2Escape()
      var articleId = this.request.body.articleId

      if (!comment || !articleId) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        if (!this.session.user) {
          this.body = { status: 600, msg: "尚未登录" }
          return
        }
        if (comment.length > 1000) {
          this.body = { status: 500, msg: "回复内容不多于1000个字符" }
          return
        }
      var result = await sqlStr("insert into comments set memberId = ?,articleId=?,comment=?",[this.session.user,articleId,comment])
      if (this.request.body.replyToId) { 
        var resultt = await sqlStr("insert into reReply set commentsId = (select id from comments where memberId = ? and articleId=? order by id desc limit 1),replyTo = ?",[this.session.user,articleId,this.request.body.replyToId])
        if (result.affectedRows == 1 && resultt.affectedRows == 1) {
              // 通知回复
              var info = await sqlStr("select m.id from member as m left join comments as c on c.memberId = m.id where c.id = ?",[this.request.body.replyToId])
              var resultt = await save('Message',{type:"articlereply",hostId:info[0].id,articleId:articleId})
              if (resultt.id) { 

                var toSocket = queryid(info[0].id)

                if (toSocket) {
                    toSocket.emit('primessage',resultt);
                }

                this.body = {status:200,insertId:result.insertId}
                return
              }
        }
      }else{
        if (result.affectedRows == 1) {
             // 通知评论
            var info = await sqlStr("select m.id from member as m left join article as a on a.memberId = m.id where a.id = ?",[articleId])
            if (info[0].id != this.session.user) {
              var resultt = await save('Message',{type:"articlecomment",hostId:info[0].id,articleId:articleId})
              if (resultt.id) { 

                var toSocket = queryid(info[0].id)

                if (toSocket) {
                    toSocket.emit('primessage',resultt);
                }

                this.body = {status:200,insertId:result.insertId}
                return
              }else{
                this.body = {status:500,msg: "插入消息失败" }
                return
              }
            }else{
              this.body = {status:200,insertId:result.insertId}
              return
            }
        }
      }
      this.body = {status:500,msg:"插入失败"}
    },
    ArticleReply:async function(){
      if (!this.request.query.id) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
      var result = await sqlStr("select c.comment,c.id,c.memberId,r.replyTo,c.createdAt,m.nickname from comments as c left join reReply as r on r.commentsId = c.id left join member as m on m.id = c.memberId where c.articleId=? order by c.id",[this.request.query.id])
      this.body = {status:200,data:result}
    },
    deleteReply:async function(){
      if (!this.request.query.id) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
      var result = await sqlStr("delete c.*,r.* from comments as c left join reReply as r on r.commentsId = c.id where c.id = ?",[this.request.query.id])
      if (result.affectedRows > 0) {
            this.body = {status:200}
            return
      }

      this.body = {status:500,msg:"操作失败"}
    },
    deleteArticle: async function(next){
      if (!this.request.query.id) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
      if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
      var resultt = await sqlStr("select attachedImgs from article where id = ?",[this.request.query.id])
      if (resultt[0].attachedImgs) {
       this.request.body.deletImgs = resultt[0].attachedImgs.split(',')
      }else{
        this.request.body.deletImgs = []
      }
      await next
      var result = await sqlStr("delete a.*,c.*,r.*,mu.* from article as a left join comments as c on c.articleId = a.id left join reReply as r on r.commentsId = c.id left join memberupdates as mu on mu.articleId = a.id where a.id = ? and a.memberId = ?",[this.request.query.id,this.session.user])
      if (result.affectedRows > 0) {
            this.body = {status:200}
            return
      }

      this.body = {status:500,msg:"操作失败"}
    },
    getMyPost:async function(){
      if (!this.session.user || !this.request.query.limit) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
      var result = await sqlStr("select a.title,a.id,a.organizationsId,a.type,a.updatedAt,o.name,(select count(*) from comments where comments.articleId = a.id) as count,(select count(*) from comments where comments.articleId = a.id and comments.status = 0) as noRead from article as a left join organizations as o on o.id = a.organizationsId where a.memberId = ? order by noRead desc limit "+this.request.query.limit,[this.session.user])
      var count = await sqlStr("select count(id) as count from article where memberId = ?",[this.session.user])
      this.body = {status:200,data:result,count:count[0].count}
    },
    getReplyMe:async function(){  //回复我的消息
      if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
      var result = await sqlStr("select m.id as memberId,m.nickname,c.createdAt,c.comment,c.id as replyId,a.id as articleId,r.status,a.title,o.name,o.id as organizationsId from reReply as r left join comments as c on c.id = r.commentsId left join member as m on m.id = c.memberId left join article as a on a.id = c.articleId left join organizations as o on o.id = a.organizationsId left join comments as cc on cc.id = r.replyTo where cc.memberId = ? order by r.id desc limit "+this.request.query.limit,[this.session.user])
      var count = await sqlStr("select count(r.id) as count from reReply as r left join comments as c on c.id = r.replyTo where c.memberId = ?",[this.session.user])
      // var resultt = await sqlStr("update reReply set status = 1 where replyTo in (select id from comments where memberId = ?) and status = 0 order by id desc limit "+this.request.query.limit,[this.session.user])

      var updates = await update("Message",{hostId:this.session.user,status:0,type:"articlereply"},{$set:{status:1}},{multi:true})
      // console.log(updates)
      if(updates.ok){
          this.body = {status:200,data:result,count:count[0].count}
      }else{
          this.body = {status:500,msg:"更新通知状态失败"}
      }

      this.body = {status:200,data:result,count:count[0].count}
    },
    commentsme:async function(){
      if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
      var result = await sqlStr("select m.id as memberId,m.nickname,a.title,a.id as articleId,c.comment,c.createdAt,c.id as replyId from comments as c left join member as m on m.id = c.memberId left join article as a on a.id = c.articleId where a.memberId = ? order by c.id desc limit "+this.request.query.limit,[this.session.user])
      var count = await sqlStr("select count(c.id) as count from comments as c left join article as a on a.id = c.articleId where a.memberId = ?",[this.session.user])

      var updates = await update("Message",{hostId:this.session.user,status:0,type:"articlecomment"},{$set:{status:1}},{multi:true})
      // console.log(updates)
      if(updates.ok){
          this.body = {status:200,data:result,count:count[0].count}
      }else{
          this.body = {status:500,msg:"更新通知状态失败"}
      }

    },
    getrequestData:async function(){
      if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
      if (!this.request.query.id || !this.request.query.limit) {
          this.body = { status: 600, msg: "缺少参数" }
          return
      };
      var result = await sqlStr("select m.id as memberId,m.nickname,ro.createdAt,ro.verified,ro.id from organizationsrequest as ro left join member as m on m.id = ro.memberId where ro.status = 0 and ro.organizationsId = ? limit "+this.request.query.limit,[this.request.query.id])
      var count = await sqlStr("select count(id) as count from organizationsrequest where organizationsId = ? and status = 0",[this.request.query.id])

      this.body = {status:200,data:result,count:count[0].count}
    },
    isApprove:async function(){
      if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
      var id = this.request.query.id
      var flag = this.request.query.flag

      if ((!flag && flag !=0) || !id) {
          this.body = { status: 600, msg: "缺少参数" }
          return
      };

      var info = await sqlStr("select ro.memberId,ro.organizationsId,o.name,o.head from organizationsRequest as ro left join organizations as o on o.id = ro.organizationsId where ro.id = ?",[id])
        
      if (flag == 1) {  //通过
        var resultt = await sqlStr("insert into memberorganizations set memberId = (select memberId from organizationsrequest where id = ?),organizationsId=(select organizationsId from organizationsrequest where id = ?);", [id,id])
        if (resultt.affectedRows > 0) {
        // var result = await sqlStr("update organizationsrequest set status = 1 where id = ?", [id])
          // if (result.affectedRows > 0) {

            // 通过入社请求通知
            var items = {type:"attendapprove",hostId:info[0].memberId,organizationsId:info[0].organizationsId,organizationsname:info[0].name,organizationshead:info[0].head};
            var resultt = await save('Notice',items)

            if(resultt.id){

                var toSocket = queryid(info[0].memberId)

                if (toSocket) {
                    toSocket.emit('notice',resultt);
                }

                // this.body = {status:200}
                // return
            }else{
                this.body = {status:500,msg:"操作失败"}
                return
            }
          // }
        }

      }

        var result = await sqlStr("delete from organizationsrequest where id = ?", [id])
        var resultt = await remove("Message",{type:"attendrequest",hostId:this.session.user,memberId:info[0].memberId,organizationsId:info[0].organizationsId}) 
        if (result.affectedRows > 0) {
          this.body = {status:200}
          return
        }

        this.body= {status:500,msg:"发生错误"}
    },
    // getApproveMe:async function(){
    //   if (!this.session.user) {
    //         this.body = { status: 600, msg: "尚未登录" }
    //         return
    //     }
    //   var result = await sqlStr("select o.id,o.name from organizationsrequest as ro left join organizations as o on o.id = ro.organizationsId where ro.status = 1 and ro.memberId = ?",[this.session.user])
    //   if (result.length > 0) {
    //     await sqlStr("delete from organizationsrequest where status = 1 and memberId = ?", [this.session.user])
    //   };

    //   this.body = {status:200,data:result}
    // },
    message:async function(next){


        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }

        await next
        
        var text = this.request.body.text.trim()

        if(!text || !this.request.body.sendTo){
            this.body = { status: 500, msg: "缺少参数" }
            return
        }

        var flag = text.StringLen(0,500)

        if (flag) {
          this.body = { status: 500, msg:`文本内容${flag}` }
          return
        }

        var result = await sqlStr("insert into groupmessage set fromMember = ?,organizationsId = ?,text = ?",[this.session.user,this.request.body.sendTo,text])
        if (result.affectedRows == 1) {

            var result = await sqlStr("select * from member where id = ?",[this.session.user])
            // console.log(chat)
            chat.io.to(this.request.body.sendTo).emit('groupMessage', {text:text,sendFrom:this.session.user,nickname:result[0].nickname});

            this.body = { status: 200}
            return
        }else{
            this.body = { status: 500,msg:'数据库插入失败'}
        }
        await next
    },
    historyChat:async function(next){
        var lastUpdate = this.request.query.lastUpdate
        var organizationsId = this.request.query.organizationsId
        if (!organizationsId) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        if (lastUpdate) {
        var result = await sqlStr("select m.text,m.time,mF.id as sendFrom,mF.nickname from groupmessage as m left join member as mF on mF.id = m.fromMember where m.organizationsId = ? and unix_timestamp(m.time) < unix_timestamp(?) order by m.time desc limit 10",[organizationsId,lastUpdate])
        }else{ 
        var result = await sqlStr("select m.text,m.time,mF.id as sendFrom,mF.nickname from groupmessage as m left join member as mF on mF.id = m.fromMember where m.organizationsId = ? order by m.time desc limit 10",[organizationsId])
        }
        this.body = {status:200,data:result}
    },
    requestorganizations:async function(){
        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
        var result = await sqlStr("select ro.*,m.nickname,o.name from organizationsRequest as ro left join member as m on m.id = ro.memberId left join organizations as o on o.id = ro.organizationsId where o.createById = ? order by ro.id desc limit "+ this.request.query.limit,[this.session.user])
        var count = await sqlStr("select count(ro.id) as count from organizationsRequest as ro left join organizations as o on o.id = ro.organizationsId where o.createById = ?",[this.session.user])

        var updates = await update("Message",{hostId:this.session.user,status:0,type:"attendrequest"},{$set:{status:1}},{multi:true})

        // console.log(updates)
        if(updates.ok){
            this.body = {status:200,data:result,count:count[0].count}
        }else{
            this.body = {status:500,msg:"更新通知状态失败"}
        }
    },
    deleteMember:async function(){
       var id = this.request.query.id
       var organizationsId = this.request.query.organizationsId
       if (!id || !organizationsId) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        var result = await sqlStr("delete from memberOrganizations where memberId = ? and organizationsId = ?",[id,organizationsId])
        if (result.affectedRows > 0) {
          this.body = { status: 200 }
        }else{
          this.body = { status: 500, msg: "操作出错" }
        }
    }
}
export default organizationController;

