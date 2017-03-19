import { sqlStr,getByItems, insert } from '../dbHelps/mysql'

const organizationController = {
    addOrganization:async function(next) {
       await next;

       var resultcount = await sqlStr("select count(*) as count from organizations where createById=(select id from member where phone = ?)",[this.session.user])
        if(resultcount[0].count > 4){
            this.body = { status: 500, msg: "最多可创建5个社团" }
            return
        }

      if (!this.request.body.name[0] || this.request.body.name[0].length > 38) {
        this.body = { status: 500, msg: "名称不为空或者大于30位字符" }
        return
      }

      if (!this.request.body.brief[0] || this.request.body.brief[0].length > 995) {
        this.body = { status: 500, msg: "简介不为空或者大于1000位字符" }
        return
      }

        var resultrepeat = await sqlStr("select * from organizations where createById=(select id from member where phone = ?) and name=?",[this.session.user,this.request.body.name[0]])

        if(resultrepeat.length > 0){
            this.body = { status: 500, msg: "社团名称不能重复" }
            return
        }


      var result = await sqlStr("insert into organizations set name = ?,brief=?,head=?,createById=(select id from member where phone = ?),categoryId=?",[this.request.body.name[0],this.request.body.brief[0],this.request.body.names[0],this.session.user,this.request.body.categoryId[0]])
      var resultt = await sqlStr("insert into memberOrganizations set memberId = (select id from member where phone = ?),organizationsId=(select id from organizations where name = ? and createById = (select id from member where phone = ?));",[this.session.user,this.request.body.name[0],this.session.user])
 
      if (result.affectedRows == 1 && resultt.affectedRows == 1) {
          this.body = { status: 200}
          return
      }else{
          this.body = { status: 500,msg:"插入数据失败"}
      }
    },
    modifyOrganization:async function(next) {
       await next;

       var resultrepeat = await sqlStr("select * from organizations where createById=(select id from member where phone = ?) and name=? and id != ?",[this.session.user,this.request.body.name[0],this.request.body.id[0]])

      if(resultrepeat.length > 0){
          this.body = { status: 500, msg: "社团名称不能重复" }
          return
      }

       if (this.request.body.names[0]) {
       var result = await sqlStr("update organizations set name = ?,brief=?,head=? where id = ?",[this.request.body.name[0],this.request.body.brief[0],this.request.body.names[0],this.request.body.id[0]])
       }else{
       var result = await sqlStr("update organizations set name = ?,brief=? where id = ?",[this.request.body.name[0],this.request.body.brief[0],this.request.body.id[0]])
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
        var result = await sqlStr("select o.*,(select count(id) from organizationsrequest where organizationsId = o.id and status = 0) as requests,s.name as categoryName from organizations as o left join specialitycategory as s on s.id = o.categoryId where createById = (select id from member where phone = ?)",[this.session.user])
        this.body = {status:200,data:result}
    },
    getMyOrganization: async function(){
        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
        var result = await sqlStr("select o.*,s.name as categoryName from organizations as o left join specialitycategory as s on s.id = o.categoryId left join memberOrganizations as mo on mo.organizationsId = o.id where mo.memberId = (select id from member where phone=?) and o.createById != (select id from member where phone = ?);",[this.session.user,this.session.user])
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
        var result = await sqlStr("select o.*,s.name as categoryName,m.nickname,m.phone from organizations as o left join member as m on m.id = o.createById left join specialitycategory as s on s.id = o.categoryId where o.id = ?",[this.request.query.id])
        this.body = {status:200,data:result}
    },
    getMembers: async function(){
        if (!this.request.query.id) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        var result = await sqlStr("select m.id,m.phone,m.nickname from memberOrganizations as mo left join member as m on mo.memberId = m.id where mo.organizationsId = ?",[this.request.query.id])
        this.body = {status:200,data:result}
    },
    addArticle: async function(next){
      await next;
      if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }

      var data = this.request.body

      if (!data.header[0] || data.header[0].length > 48) {
            this.body = { status: 500, msg: "标题不能为空或者大于50个字符" }
            return
        }

      if (!data.articleId) {
      var result = await sqlStr("insert into article set title = ?,type = ?,content =?,organizationsId =?,attachedImgs=?,memberId = (select id from member where phone = ?)",[data.header[0],data.type[0],data.content[0],data.organizationId[0],data.names.join(','),this.session.user])
      // 写入更新表
      var resultt = await sqlStr("insert into memberupdates set articleId = ?,memberId = (select id from member where phone = ?)",[result.insertId,this.session.user])

      if (result.affectedRows == 1 && resultt.affectedRows == 1) {
              this.body = {status:200}
              return
      }

      }else{

        if(data.attachs[0]){
            if (this.request.body.names.length > 0) {
                var imgs = data.attachs[0] +','+ this.request.body.names.join(',')
            }else{
                var imgs = data.attachs[0]
            }
        }else{
                var imgs = this.request.body.names.join(',')
        }

        var result = await sqlStr("update article set title =?,type=?,content=?,attachedImgs=?,updatedAt=now() where id = ?",[data.header[0],data.type[0],data.content[0],imgs,data.articleId[0]])
        if (result.affectedRows == 1) {
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
      if (this.request.body.verified.length > 297) {
        this.body = { status: 500, msg: "认证不能超过300个字符" }
        return
      }
      var result = await sqlStr("select id from organizationsrequest where memberId = (select id from member where phone = ?) and organizationsId=?",[this.session.user,this.request.body.id])
      if (result.length > 0) {
          this.body = {status:500,msg:"您已申请过,等待审核"}
          return
      };
      result = await sqlStr("insert into organizationsrequest set memberId = (select id from member where phone = ?),organizationsId=?,verified=?;",[this.session.user,this.request.body.id,this.request.body.verified])
      if (result.affectedRows == 1) {
            this.body = {status:200}
            return
      }

      this.body = {status:500,msg:"加入失败"}
    },
    quitOrganization: async function(next){
      if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
      var result = await sqlStr("delete from memberOrganizations where memberId = (select id from member where phone = ?) and organizationsId=?;",[this.session.user,this.request.query.id])
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
      var result = await sqlStr("select a.*,m.nickname,m.phone from article as a left join member as m on m.id = a.memberId where a.id = ?",[this.request.query.id])
      if (result[0].phone == this.session.user) {
        var resultt = await sqlStr("update comments set status = 1 where articleId = ?",[result[0].id]) //所有回复清空为已读
      };
      this.body = {status:200,data:result[0]}
    },
    reply:async function(){
      if (!this.request.body.comment || !this.request.body.articleId) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        if (!this.session.user) {
          this.body = { status: 600, msg: "尚未登录" }
          return
        }
      var result = await sqlStr("insert into comments set memberId = (select id from member where phone = ?),articleId=?,comment=?",[this.session.user,this.request.body.articleId,this.request.body.comment])

      if (this.request.body.replyToId) { 
        var resultt = await sqlStr("insert into reReply set commentsId = (select id from comments where memberId = (select id from member where phone = ?) and articleId=? order by id desc limit 1),replyTo = ?",[this.session.user,this.request.body.articleId,this.request.body.replyToId])
        if (result.affectedRows == 1 && resultt.affectedRows == 1) {
              this.body = {status:200}
              return
        }
      }else{
        if (result.affectedRows == 1) {
              this.body = {status:200}
              return
        }
      }

      this.body = {status:500,msg:"插入失败"}
    },
    ArticleReply:async function(){
      if (!this.request.query.id) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
      var result = await sqlStr("select c.comment,c.id,c.memberId,r.replyTo,c.createdAt,m.nickname,m.phone from comments as c left join reReply as r on r.commentsId = c.id left join member as m on m.id = c.memberId where c.articleId=? order by c.id",[this.request.query.id])
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
      this.request.body.deletImgs = resultt[0].attachedImgs.split(',')
      await next
      var result = await sqlStr("delete a.*,c.*,r.*,mu.* from article as a left join comments as c on c.articleId = a.id left join reReply as r on r.commentsId = c.id left join memberupdates as mu on mu.articleId = a.id where a.id = ? and a.memberId = (select id from member where phone =?)",[this.request.query.id,this.session.user])
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
      var result = await sqlStr("select a.title,a.id,a.organizationsId,a.type,a.updatedAt,o.name,(select count(*) from comments where comments.articleId = a.id) as count,(select count(*) from comments where comments.articleId = a.id and comments.status = 0) as noRead from article as a left join organizations as o on o.id = a.organizationsId where a.memberId = (select id from member where phone =?) order by noRead desc limit "+this.request.query.limit,[this.session.user])
      var count = await sqlStr("select count(id) as count from article where memberId = (select id from member where phone = ?)",[this.session.user])
      this.body = {status:200,data:result,count:count[0].count}
    },
    getReplyMe:async function(){
      if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
      var result = await sqlStr("select m.id,m.nickname,c.createdAt,c.comment,a.id as articleId,r.status,a.title,o.name,o.id as organizationsId from reReply as r left join comments as c on c.id = r.commentsId left join member as m on m.id = c.memberId left join article as a on a.id = c.articleId left join organizations as o on o.id = a.organizationsId left join comments as cc on cc.id = r.replyTo where cc.memberId = (select id from member where phone = ?)",[this.session.user])
      var resultt = await sqlStr("update reReply set status = 1 where replyTo in (select id from comments where memberId = (select id from member where phone = ?))",[this.session.user])
      this.body = {status:200,data:result}
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
      var result = await sqlStr("select m.id as memberId,m.phone,m.nickname,ro.createdAt,ro.verified,ro.id from organizationsrequest as ro left join member as m on m.id = ro.memberId where ro.status = 0 and ro.organizationsId = ? limit "+this.request.query.limit,[this.request.query.id])
      var count = await sqlStr("select count(id) as count from organizationsrequest where organizationsId = ? and status = 0",[this.request.query.id])
      this.body = {status:200,data:result,count:count[0].count}
    },
    isApprove:async function(){
      if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
      if ((!this.request.query.flag && this.request.query.flag !=0) || !this.request.query.id) {
          this.body = { status: 600, msg: "缺少参数" }
          return
      };
        
      if (this.request.query.flag == 1) {
        var resultt = await sqlStr("insert into memberorganizations set memberId = (select memberId from organizationsrequest where id = ?),organizationsId=(select organizationsId from organizationsrequest where id = ?);", [this.request.query.id,this.request.query.id])
        if (resultt.affectedRows > 0) {
        var result = await sqlStr("update organizationsrequest set status = 1 where id = ?", [this.request.query.id])
          if (result.affectedRows > 0) {
            this.body = {status:200}
            return
          }
        }
      }else{
        var result = await sqlStr("delete from organizationsrequest where id = ?", [this.request.query.id])
        if (result.affectedRows > 0) {
        this.body = {status:200}
        return
        }
      }
        this.body= {status:500,msg:"发生错误"}
    },
    getApproveMe:async function(){
      if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
      var result = await sqlStr("select o.id,o.name from organizationsrequest as ro left join organizations as o on o.id = ro.organizationsId where ro.status = 1 and ro.memberId = (select id from member where phone = ?)",[this.session.user])
      if (result.length > 0) {
        await sqlStr("delete from organizationsrequest where status = 1 and memberId = (select id from member where phone = ?)", [this.session.user])
      };

      this.body = {status:200,data:result}
    }
}
export default organizationController;

