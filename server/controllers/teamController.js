import { sqlStr,getByItems } from '../dbHelps/mysql'
import chat,{queryid} from '../routers/chat.js'
import mongoose from 'mongoose'
import {save,find,remove,update} from '../dbHelps/mongodb'

const teamController = {
    myteams:async function(next){
        await next
        var result = await sqlStr("select t.head,t.name,t.id,t.brief from team as t left join memberTeam as tm on tm.teamId = t.id where tm.memberId = ?",[this.session.user])
        this.body = {status:200,data:result}
    },
    addTeam:async function(next){
        await next
        var name = this.request.body.name[0].trim()
        var brief = this.request.body.brief[0].trim()
        var head = this.request.body.names[0]
        if (!name) {
            this.body = {status:"600",msg:"名称不能为空"}
        }
        var count = await sqlStr("select count(*) as count from team where createById = ?",[this.session.user])
        if (count[0].count > 4) {
          this.body = {status:500,msg:"您最多只能创建5个群"}
          return
        }
        var result = await sqlStr("insert into team set name = ?,brief = ?,head = ?,createById = ?",[name,brief,head,this.session.user])
        // console.log(result)
        if (result.insertId) {
          var resultt = await sqlStr("insert into memberTeam set memberId = ?,teamId = ?",[this.session.user,result.insertId])
          if (resultt.affectedRows = 1) {
            this.body = {status:200,data:"ok"}
          }else{
            this.body = {status:500,msg:"数据存储失败"}
          }
        }else{
          this.body = {status:500,msg:"数据存储失败"}
        }    
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

        if (text.length > 1000) {
            this.body = { status: 500, msg: "消息过长" }
            return
        }

        var result = await sqlStr("select * from memberTeam where teamId = ? and memberId = ?",[chatWith,this.session.user])

        if(result.length == 0){
            this.body = { status: 600, msg: "只有该群成员才可以发言" }
            return
        }


        var result = await sqlStr("insert into groupmessage set fromMember = ?,teamId = ?,text = ?,type = ?",[this.session.user,chatWith,text,type])

        if (result.affectedRows == 1) {
                var result = await sqlStr("select m.text,m.id,m.type,m.time,m.teamId as sendTo,t.name as sendTonickname,t.head as sendTohead,mF.id as sendFrom,mF.nickname as sendnickname,mF.head as sendFromHead from groupmessage as m left join member as mF on mF.id = m.fromMember left join team as t on t.id = m.teamId where m.teamId = ? and m.fromMember = ? order by m.id desc limit 1",[chatWith,this.session.user])

                result[0].ntype = "groupmsg"
                chat.io.to(chatWith).emit('notice', result[0]);
                 this.body = { status: 200, data:result}

                var realNumber = await sqlStr("select memberId from memberTeam where teamId = ?",[chatWith])
                var realRooms = chat.rooms[chatWith]
                for (var j = 0; j < realNumber.length; j++) {
                    let isIn = false
                    for (var i = 0; i < realRooms.length; i++) {
                      if(realRooms[i] == realNumber[j].memberId){
                        isIn = true
                      }
                    }
                    if (!isIn) {
                      console.log(realNumber[j].memberId + "不在线")
                        result[0].hostId = realNumber[j].memberId
                        var resultt = await save('msg',result[0])
                    }
                }      

                return
            // }else{
            //      this.body = { status: 500, msg:"保存消息失败"}
            //     return
            // }

        }else{
            this.body = { status: 500,msg:'数据库插入失败'}
        }
    },
    teamInfo:async function(next){
      await next
      let id = this.request.query.id 
      if (!id) {
        this.body = { status: 600,msg:'缺少参数'}
        return
      }
      var result = await sqlStr("select brief,createById from team where id = ?",[id])
      var members = await sqlStr("select m.head,m.nickname,m.id from member as m left join memberTeam as t on t.memberId = m.id where t.teamId = ?",[id])
      result[0].members = members 
      this.body = {status:200,data:result[0]}
    },
    quitTeam:async function(next){
      await next
      let id = this.request.query.id
      let memberId = this.request.query.memberId 
      if (!id) {
        this.body = { status: 600,msg:'缺少参数'}
        return
      }
      let actualId = memberId ? memberId : this.session.user
      var result = await sqlStr("delete from memberTeam where teamId = ? and memberId = ?",[id,actualId])
      if(result.affectedRows == 1){
        chat.leaveGroup(actualId,id)
        // this.body = {status:200,data:"ok"}
        if (memberId) {
            var myinfo = await sqlStr("select head,name from team where id = ?",[id])
            var items = {hostId:parseInt(memberId),teamId:parseInt(id),time:new Date().myFormat(),ntype:"sys",nickname:myinfo[0].name,head:myinfo[0].head,type:"quitTeam",comment:"将您移出了该群"};

            var toSocket = queryid(memberId)

            if (toSocket) {
                toSocket.emit('notice',items);
                console.log("出群通知")
            }else{
                var resultt = await save('notice',items)
            }
      
            this.body = {status:200,data:"ok"}
            return
        }
        return
      }
      this.body = {status:600,msg:"操作失败"}
    },
    deleteTeam:async function(next){
      await next
      let id = this.request.query.id 
      if (!id) {
        this.body = { status: 600,msg:'缺少参数'}
        return
      }
        var myinfo = await sqlStr("select head,name from team where id = ?",[id])
      var result = await sqlStr("delete from memberTeam where teamId = ?",[id])
      var resultt = await sqlStr("delete from team where id = ?",[id])
      if (result.affectedRows > 1 && resultt.affectedRows == 1) {
        this.body = {status:200,data:"ok"}
        var items = {time:new Date().myFormat(),teamId:parseInt(id),ntype:"sys",type:"deleteTeam",nickname:myinfo[0].name,head:myinfo[0].head,comment:"该群已解散,您已被自动移出"};
            // 通知在线成员群已解散
           chat.io.to(id).emit('notice',items);
                var realNumber = await sqlStr("select memberId from memberTeam where teamId = ?",[id])
                var realRooms = chat.rooms[id]
                for (var j = 0; j < realNumber.length; j++) {
                    let isIn = false
                    for (var i = 0; i < realRooms.length; i++) {
                      if(realRooms[i] == realNumber[j].memberId){
                        isIn = true
                      }
                    }
                    if (!isIn) {
                      console.log(realNumber[j].memberId + "不在线")
                        items.hostId = realNumber[j].memberId
                        // 不在线成员保存通知
                        await save('notice',items)
                    }
                }     
            // 删除群房间
            chat.deleteGroup(id)
        return
      }
      this.body = {status:600,msg:"操作失败"}
    }
}
export default teamController;

