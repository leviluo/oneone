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

// var noticeSchema = new mongoose.Schema({
//     status: { type: Number, default: 0 },
//     type: { type: String, default: '' },
//     createdate: {
//         type: Date,
//         default: Date.now
//     },
//     hostId: { type: Number, default: 0 },
//     memberId: { type: Number, default: 0 },           
//     nickname: { type: String, default: '' },
//     comment: { type: String, default: '' },
//     workname: { type: String, default: '' },
//     updatesId: { type: Number, default: 0 }, 
//     commentsId:{ type: Number, default: 0 }, 
// })

// var focusSchema = new mongoose.Schema({
//     status: { type: Number, default: 0 },
//     ntype: { type: String, default: 'focus' },
//     createdate: {
//         type: Date,
//         default: Date.now
//     },
//     hostId: { type: Number, default: 0 },
//     memberId: { type: Number, default: 0 },           
//     nickname: { type: String, default: '' },
//     head: { type: String, default: '' },
//     // comment: { type: String, default: '' },
//     // workname: { type: String, default: '' },
//     // updatesId: { type: Number, default: 0 }, 
//     // commentsId:{ type: Number, default: 0 }, 
// })

// var replySchema = new mongoose.Schema({
//     status: { type: Number, default: 0 },
//     // type: { type: String, default: '' },
//     ntype: { type: String, default: 'reply' },
//     createdate: {
//         type: Date,
//         default: Date.now
//     },
//     head: { type: String, default: '' },
//     hostId: { type: Number, default: 0 },
//     memberId: { type: Number, default: 0 },           
//     nickname: { type: String, default: '' },
//     comment: { type: String, default: '' },
//     workname: { type: String, default: '' },
//     type: { type: String, default: '' },
//     updatesId: { type: Number, default: 0 }, 
//     commentsId:{ type: Number, default: 0 }, 
// })

// var likeSchema = new mongoose.Schema({
//     status: { type: Number, default: 0 },
//     ntype: { type: String, default: 'like' },
//     // type: { type: String, default: '' },
//     createdate: {
//         type: Date,
//         default: Date.now
//     },
//     hostId: { type: Number, default: 0 },
//     memberId: { type: Number, default: 0 },           
//     nickname: { type: String, default: '' },
//     head: { type: String, default: '' },
//     type: { type: String, default: '' },
//     // comment: { type: String, default: '' },
//     workname: { type: String, default: '' },
//     updatesId: { type: Number, default: 0 }, 
//     // commentsId:{ type: Number, default: 0 }, 
// })

var noticeSchema = new mongoose.Schema({
    // status: { type: Number, default: 0 },
    ntype: { type: String, default: '' },
    // type: { type: String, default: '' },
    time: {
        type: Date,
        default: Date.now
    },
    hostId: { type: Number, default: 0 },
    memberId: { type: Number, default: 0 },           
    nickname: { type: String, default: '' },
    teamname: { type: String, default: '' },
    head: { type: String, default: '' },
    type: { type: String, default: '' },
    comment: { type: String, default: '' },
    workname: { type: String, default: '' },
    updatesId: { type: Number, default: 0 }, 
    commentsId:{ type: Number, default: 0 }, 
    teamId: { type: Number, default: 0 }
})

var messageSchema = new mongoose.Schema({
    // status: { type: Number, default: 0 },
    ntype: { type: String, default: 'msg' },
    id: { type: Number, default: 0 },
    hostId: { type: Number, default: 0 },  
    sendTo: { type: Number, default: 0 },            
    sendFrom: { type: Number, default: 0 },            
    time: { type: Date },
    sendTonickname: { type: String, default: '' },
    sendnickname: { type: String, default: '' },
    sendFromHead: { type: String, default: '' }, 
    text: { type: String, default: '' },
    type: { type: String, default: '' },
    sendTohead: { type: String, default: '' },
})


// var groupmessageSchema = new mongoose.Schema({
//     status: { type: Number, default: 0 },
//     // type: { type: String, default: '' },
//     ntype: { type: String, default: 'groupmsg' },
//     id: { type: Number, default: 0 },
//     teamId: { type: Number, default: 0 },
//     // hostId: { type: Number, default: 0 }, 
//     hostId: { type: Number, default: 0 },            
//     sendFrom: { type: Number, default: 0 },            
//     time: { type: Date },
//     sendnickname: { type: String, default: '' },
//     sendFromHead: { type: String, default: '' },
//     text: { type: String, default: '' },
//     type: { type: String, default: '' },
// })

// var articleSchema = new mongoose.Schema({
//     articleId: { type: Number, default: 0 },
//     content: { type: String, default: '' }
// })

// var suggestionSchema = new mongoose.Schema({
//     contact: { type: String, default: '' },
//     content: { type: String, default: '' }
// })

// var News = mongoose.model('News', NewsSchema);
// mongoose.model('User', UserSchema);
mongoose.model('msg', messageSchema);
mongoose.model('notice', noticeSchema);

// mongoose.model('GroupMsg', groupmessageSchema);
// mongoose.model('Focus', focusSchema);
// mongoose.model('Like', likeSchema);
// mongoose.model('Reply', replySchema);
// mongoose.model('Article', articleSchema);
// mongoose.model('Suggestion', suggestionSchema);

console.log("加载mongo模型")


//私信                        “谁” 给你发了私信               属于消息（type="privatemessage"）
//文章评价                    “谁” 在 “文章”                  属于消息（type="articlecomment"）
//请求入群                    “谁” 请求加入 “社团”            属于消息（type="attendrequest"）
//文章中回复了你              “谁” 在 “文章”                  属于消息（type="articlereply"）

//关注                        “谁“ 关注了你                   属于通知（type="focusyou"）
//通知                        “社团” 通过了你的加入请求       属于通知（type="attendapprove"）