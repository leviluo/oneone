import { sqlStr } from '../dbHelps/mysql'
import {merge,mergeMulti,isLogin} from './utils'
import {save,find,update,remove,aggregate,findLimit} from '../dbHelps/mongodb'
import {queryid} from '../routers/chat.js'
// import authController from './authController'

const publicController = {
    catelogues:async function(next){
        var result = await sqlStr("select specialities.name as childCatelogue,specialityCategory.name as parentCatelogue from specialityCategory left join specialities on specialityCategory.id = specialities.categoryId")
        var items = merge(result,'parentCatelogue',['childCatelogue'])
        this.body = {status:200,data:items}
    },
    items:async function(next){
        if (!this.request.body.address || !this.request.body.limit) {
            this.body = {status:500,msg:"缺少参数"}
            return
        }
        if (this.request.body.parentSpeciality) {
           var result = await sqlStr("select m.nickname,m.address,m.sex,ms.memberId,s.name,ms.brief from member as m left join memberSpeciality as ms on ms.memberId = m.id left join specialities as s on s.id = ms.specialitiesId where s.categoryId = (select id from specialityCategory where name = ? ) and m.location = ? limit "+this.request.body.limit,[this.request.body.parentSpeciality,this.request.body.address])
            var count = await sqlStr("select count(m.id) as count from member as m left join memberSpeciality as ms on ms.memberId = m.id left join specialities as s on s.id = ms.specialitiesId where s.categoryId = (select id from specialityCategory where name = ? ) and m.location = ? ",[this.request.body.parentSpeciality,this.request.body.address])
        }else if(this.request.body.speciality){
           var result = await sqlStr("select m.nickname,m.address,m.sex,ms.memberId,s.name,ms.brief from member as m left join memberSpeciality as ms on ms.memberId = m.id left join specialities as s on s.id = ms.specialitiesId where s.name = ? and m.location = ? limit "+this.request.body.limit,[this.request.body.speciality,this.request.body.address])
           var count = await sqlStr("select count(m.id) as count from member as m left join memberSpeciality as ms on ms.memberId = m.id left join specialities as s on s.id = ms.specialitiesId where s.name = ? and m.location = ?",[this.request.body.speciality,this.request.body.address])
        }
        this.body = {status:200,data:result,count:count[0].count}
    },
    getCatelogy:async function(next){
        // console.log("whji")
        var result = await sqlStr("select id as 'key',name as 'value' from specialityCategory")
        this.body = {status:200,data:result}
    },
    memberInfo:async function(next){
        if (!this.request.query.id) {
            this.body = {status:500,msg:"缺少参数"}
            return
        }
        if (this.session.user) {
        var result = await sqlStr("select m.address,m.id,m.brief,m.sex,m.nickname,(select count(id) from follows where memberId = m.id) as follows,(select count(id) from follows where followId = m.id) as fans,if((select id from follows where followId = ? and memberId = ?),1,0) as isFollowed from member as m where id = ?",[this.request.query.id,this.session.user,this.request.query.id])
        }else{
        var result = await sqlStr("select m.address,m.id,m.brief,m.sex,m.nickname,(select count(id) from follows where memberId = m.id) as follows,(select count(id) from follows where followId = m.id) as fans from member as m where id = ?",[this.request.query.id])
        }
        this.body = {status:200,data:result}
    },
    getWorks:async function(){
      if (!this.request.query.limit) {
        this.body = {status:500,msg:"缺少参数"}
        return
      }
      if (!this.request.query.id) {
        this.body = {status:500,msg:"缺少参数"}
        return
      }

      if (this.session.user) { //web访问
        var result = await sqlStr("select w.id,w.name,w.createdAt,(select count(id) from likes where worksId = w.id) as likes,if((select id from likes where worksId = w.id and memberId = ? limit 1) != '',1,0) as isLiked from works as w where w.memberSpecialityId = ? limit "+this.request.query.limit,[this.session.user,this.request.query.id])
      }else if(this.request.query.memberId){   //app访问
        var result = await sqlStr("select w.id,w.name,w.createdAt,(select count(id) from likes where worksId = w.id) as likes,if((select id from likes where worksId = w.id and memberId = ? limit 1) != '',1,0) as isLiked from works as w where w.memberSpecialityId = ? limit "+this.request.query.limit,[this.request.query.memberId,this.request.query.id])
      }else{ //游客登录
        var result = await sqlStr("select w.id,w.name,w.createdAt,(select count(id) from likes where worksId = w.id) as likes from works as w where w.memberSpecialityId = ? limit "+this.request.query.limit,[this.request.query.id])
      }
      var count = await sqlStr("select count(id) as count from works where memberSpecialityId = ?",[this.request.query.id])
      this.body = {status:200,data:result,count:count[0].count}
    },
    getWorksFrom:async function(){
      if (!this.request.query.limit || !this.request.query.worksId) {
        this.body = {status:500,msg:"缺少参数"}
        return
      }
      if (this.session.user && this.request.query.id) {
        if (this.request.query.direction == 1) {
        var result = await sqlStr("select w.id,w.name,w.createdAt,(select count(id) from likes where worksId = w.id) as likes,if((select id from likes where worksId = w.id and memberId = ? limit 1) != '',1,0) as isLiked from works as w where w.memberSpecialityId = ? and w.id <= ? order by w.id desc limit "+this.request.query.limit,[this.session.user,this.request.query.id,this.request.query.worksId])
        

        }else{
          var result = await sqlStr("select w.id,w.name,w.createdAt,(select count(id) from likes where worksId = w.id) as likes,if((select id from likes where worksId = w.id and memberId = ? limit 1) != '',1,0) as isLiked from works as w where w.memberSpecialityId = ? and w.id >= ? limit "+this.request.query.limit,[this.session.user,this.request.query.id,this.request.query.worksId])
          if (result.length < this.request.query.limit) {
            var items = await sqlStr("select w.id,w.name,w.createdAt,(select count(id) from likes where worksId = w.id) as likes,if((select id from likes where worksId = w.id and memberId = ? limit 1) != '',1,0) as isLiked from works as w where w.memberSpecialityId = ? and w.id < ? order by w.id desc limit "+(this.request.query.limit - result.length),[this.session.user,this.request.query.id,this.request.query.worksId])
            result = items.reverse().concat(result)
          }
        }
      }else if(this.request.query.id){
        if (this.request.query.direction == 1) {
        var result = await sqlStr("select w.id,w.name,w.createdAt,(select count(id) from likes where worksId = w.id) as likes from works as w where w.memberSpecialityId = ? and w.id <= ? order by w.id desc limit "+this.request.query.limit,[this.request.query.id,this.request.query.worksId])
        
        }else{
          var result = await sqlStr("select w.id,w.name,w.createdAt,(select count(id) from likes where worksId = w.id) as likes from works as w where w.memberSpecialityId = ? and w.id >= ? limit "+this.request.query.limit,[this.request.query.id,this.request.query.worksId])
          if (result.length < this.request.query.limit) {
          var items = await sqlStr("select w.id,w.name,w.createdAt,(select count(id) from likes where worksId = w.id) as likes from works as w where w.memberSpecialityId = ? and w.id < ? order by w.id desc limit "+(this.request.query.limit - result.length),[this.request.query.id,this.request.query.worksId])
            result = items.reverse().concat(result)
          }
        }
      }else{
        this.body = {status:600,msg:"尚未登录"}
        return
      }

      var count = await sqlStr("select count(id) as count from works where memberSpecialityId = ?",[this.request.query.id])
      for (let i = 0; i < result.length; i++) {
          var items = await sqlStr("select memberId from likes where worksId = ? order by id desc limit 5",[result[i].id])
          result[i].likeMembers = items
      }
      this.body = {status:200,data:result,count:count[0].count}
    },
    comments:async function(){
      var id = this.request.query.id
      if (!id) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
      var user = this.session.user ? this.session.user : 0

      var result = await sqlStr("select mu.id,mu.type,mu.text,date_format(mu.createAt,'%Y-%c-%d %h:%i') as createAt,(select count(*) from likes where updatesId = mu.id) as likes,(select count(*) from likes where updatesId = mu.id and memberId = ?) as isLiked,(select count(*) from comments where updatesId = mu.id) as comments,mu.memberId,m.nickname from memberupdates as mu left join member as m on m.id = mu.memberId where (mu.type = 'image' or mu.type = 'video') and mu.id = ?",[user,id])
      // console.log("result",result)
      var comments = await sqlStr("select c.comment,c.id,c.memberId,mm.nickname as replyTo,date_format(c.createdAt,'%Y-%c-%d %h:%i') as createdAt,m.nickname from comments as c left join reReply as r on r.commentsId = c.id left join member as m on m.id = c.memberId left join comments as cc on cc.id = r.replyTo left join member as mm on mm.id = cc.memberId where c.updatesId=? order by c.id",[id])
      // console.log("comments",comments)
      var items = await sqlStr("select s.name as specialityName,ms.id as memberSpecialityId,w.name as workName,w.id as workId from works as w left join memberSpeciality as ms on ms.id = w.memberSpecialityId left join specialities as s on s.id = ms.specialitiesId where w.updateId = ?",[id])
      result[0].works = items
      result[0].commentContent = comments
      this.body = {status:200,data:result}
    },
    reply:async function(){   //评论
      var comment = this.request.body.comment.trim().html2Escape()
      var updatesId = this.request.body.id

      if (!comment || !updatesId) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        if (!this.session.user) {
          this.body = { status: 600, msg: "尚未登录" }
          return
        }
        if (comment.length > 300) {
          this.body = { status: 500, msg: "回复内容不多于300个字符" }
          return
        }
      var result = await sqlStr("insert into comments set memberId = ?,updatesId=?,comment=?",[this.session.user,updatesId,comment])
  
      var myinfo = await sqlStr("select nickname from member where id = ?",[this.session.user])
      if (this.request.body.replyToId) { 
        // 回复通知
        var resultt = await sqlStr("insert into reReply set commentsId = (select id from comments where memberId = ? and updatesId=? order by id desc limit 1),replyTo = ?",[this.session.user,updatesId,this.request.body.replyToId])
        if (result.affectedRows == 1 && resultt.affectedRows == 1) {
              // 通知回复
              var info = await sqlStr("select m.id from member as m left join comments as c on c.memberId = m.id where c.id = ?",[this.request.body.replyToId])

              var items = {hostId:info[0].id,memberId:this.session.user,nickname:myinfo[0].nickname,updatesId:updatesId,comment:comment,commentsId:result.insertId};

                var resultt = await save('Reply',items)
                
                if(info[0].id){

                    var toSocket = queryid(info[0].id)

                    if (toSocket) {
                        toSocket.emit('notice',resultt);
                        console.log("通知回复消息")
                    }

                    this.body = {status:200,data:{insertId:result.insertId}}
                    return
                }else{
                    this.body = {status:500,msg:"操作失败"}
                    return
                }
        }
      }else{
        if (result.affectedRows == 1) {
             // 通知评论
            var info = await sqlStr("select m.id from member as m left join memberupdates as mu on mu.memberId = m.id where mu.id = ?",[updatesId])

            var items = {hostId:info[0].id,memberId:this.session.user,nickname:myinfo[0].nickname,updatesId:updatesId,comment:comment,commentsId:result.insertId};

                var resultt = await save('Reply',items)
                
                if(info[0].id){

                    var toSocket = queryid(info[0].id)

                    if (toSocket) {
                        toSocket.emit('notice',resultt);
                        console.log("通知评论")
                    }

                    this.body = {status:200,data:{insertId:result.insertId}}
                    return
                }else{
                    this.body = {status:500,msg:"操作失败"}
                    return
                }

        }
      }
      this.body = {status:500,msg:"插入失败"}
    },
    deleteReply:async function(){
      if (!this.request.query.id) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        if (!this.session.user) {
          this.body = { status: 500, msg: "尚未登录" }
            return
        }
      var result = await sqlStr("delete c.*,r.* from comments as c left join reReply as r on r.commentsId = c.id where c.id = ?",[this.request.query.id])
      if (result.affectedRows > 0) {
            var resultt = await remove("Reply",{memberId:this.session.user,commentsId:this.request.query.id})
            // console.log(resultt.result)
                if(resultt.result.n > 0){
                    this.body = {status:200,data:"ok"}
                    return
                }
      }
      this.body = {status:500,msg:"操作失败"}
    },
    deleteUpdate:async function(){
      if (!this.request.query.id) {
            this.body = { status: 500, msg: "缺少参数" }
            return
      }
      if (!this.session.user) {
            this.body = { status: 500, msg: "尚未登录" }
            return
        }
      var result = await sqlStr("delete from memberupdates where id = ? and memberId = ?",[this.request.query.id,this.session.user])

      if (result.affectedRows > 0) {
            this.body = {status:200,data:"ok"}
            return
      }

      this.body = {status:500,msg:"操作失败"}

    },
    specialities:async function(next){
        if (this.request.query.id) {
          // app端用取1张最新
        var result = await sqlStr("select m.brief,m.id,m.memberId,(select name from works where memberSpecialityId = m.id order by createdAt desc limit 1) as work,s.name as speciality from memberSpeciality as m left join specialities as s on s.id = m.specialitiesId where memberId = ?;",[this.request.query.id])
        }else if (this.session.user) {
          // 网页端用取8张最新
        var result = await sqlStr("select m.brief,m.id,m.memberId,substring_index((select GROUP_CONCAT(name order by createdAt desc) from works where memberSpecialityId = m.id),',',6) as work,s.name as speciality from memberSpeciality as m left join specialities as s on s.id = m.specialitiesId where memberId = ?",[this.session.user])
        }else{
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
        this.body = {status:200,data:result}
    },
    getMemberInfoWork: async function(){
        if (!this.request.query.id) {
           this.body = {status:500,msg:"缺少参数"}
            return 
        }
        var result = await sqlStr("select DISTINCT(m.nickname),m.id as memberId,s.name from works as w left join memberSpeciality as ms on ms.id = w.memberSpecialityId left join member as m on m.id = ms.memberId left join specialities as s on s.id = ms.specialitiesId where w.memberSpecialityId = ? ",[this.request.query.id])
        this.body = {status:200,data:result}
    },
    getFollows: async function(){
      if (!this.request.query.id || !this.request.query.limit) {
           this.body = {status:500,msg:"缺少参数"}
            return 
        }
      var result = await sqlStr("select m.nickname,m.brief,m.id from follows as f left join member as m on m.id = f.followId where f.memberId = ? limit "+this.request.query.limit,[this.request.query.id])
      this.body = {status:200,data:result}
    },
    getFans: async function(){
      if (!this.request.query.id || !this.request.query.limit) {
           this.body = {status:500,msg:"缺少参数"}
            return 
      }
      var result = await sqlStr("select m.nickname,m.brief,m.id from follows as f left join member as m on m.id = f.memberId where f.followId = ? limit "+this.request.query.limit,[this.request.query.id])
      this.body = {status:200,data:result}
    },
    getFriends: async function(){
      if (!this.request.query.id || !this.request.query.limit) {
           this.body = {status:500,msg:"缺少参数"}
            return 
      }
      var result = await sqlStr("select m.nickname,m.brief,m.id from follows as f left join member as m on m.id = f.memberId where f.followId = ? and (select count(*) from follows as ff where ff.memberId = ? and f.memberId = ff.followId) > 0 limit "+this.request.query.limit,[this.request.query.id,this.request.query.id])
      this.body = {status:200,data:result}
    },
    getMyUpdates:async function(next){

        // if (this.request.header["authorization"] !== undefined) { //来自app
        //   var flag = await isLogin(this.request.header["authorization"])
        // }
        
        // if (flag) {
        //   this.body = flag
        //   return
        // }

        var id = this.request.query.id
        var limit = this.request.query.limit
        let fromId = this.request.query.fromId
        let direction = this.request.query.direction

        if (!id || !limit || !fromId || !direction) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        let myid = this.session.user ? this.session.user : 0

        // var result = await sqlStr("select mu.id,mu.type,mu.createAt,mu.memberId,m.nickname from memberupdates as mu left join member as m on m.id = mu.memberId where mu.memberId = ? order by id desc limit " + limit,[id])
        if (direction == 1) {
        var result = await sqlStr("select mu.id,mu.type,mu.text,date_format(mu.createAt,'%Y-%c-%d %h:%i') as createAt,(select count(*) from likes where updatesId = mu.id) as likes,(select count(*) from likes where updatesId = mu.id and memberId = ?) as isLiked,(select count(*) from comments where updatesId = mu.id) as comments,mu.memberId,m.nickname from memberupdates as mu left join member as m on m.id = mu.memberId where mu.type = 'image' and mu.memberId = ? and mu.id < ? order by id desc limit " + limit,[myid,id,fromId])
        }else{
          var result = await sqlStr("select mu.id,mu.type,mu.text,date_format(mu.createAt,'%Y-%c-%d %h:%i') as createAt,(select count(*) from likes where updatesId = mu.id) as likes,(select count(*) from likes where updatesId = mu.id and memberId = ?) as isLiked,(select count(*) from comments where updatesId = mu.id) as comments,mu.memberId,m.nickname from memberupdates as mu left join member as m on m.id = mu.memberId where mu.type = 'image' and mu.memberId = ? order by id desc limit " + limit,[myid,id])   
        }
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
    getPhotoUpdates:async function(){
        let city = this.request.query.city
        let fromId = this.request.query.fromId
        let limit = this.request.query.limit
        let direction = this.request.query.direction
        let id = this.session.user ? this.session.user : 0
        if (direction == 1) {
          if (city) {
            var result = await sqlStr("select mu.id,mu.type,mu.text,date_format(mu.createAt,'%Y-%c-%d %h:%i') as createAt,(select count(*) from likes where updatesId = mu.id) as likes,(select count(*) from likes where updatesId = mu.id and memberId = ?) as isLiked,(select count(*) from comments where updatesId = mu.id) as comments,mu.memberId,m.nickname from memberupdates as mu left join member as m on m.id = mu.memberId where (mu.type = 'image' or mu.type = 'video') and mu.id < ? and m.location = ? order by id desc limit " + limit,[id,fromId,city])
          }else{
            var result = await sqlStr("select mu.id,mu.type,mu.text,date_format(mu.createAt,'%Y-%c-%d %h:%i') as createAt,(select count(*) from likes where updatesId = mu.id) as likes,(select count(*) from likes where updatesId = mu.id and memberId = ?) as isLiked,(select count(*) from comments where updatesId = mu.id) as comments,mu.memberId,m.nickname from memberupdates as mu left join member as m on m.id = mu.memberId where (mu.type = 'image' or mu.type = 'video') and mu.id < ? order by id desc limit " + limit,[id,fromId])
          }
        }else{
          if (city) {
            var result = await sqlStr("select mu.id,mu.type,mu.text,date_format(mu.createAt,'%Y-%c-%d %h:%i') as createAt,(select count(*) from likes where updatesId = mu.id) as likes,(select count(*) from likes where updatesId = mu.id and memberId = ?) as isLiked,(select count(*) from comments where updatesId = mu.id) as comments,mu.memberId,m.nickname from memberupdates as mu left join member as m on m.id = mu.memberId where (mu.type = 'image' or mu.type = 'video') and mu.id > ? and m.location = ? order by id desc limit " + limit,[id,fromId,city])
          }else{
            var result = await sqlStr("select mu.id,mu.type,mu.text,date_format(mu.createAt,'%Y-%c-%d %h:%i') as createAt,(select count(*) from likes where updatesId = mu.id) as likes,(select count(*) from likes where updatesId = mu.id and memberId = ?) as isLiked,(select count(*) from comments where updatesId = mu.id) as comments,mu.memberId,m.nickname from memberupdates as mu left join member as m on m.id = mu.memberId where (mu.type = 'image' or mu.type = 'video') order by id desc limit " + limit,[id])
          }
        }

        for (let i = 0; i < result.length; i++) {
            var items = await sqlStr("select s.name as specialityName,ms.id as memberSpecialityId,w.name as workName,w.id as workId from works as w left join memberSpeciality as ms on ms.id = w.memberSpecialityId left join specialities as s on s.id = ms.specialitiesId where w.updateId = ?",[result[i].id])
            result[i].list = items
        }
        this.body = {status:200,data:result}
    },
    getArticleUpdates:async function(){
        if (this.request.query.direction == 1) {
            var result = await sqlStr("select mu.id,mu.type,date_format(mu.createAt,'%Y-%c-%d %h:%i') as createAt,mu.memberId,m.nickname from memberupdates as mu left join member as m on m.id = mu.memberId where mu.type = 'article' and mu.id > ? order by id desc",[this.request.query.limit.split(',')[0]])
        }else{
            var result = await sqlStr("select mu.id,mu.type,date_format(mu.createAt,'%Y-%c-%d %h:%i') as createAt,mu.memberId,m.nickname from memberupdates as mu left join member as m on m.id = mu.memberId where mu.type = 'article' order by id desc limit " + this.request.query.limit)
        }

        for (let i = 0; i < result.length; i++) {
            var items = await sqlStr("select a.title,a.id as articleId,if(a.type = 0,'活动','咨询') as titleType,o.name as organizationsName,a.organizationsId from article as a left join organizations as o on o.id = a.organizationsId where a.updateId = ?",[result[i].id])
            result[i].list = items
        }

        var count = await sqlStr("select count(id) as count from memberUpdates where type = 'article'")

        this.body = {status:200,data:result,count:count[0].count}
    },
    query:async function(){
      var type = this.request.query.type;
      var queryStr = this.request.query.queryStr;
      var limit = this.request.query.limit;

      if (!type || !queryStr) {
        this.body = { status: 500, msg: "缺少参数" }
        return
      }
      if (queryStr.length < 1 || queryStr.length > 50) {
        this.body = { status: 500, msg: "字符串格式不正确" }
        return
      }
      if (type == 1) {  //搜索用户
        var result = await sqlStr("select m.id,m.nickname,m.location,m.phone,m.sex,m.brief,s.name as specialityName from member as m left join memberSpeciality as ms on ms.memberId = m.id left join specialities as s on s.id = ms.specialitiesId where m.phone like ? or m.nickname like ? limit "+limit,[`%${queryStr}%`,`%${queryStr}%`])
        result = merge(result,"id",["specialityName"])
        var count = await sqlStr("select count(id) as count from member where phone like ? or nickname like ? ",[`%${queryStr}%`,`%${queryStr}%`])
      }else if (type == 2) {  //搜索社团
        var result = await sqlStr("select o.name,o.head,o.id,s.name as specialityName from organizations as o left join specialities as s on s.id = o.categoryId where o.name like ? limit "+limit,[`%${queryStr}%`])
        var count = await sqlStr("select count(id) as count from organizations where name like ?",[`%${queryStr}%`])
      }else if(type == 3){   //搜索文章
        var result = await sqlStr("select a.id,a.memberId,a.title,a.createdAt,o.name as organizationsName,if(a.type = 0,'活动','咨询') as titleType,a.organizationsId,m.nickname from article as a left join member as m on m.id = a.memberId left join organizations as o on o.id = a.organizationsId where a.title like ? order by a.id desc limit "+limit,[`%${queryStr}%`])
        var count = await sqlStr("select count(id) as count from article where title like ? ",[`%${queryStr}%`])
      }
      this.body = {status:200,data:result,count:count[0].count}
    },
    likeMembers:async function(next){
      var id = this.request.query.id
      var limit = this.request.query.limit
      if (!id || !limit) {
        this.body = { status: 500, msg: "缺少参数" }
        return
      }
      var result = await sqlStr("select memberId from likes where worksId = ? limit "+limit,[id])
      this.body = {status:200,data:result}
    },
    newestMem:async function(){  //获取最新的会员
      var result = await sqlStr("select id,nickname from member order by id desc limit 10")
      this.body = {status:200,data:result}
      return
    },
    newestOrganization:async function() { //获取最新的社团
      var result = await sqlStr("select id,name from organizations order by id desc limit 10")
      this.body = {status:200,data:result}
      return
    }
}
export default publicController;


