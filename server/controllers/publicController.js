import { sqlStr } from '../dbHelps/mysql'
import {merge,mergeMulti,isLogin} from './utils'
import {save,find,update,remove,aggregate,findLimit} from '../dbHelps/mongodb'
import {queryid} from '../routers/chat.js'
// import authController from './authController'

const publicController = {
    catelogues:async function(next){
        await next
        var result = await sqlStr("select specialities.name as childCatelogue,specialityCategory.name as parentCatelogue from specialityCategory left join specialities on specialityCategory.id = specialities.categoryId")
        var items = merge(result,'parentCatelogue',['childCatelogue'])
        this.body = {status:200,data:items}
    },
    getWorks:async function(){
        var id = this.request.query.id
        var fromId = this.request.query.fromId
        var limit = this.request.query.limit
        var type = this.request.query.type
      if (!fromId || !id || !limit) {
        this.body = {status:500,msg:"缺少参数"}
        return
      }

      if (fromId == 0) { //web访问
        var result = await sqlStr("select w.id,w.name,w.createdAt from works as w left join memberUpdates as mu on w.updateId = mu.id where mu.memberSpecialityId = ? and mu.type = ? order by w.id desc limit "+limit,[id,type])
      }else{
        var result = await sqlStr("select w.id,w.name,w.createdAt from works as w left join memberUpdates as mu on w.updateId = mu.id where mu.memberSpecialityId = ? and mu.type = ? and w.id < ? order by w.id desc limit "+limit,[id,type,fromId])
      }
      // }else if(memberId){   //app访问
      //   var result = await sqlStr("select w.id,w.name,w.createdAt from works as w where w.memberSpecialityId = ? limit "+limit,[id])
      // }else{ //游客登录
      //   var result = await sqlStr("select w.id,w.name,w.createdAt from works as w where w.memberSpecialityId = ? limit "+limit,[id])
      // }
      // var count = await sqlStr("select count(id) as count from works as w left join memberUpdates as mu on w.updateId = mu.id where mu.memberSpecialityId = ?",[id])
      this.body = {status:200,data:result}
    },
    deleteUpdate:async function(next){
      await next
      if (!this.request.query.id) {
            this.body = { status: 500, msg: "缺少参数" }
            return
      }
      var result = await sqlStr("delete from memberupdates where id = ? and memberId = ?",[this.request.query.id,this.session.user])

      if (result.affectedRows > 0) {
            this.body = {status:200,data:"ok"}
            return
      }

      this.body = {status:500,msg:"操作失败"}

    },
    getMyUpdates:async function(next){
        await next
        var id = this.request.query.id
        var limit = this.request.query.limit
        let fromId = this.request.query.fromId
        let direction = this.request.query.direction

        if (!id || !limit || !fromId || !direction) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }

        let myid = this.session.user
        if (direction == 1) {
        var result = await sqlStr("select mu.id,mu.type,mu.text,mu.createAt,(select count(*) from likes where updatesId = mu.id) as likes,(select count(*) from likes where updatesId = mu.id and memberId = ?) as isLiked,(select count(*) from comments where updatesId = mu.id) as comments,ms.memberId,m.nickname,m.head,s.name as specialityName from memberupdates as mu left join memberSpeciality as ms on ms.id = mu.memberSpecialityId left join member as m on m.id = ms.memberId left join specialities as s on s.id = ms.specialitiesId where mu.type = 'image' and ms.memberId = ? and mu.id < ? order by id desc limit " + limit,[myid,id,fromId])
        }else{
          var result = await sqlStr("select mu.id,mu.type,mu.text,mu.createAt,(select count(*) from likes where updatesId = mu.id) as likes,(select count(*) from likes where updatesId = mu.id and memberId = ?) as isLiked,(select count(*) from comments where updatesId = mu.id) as comments,ms.memberId,m.nickname,m.head,s.name as specialityName from memberupdates as mu left join memberSpeciality as ms on ms.id = mu.memberSpecialityId left join member as m on m.id = ms.memberId left join specialities as s on s.id = ms.specialitiesId where mu.type = 'image' and ms.memberId = ? order by id desc limit " + limit,[myid,id])   
        }
        for (let i = 0; i < result.length; i++) {
          if (result[i].type == "article") {
            var items = await sqlStr("select a.title,a.id as articleId,if(a.type = 0,'活动','咨询') as titleType,o.name as organizationsName,a.organizationsId from article as a left join organizations as o on o.id = a.organizationsId where a.updateId = ?",[result[i].id])
            result[i].list = items
          }else if (result[i].type == "image") {
            var items = await sqlStr("select w.name as workName,w.id as workId from works as w where w.updateId = ?",[result[i].id])
            result[i].list = items
          }
        }
        this.body = {status:200,data:result}
    },
    getPhotoUpdates:async function(next){
      await next
        let city = this.request.query.city
        let fromId = this.request.query.fromId
        let limit = this.request.query.limit
        let direction = this.request.query.direction
        let id = this.session.user
        if (direction == 1) {
          if (city) {
            var result = await sqlStr("select mu.id,s.name as specialityName,mu.type,mu.text,mu.createAt,(select count(*) from likes where updatesId = mu.id) as likes,(select count(*) from likes where updatesId = mu.id and memberId = ?) as isLiked,(select count(*) from comments where updatesId = mu.id) as comments,ms.memberId,m.nickname,m.head from memberupdates as mu left join memberSpeciality as ms on ms.id = mu.memberSpecialityId left join member as m on m.id = ms.memberId left join specialities as s on s.id = ms.specialitiesId where (mu.type = 'image' or mu.type = 'video') and mu.id < ? and m.location = ? order by id desc limit " + limit,[id,fromId,city])
          }else{
            var result = await sqlStr("select mu.id,mu.type,mu.text,mu.createAt,s.name as specialityName,(select count(*) from likes where updatesId = mu.id) as likes,(select count(*) from likes where updatesId = mu.id and memberId = ?) as isLiked,(select count(*) from comments where updatesId = mu.id) as comments,ms.memberId,m.nickname,m.head from memberupdates as mu left join memberSpeciality as ms on ms.id = mu.memberSpecialityId left join member as m on m.id = ms.memberId left join specialities as s on s.id = ms.specialitiesId where (mu.type = 'image' or mu.type = 'video') and mu.id < ? order by id desc limit " + limit,[id,fromId])
          }
        }else{
          if (city) {
            var result = await sqlStr("select mu.id,mu.type,mu.text,mu.createAt,s.name as specialityName,(select count(*) from likes where updatesId = mu.id) as likes,(select count(*) from likes where updatesId = mu.id and memberId = ?) as isLiked,(select count(*) from comments where updatesId = mu.id) as comments,ms.memberId,m.nickname,m.head from memberupdates as mu left join memberSpeciality as ms on ms.id = mu.memberSpecialityId left join member as m on m.id = ms.memberId left join specialities as s on s.id = ms.specialitiesId where (mu.type = 'image' or mu.type = 'video') and mu.id > ? and m.location = ? order by id desc limit " + limit,[id,fromId,city])
          }else{
            var result = await sqlStr("select mu.id,mu.type,mu.text,mu.createAt,s.name as specialityName,(select count(*) from likes where updatesId = mu.id) as likes,(select count(*) from likes where updatesId = mu.id and memberId = ?) as isLiked,(select count(*) from comments where updatesId = mu.id) as comments,ms.memberId,m.nickname,m.head from memberupdates as mu left join memberSpeciality as ms on ms.id = mu.memberSpecialityId left join member as m on m.id = ms.memberId left join specialities as s on s.id = ms.specialitiesId where (mu.type = 'image' or mu.type = 'video') order by id desc limit " + limit,[id])
          }
        }

        for (let i = 0; i < result.length; i++) {
            var items = await sqlStr("select w.name as workName,w.id as workId from works as w where w.updateId = ?",[result[i].id])
            result[i].list = items
        }
        this.body = {status:200,data:result}
    },
    newestMem: async function(next){  //获取最新的会员
      await next
      var result = await sqlStr("select id,nickname from member order by id desc limit 10")
      this.body = {status:200,data:result}
      return
    },
    report: async function(next){
      await next
      var id = this.request.body.id 
      var type = this.request.body.type 
      if (!id || !type) {
          this.body = { status: 500, msg: "缺少参数" }
          return
      }
      if(type == "memberId"){
        var result = await sqlStr("insert into report set memberId = ?,type = ?,hostId = ?",[id,type,this.session.user])
      }else if(type == "updatesId"){
        var result = await sqlStr("insert into report set updatesId = ?,type = ?,hostId = ?",[id,type,this.session.user])
      }else if(type == "teamId"){
        var result = await sqlStr("insert into report set teamId = ?,type = ?,hostId = ?",[id,type,this.session.user])
      }
      if(result.affectedRows == 1){
          this.body = {status:200,data:"ok"}
          return
      }
      this.body = {status:500,data:"操作失败"}
      return
    },
    getTrends:async function(next){
        await next 
        var result = await sqlStr("select ")
    }
}
export default publicController;


