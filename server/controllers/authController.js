import { insert,sqlStr } from '../dbHelps/mysql'
var crypto = require('crypto'); //加载crypto库


const authController = {
    register: async function(next) {
        var phone = this.request.body.phone.trim()
        var password = this.request.body.password.trim()
        var code = this.request.body.code.trim()
        var nickname = this.request.body.nickname.trim()
        var location = this.request.body.location.trim();
        var sex = this.request.body.sex;

        if (!/^[1][34578][0-9]{9}$/.test(phone)) {
            this.body = { status: 500, msg: "手机号格式不正确" }
            return;
        };

        if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,20}$/.test(password)) {
            this.body = { status: 500, msg: "密码格式不正确" }
            return;
        }

        var flag = nickname.StringFilter(1,20)

        if (flag) {
            this.body = { status: 500, msg: `昵称${flag}` }
            return;
        }

        var decipher = crypto.createHash('md5',"leviluo");
        password = decipher.update(password).digest('hex')  

        var result = await sqlStr("select * from member where phone = ?", [phone])

        if (result.length > 0) {
            this.body = { status: 500, msg: "此用户已注册"}
            return
        }

        var resultt = await sqlStr("insert into member set phone = ?,password = ?,location = ?,nickname=?,sex = ?", [phone,password,location,nickname,sex])
        if (resultt.affectedRows == 1) {
            this.body = { status: 200 }
            return
        }else{
            this.body = { status: 500, msg: "注册失败" }
        }
        
    },
    login: async function(next) {
        var phone = this.request.body.phone.trim()
        var password = this.request.body.password.trim()

        if (!/^[1][34578][0-9]{9}$/.test(this.request.body.phone)) {
            this.body = { status: 500, msg: "手机号格式不正确" }
            return;
        };

        if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,20}$/.test(this.request.body.password)) {
            this.body = { status: 500, msg: "密码格式不正确" }
            return;
        }

        var decipher = crypto.createHash('md5',"leviluo");

        var result = await sqlStr("select * from member where phone = ? and password = ? ", [phone,decipher.update(password).digest('hex')])

        if (result.length > 0) {
            this.session.user = phone
            this.body = { status: 200, nickname: result[0].nickname,memberId:result[0].id}
            // this.redirect('/memberCenter');页面重定向
            return
        } else {
            this.body = { status: 500, msg: "用户或密码错误" }
            return
        }
    },
    auth: async function(next) {
        if (!this.session.user) {
            this.body = ""
            return
        }
        this.session.user = this.session.user
        var result = await sqlStr("select * from member where phone = ?", [this.session.user])
        if (result.length > 0) {
            this.body = { status: 200, nickname: result[0].nickname,memberId:result[0].id}
            return
        } else {
            this.body = ""
            return
        }
    },
    loginOut:async function(next){
        this.session = null;
        this.body = {status:200}
    }
}
export default authController;
