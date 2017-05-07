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
    type: { type: String, default: '' },
    createdate: {
        type: Date,
        default: Date.now
    },
    hostId: { type: Number, default: 0 },      //你是谁
    memberId: { type: Number, default: 0 },      
    organizationsId: { type: Number, default: 0 },      
    nickname: { type: String, default: '' },
    organizationsname: { type: String, default: '' },
    organizationshead: { type: String, default: '' }, 
})

var messageSchema = new mongoose.Schema({
    status: { type: Number, default: 0 },
    type: { type: String, default: '' },
    createdate: {
        type: Date,
        default: Date.now
    },
    hostId: { type: Number, default: 0 },  //   你是谁
    memberId: { type: Number, default: 0 },      
    organizationsId: { type: Number, default: 0 },      
    nickname: { type: String, default: '' },
    articleId: { type: Number, default: 0 },
})

var articleSchema = new mongoose.Schema({
    articleId: { type: Number, default: 0 },
    content: { type: String, default: '' }
})

var suggestionSchema = new mongoose.Schema({
    contact: { type: String, default: '' },
    content: { type: String, default: '' }
})

// var News = mongoose.model('News', NewsSchema);
// mongoose.model('User', UserSchema);
mongoose.model('Message', messageSchema);
mongoose.model('Notice', noticeSchema);
mongoose.model('Article', articleSchema);
mongoose.model('Suggestion', suggestionSchema);

console.log("加载mongo模型")


//私信                        “谁” 给你发了私信               属于消息（type="privatemessage"）
//文章评价                    “谁” 在 “文章”                  属于消息（type="articlecomment"）
//请求入群                    “谁” 请求加入 “社团”            属于消息（type="attendrequest"）
//文章中回复了你              “谁” 在 “文章”                  属于消息（type="articlereply"）

//关注                        “谁“ 关注了你                   属于通知（type="focusyou"）
//通知                        “社团” 通过了你的加入请求       属于通知（type="attendapprove"）