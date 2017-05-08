import { insert,sqlStr } from '../dbHelps/mysql'
var crypto = require('crypto'); //加载crypto库


const authController = {
    register: async function(next) {
        var phone = this.request.body.phone.trim().html2Escape()
        var password = this.request.body.password.trim().html2Escape()
        var code = this.request.body.code.trim().html2Escape()
        var nickname = this.request.body.nickname.trim().html2Escape()
        var location = this.request.body.location.trim().html2Escape();
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

        var password = this.request.body.password.trim()

        if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,20}$/.test(this.request.body.password)) {
            this.body = { status: 500, msg: "密码格式不正确" }
            return;
        }

        var decipher = crypto.createHash('md5',"leviluo");

        if (!this.request.body.type) {    //普通
            var phone = this.request.body.phone.trim()

            if (!/^[1][34578][0-9]{9}$/.test(this.request.body.phone)) {
                this.body = { status: 500, msg: "手机号格式不正确" }
                return;
            };

            var result = await sqlStr("select * from member where phone = ? and password = ? ", [phone,decipher.update(password).digest('hex')])
            // var result = await sqlStr("select * from admin where account = ? and password = ? ", [account,decipher.update(password).digest('hex')])

            if (result.length > 0) {
                this.session.user = result[0].id
                this.body = { status: 200, nickname: result[0].nickname,memberId:result[0].id}
                return
            } else {
                this.body = { status: 500, msg: "用户或密码错误" }
                return
            }

        }else{     //管理员

            var account = this.request.body.account

            if (!account || !password) {
                this.body = { status: 500, msg: "缺少参数" }
                return
            };

            var result = await sqlStr("select * from admin where account = ? and password = ? ", [account,decipher.update(password).digest('hex')])

            if (result.length > 0) {
                this.session.user = "admin"
                this.body = { status: 200, nickname: "admin", memberId:0}
                return
            } else {
                this.body = { status: 500, msg: "用户或密码错误" }
                return
            }                      
        }

    },
    auth: async function(next) {
        if (!this.session.user) {
            this.body = { status: 600, msg: "尚未登录" }
            return
        }
        this.session.user = this.session.user
        if (this.session.user != "admin") {
            var result = await sqlStr("select * from member where id = ?", [this.session.user])
            if (result.length > 0) {
                this.body = { status: 200, nickname: result[0].nickname,memberId:result[0].id}
                return
            } else {
                this.body = { status: 600, msg: "尚未登录" }
                return
            }
        }else{
            // var result = await sqlStr("select * from admin where account = ?", [this.session.user])
            // if (result.length > 0) {
                this.body = { status: 200,nickname:"admin",memberId:0}
                return
            // } else {
            //     this.body = { status: 600, msg: "尚未登录" }
            //     return
            // }
        }
    },
    islogin:async function(next) {
        // console.log("0000")
        if (!this.session.user) {
            this.body = { status: 500, msg: "尚未登录" }
            return
        }
        await next
        // console.log("1111")
    },
    loginOut:async function(next){
        this.session = null;
        this.body = {status:200}
    }
}
export default authController;
