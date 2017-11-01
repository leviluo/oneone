import publicController from '../controllers/publicController'
import memberController from '../controllers/memberController'
import authController from '../controllers/authController'
import fileController from '../controllers/fileControllers'
import organizationController from '../controllers/organizationController'
import specialitiesController from '../controllers/admin/specialitiesController'
import suggestionsController from '../controllers/admin/suggestionsController'


export default function routers(router){

	router.post("/register",authController.register,router.allowedMethods());

	router.post("/login",authController.login,router.allowedMethods());

	router.get("/auth",authController.auth,router.allowedMethods());
	
	router.get("/loginOut",authController.loginOut,router.allowedMethods());
// 获取所有的特长专业，用于新增特长时用
	// router.get("/public/catelogues",publicController.catelogues,router.allowedMethods());
// // 获取所有的专业信息在category页面
// 	router.post("/public/items",publicController.items,router.allowedMethods());
//获取类目
	// router.get("/public/getCatelogy",publicController.getCatelogy,router.allowedMethods()); 
// 公共会员信息
	// router.get("/public/memberInfo",publicController.memberInfo,router.allowedMethods()); 
// 新增专业
	router.post("/member/addSpeciality",memberController.addSpeciality,router.allowedMethods());
// 我的更新
	router.get("/myUpdates",publicController.getMyUpdates,router.allowedMethods());
// 获取所有的专业信息
	router.get("/specialities",publicController.specialities,router.allowedMethods());
// 获取作品
	// router.get("/works",publicController.getWorks,router.allowedMethods());
// 获取作品
	// router.get("/public/getWorksFrom",publicController.getWorksFrom,router.allowedMethods());
// 获取关注
	router.get("/follows",publicController.getFollows,router.allowedMethods());
// 获取粉丝
	router.get("/fans",publicController.getFans,router.allowedMethods());
// 获取好友
	router.get("/friends",publicController.getFriends,router.allowedMethods());
// 未读消息数
	router.get("/noReadMessages",memberController.noReadMessages,router.allowedMethods());
// 获取评论通知
	router.get("/notices",memberController.notices,router.allowedMethods());
// // 获取赞通知
// 	router.get("/likenotice",memberController.likenotice,router.allowedMethods());
// // 获取关注通知
// 	router.get("/focusnotice",memberController.focusnotice,router.allowedMethods());
	// 是否关注
	// router.get("/isFocus",memberController.isFocus,router.allowedMethods());
	// 是否好友
	// router.get("/isFriend",memberController.isFriend,router.allowedMethods());
// 获取作品页面的会员信息
	// router.get("/public/getMemberInfoWork",publicController.getMemberInfoWork,router.allowedMethods());
// 根据地理位置获取所有的图片动态
	router.get("/photoUpdates",publicController.getPhotoUpdates,router.allowedMethods());
// 根据地理位置获取所有的文章动态
	// router.get("/public/getArticleUpdates",publicController.getArticleUpdates,router.allowedMethods());
// 查询信息
	// router.get("/public/query",publicController.query,router.allowedMethods());
// 获取点赞用户
	// router.get("/likeMembers",publicController.likeMembers,router.allowedMethods());
// 查询用户标签
// router.get("/public/getMemberTag",publicController.getMemberTag,router.allowedMethods());
// 上传头像
	// router.post("/member/HeadImg",fileController.uploadHeadImg,router.allowedMethods());
// 上传视频
	router.post("/videos",memberController.submitPhotos,fileController.uploadVideo,router.allowedMethods());
//  获取视频
	router.get("/videos",fileController.loadVideo,router.allowedMethods());
// 图片浏览器中图片是否点赞
	// router.get("/member/ifliked",memberController.ifliked,router.allowedMethods());
// 二维码
	// router.get("/qrcode",fileController.qrCode,router.allowedMethods());  
// 获取图片
	router.get("/img",fileController.loadImg,router.allowedMethods());  
// 获取图片
	router.get("/originImg",fileController.loadOriginImg,router.allowedMethods());  
// 获取会员信息
	// router.get("/member/getMemberInfo",memberController.getMemberInfo,router.allowedMethods());
// 发送消息
	// router.post("/message",memberController.message,fileController.submitMessage,router.allowedMethods());
// 获取历史聊天记录
	// router.get("/message",memberController.updateActive,memberController.historyChat,router.allowedMethods());
// 发送群消息
// 	router.post("/groupmessages",organizationController.message,fileController.submitMessage,router.allowedMethods());
// // 获取历史群消息
// 	router.get("/groupmessages",organizationController.historyChat,router.allowedMethods());
// // 获取最新消息
// 	router.get("/recentmessage",memberController.getMessageList,router.allowedMethods());
// // 修改昵称
// 	router.post("/member/modifyNickname",memberController.modifyNickname,router.allowedMethods());
// // 修改简介
// 	router.post("/member/modifyBrief",memberController.modifyBrief,router.allowedMethods());
// // 修改地址
// 	router.post("/member/modifyAddress",memberController.modifyAddress,router.allowedMethods());
// // 修改专业
// 	router.post("/member/modifySpeciality",memberController.modifySpeciality,router.allowedMethods());
// // 删除专业
// 	router.post("/member/deleteSpeciality",memberController.deleteSpeciality,router.allowedMethods());
// 关注
	router.get("/member/followOne",memberController.followOne,router.allowedMethods());
// 取关
	router.get("/member/followOutOne",memberController.followOutOne,router.allowedMethods());
// 上传作品
	// router.post("/member/submitPhotos",memberController.submitPhotos,fileController.uploadPhotos,router.allowedMethods());
// 赞
	router.get("/member/addLike",memberController.addLike,router.allowedMethods());
// 删除照片
	// router.get("/member/deletePhoto",memberController.deletePhoto,fileController.deletePhoto,router.allowedMethods());
// 获取更新信息
	// router.get("/member/getupdates",memberController.getupdates,router.allowedMethods());
// 添加新社团
// 	router.post("/organizations/addOrganization",organizationController.addOrganization,fileController.uploadOrganizationImg,router.allowedMethods());
// // 修改社团信息
// 	router.post("/organizations/modifyOrganization",organizationController.modifyOrganization,fileController.uploadOrganizationImg,router.allowedMethods());
// // 获取我创建的社团
// 	router.get("/organizations/getOrganizationByMe",organizationController.getOrganizationByMe,router.allowedMethods());
// // 获取我加入的社团
// 	router.get("/organizations/getMyOrganization",organizationController.getMyOrganization,router.allowedMethods());
// // 删除创建的社团
// 	router.post("/organizations/deleteOrganization",organizationController.deleteOrganization,router.allowedMethods());
// // 获取社团基本信息
// 	router.get("/organizations/basicInfo",organizationController.basicInfo,router.allowedMethods());
// // 获取所有的会员信息
// 	router.get("/organizations/getMembers",organizationController.getMembers,router.allowedMethods());
// //上传文章信息
// 	router.post("/organizations/submitArticle",organizationController.addArticle,fileController.uploadArticleImg,router.allowedMethods());
// // 加入社团
// 	router.post("/organizations/attendOrganization",organizationController.attendOrganization,router.allowedMethods());
// // 退出社团
// 	router.get("/organizations/quitOrganization",organizationController.quitOrganization,router.allowedMethods());
// // 按照会员数获取最热社团
// 	router.get("/organizations/OrganizationsSortByHot",organizationController.OrganizationsSortByHot,router.allowedMethods());
// // 获取所有活动信息
// 	router.get("/organizations/getArticleList",organizationController.getArticleList,router.allowedMethods());
// // 获取文章详情
// 	router.get("/organizations/article",organizationController.article,router.allowedMethods());
// // 删除文章
// 	router.get("/organizations/deleteArticle",fileController.deletePhotos,organizationController.deleteArticle,router.allowedMethods());
// // 获取文章回复
// 	router.get("/organizations/ArticleReply",organizationController.ArticleReply,router.allowedMethods());
// 获取评论列表
	router.get("/comments",publicController.comments,router.allowedMethods());
// 评论
	router.post("/comment",publicController.reply,router.allowedMethods());
// 删除评论
	router.delete("/comment",publicController.deleteReply,router.allowedMethods());
// 删除动态
	router.delete("/update",publicController.deleteUpdate,router.allowedMethods());

// 删除文章回复
// 	router.get("/organizations/deleteReply",organizationController.deleteReply,router.allowedMethods());
// // 评价文章
// 	router.post("/organizations/reply",organizationController.reply,router.allowedMethods());
// // 发布的文章
// 	router.get("/organizations/getMyPost",organizationController.getMyPost,router.allowedMethods());
// // 获取回復
// 	router.get("/organizations/getReplyMe",organizationController.getReplyMe,router.allowedMethods());
// 获取評論
// 	router.get("/commentsme",organizationController.commentsme,router.allowedMethods());
// // 获取入社请求
// 	router.get("/requestorganizations",organizationController.requestorganizations,router.allowedMethods());
// // 获取通知
// 	// router.get("/organizations/getApproveMe",organizationController.getApproveMe,router.allowedMethods());
// // 获取入社申请
// 	router.get("/organizations/getrequestData",organizationController.getrequestData,router.allowedMethods());
// // 审核申请
// 	router.get("/organizations/isApprove",organizationController.isApprove,router.allowedMethods());
// app获取用户信息
	router.get("/userinfo",memberController.userinfo,authController.islogin,router.allowedMethods());
// app保存信息
	router.post("/userinfo",memberController.submitUserinfo,fileController.uploadHeadImg,router.allowedMethods());
// 获取消息记录
// 	router.get("/messages",memberController.messages,router.allowedMethods());
// // 获取通知
// 	router.get("/notices",memberController.notices,router.allowedMethods());
// // 更新通知
// 	router.put("/notices",memberController.updatenotices,router.allowedMethods());
// // 提交建议与意见
// 	router.post("/suggestions",memberController.suggestions,fileController.uploadSuggestionImg,router.allowedMethods());
// // 删除社团会员
// 	router.delete("/organizationsMembers",authController.islogin,organizationController.deleteMember,router.allowedMethods());
// // 获取最新会员
	router.get("/newestMem",publicController.newestMem,router.allowedMethods()); 
// // 获取最新社团
// 	router.get("/newestOrganization",publicController.newestOrganization,router.allowedMethods()); 
// 	后台管理部分 

	// 获取所有专业
	router.get("/specialities",authController.islogin,specialitiesController.getItem,router.allowedMethods());
	// 新增
	router.post("/specialities",authController.islogin,specialitiesController.addNewItem,router.allowedMethods());
	// 修改
	router.put("/specialities",authController.islogin,specialitiesController.modifyItem,router.allowedMethods());
	// 删除
	router.delete("/specialities",authController.islogin,specialitiesController.deleteItem,router.allowedMethods());
	// 获取所有的建议
	router.get("/suggestions",authController.islogin,suggestionsController.getsuggestions,router.allowedMethods());

}
