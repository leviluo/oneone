// var mongoose = require('mongoose');
import mongoose from 'mongoose'
// var ObjectId = mongoose.Schema.Types.ObjectId;
// var NewsSchema = new mongoose.Schema({
//     title: String,
//     content: String,
//     createTime: {
//         type: Date,
//         default: Date.now
//     }
// })

// var UserSchema = new mongoose.Schema({
//     status: { type: Number, default: 0 },
//     phone: Number,
//     password: String,
//     token: String,
//     role: { type: Number, default: 0 },
//     reg_time: {
//         type: Date,
//         default: Date.now
//     },
//     last_time: {
//         type: Date,
//         default: Date.now
//     },
//     last_address: { type: String, default: '' },
//     login_count: { type: Number, default: 0 },
// })

// var ActivitySchema = new mongoose.Schema({
//     uuid: Number,
//     title: String,
//     content: String,
//     user: ObjectId,
//     images: [String],
//     last_modify_date: {
//         type: Date,
//         default: Date.now
//     },
//     startdate: Date,
//     enddate: Date,
//     location: String,
//     publish_territory: Boolean,
//     status: Boolean,
//     participants: Number,
//     personlimits: Number,
//     createdate: {
//         type: Date,
//         default: Date.now
//     },
//     category: String,
//     sex: Boolean,
// })

var noticeSchema = new mongoose.Schema({
    status: { type: Number, default: 0 },
    type: String,
    createdate: {
        type: Date,
        default: Date.now
    },
    hostid: { type: Number, default: 0 },  //你是谁
    follow: { type: Object, default: {} }, //“谁“ 关注了你    
    organizations: { type: Object, default: {} }, //“社团” 通过了你的加入请求
})

var messageSchema = new mongoose.Schema({
    status: { type: Number, default: 0 },
    type: String,
    createdate: {
        type: Date,
        default: Date.now
    },
    hostid: { type: Number, default: 0 },  //   你是谁
    sendFrom: { type: Object, default: {} },  // “谁” 给你发了私信
    reply: { type: Object, default: {} },  //    “谁” 在 “文章”  
    comment: { type: Object, default: {} },  //  “谁” 在 “文章”  
    requestAttend: { type: Object, default: {} },  //    “谁” 请求加入 “社团”  
})

// var News = mongoose.model('News', NewsSchema);
// mongoose.model('User', UserSchema);
mongoose.model('Message', messageSchema);
mongoose.model('Notice', noticeSchema);

console.log("加载mongo模型")


//私信                        “谁” 给你发了私信               属于消息（type="privatemessage"）
//文章评价                    “谁” 在 “文章”                  属于消息（type="articlecomment"）
//请求入群                    “谁” 请求加入 “社团”            属于消息（type="attendrequest"）
//文章中回复了你              “谁” 在 “文章”                  属于消息（type="articlereply"）

//关注                        “谁“ 关注了你                   属于通知（type="focusyou"）
//通知                        “社团” 通过了你的加入请求       属于通知（type="attendapprove"）