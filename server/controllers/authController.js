import { insert,sqlStr } from '../dbHelps/mysql'
var crypto = require('crypto'); //加载crypto库


const authController = {
    register: async function(next) {
        if (!this.request.body.phone || !this.request.body.password || !this.request.body.code || !this.request.body.nickname) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        };

        if (!/^[1][34578][0-9]{9}$/.test(this.request.body.phone)) {
            this.body = { status: 500, msg: "手机号格式不正确" }
            return;
        };

        if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,20}$/.test(this.request.body.password)) {
            this.body = { status: 500, msg: "密码格式不正确" }
            return;
        }

        if (this.request.body.nickname.length > 20) {
            this.body = { status: 500, msg: "昵称格式不正确" }
            return;
        }

        delete this.request.body.code;

        var decipher = crypto.createHash('md5',"leviluo");
        this.request.body.password = decipher.update(this.request.body.password).digest('hex')  

        var result = await sqlStr("select * from member where phone = ?", [this.request.body.phone])

        if (result.length > 0) {
            this.body = { status: 500, msg: "此用户已注册"}
            return
        }
        // this.request.body.head = `./server/upload/headImages/${this.request.body.phone}.jpg`
        this.request.body.address = this.request.body.location;
        var resultt = await insert("member", this.request.body)
        if (resultt.affectedRows == 1) {
            this.body = { status: 200 }
            return
        };
        
    },
    login: async function(next) {
        var phone = this.request.body.phone
        var password = this.request.body.password

        if (!phone || !password) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        };

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
