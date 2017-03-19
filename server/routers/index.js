import publicController from '../controllers/publicController'
import memberController from '../controllers/memberController'
import authController from '../controllers/authController'
import fileController from '../controllers/fileControllers'
import organizationController from '../controllers/organizationController'
// import config from '../../config'

// const paths = config.utils_paths

export default function routers(router){

	router.post("/register",authController.register,router.allowedMethods());

	router.post("/login",authController.login,router.allowedMethods());

	router.get("/auth",authController.auth,router.allowedMethods());
	
	router.get("/loginOut",authController.loginOut,router.allowedMethods());
// 获取所有的特长专业，用于新增特长时用
	router.get("/public/catelogues",publicController.catelogues,router.allowedMethods());
// 获取所有的专业信息在category页面
	router.post("/public/items",publicController.items,router.allowedMethods());
//获取类目
	router.get("/public/getCatelogy",publicController.getCatelogy,router.allowedMethods()); 
// 公共会员信息
	router.get("/public/memberInfo",publicController.memberInfo,router.allowedMethods()); 
// 新增专业
	router.post("/member/addSpeciality",memberController.addSpeciality,router.allowedMethods());
// 我的更新
	router.get("/public/getMyUpdates",publicController.getMyUpdates,router.allowedMethods());
// 获取所有的专业信息
	router.get("/public/specialities",publicController.specialities,router.allowedMethods());
// 获取作品
	router.get("/public/getWorks",publicController.getWorks,router.allowedMethods());
// 获取作品
	router.get("/public/getWorksFrom",publicController.getWorksFrom,router.allowedMethods());
// 获取关注
	router.get("/public/getFollows",publicController.getFollows,router.allowedMethods());
// 获取粉丝
	router.get("/public/getFans",publicController.getFans,router.allowedMethods());
// 获取作品页面的会员信息
	router.get("/public/getMemberInfoWork",publicController.getMemberInfoWork,router.allowedMethods());
// 根据地理位置获取所有的图片动态
	router.get("/public/getPhotoUpdates",publicController.getPhotoUpdates,router.allowedMethods());
// 根据地理位置获取所有的文章动态
	router.get("/public/getArticleUpdates",publicController.getArticleUpdates,router.allowedMethods());
// 查询信息
	router.get("/public/query",publicController.query,router.allowedMethods());
// 查询用户标签
	// router.get("/public/getMemberTag",publicController.getMemberTag,router.allowedMethods());
 //上传头像
	router.post("/member/HeadImg",fileController.uploadHeadImg,router.allowedMethods());
 // 图片浏览器中图片是否点赞
	router.get("/member/ifliked",memberController.ifliked,router.allowedMethods());
// 二维码
	router.get("/qrcode",fileController.qrCode,router.allowedMethods());  
// 获取图片
	router.get("/img",fileController.loadImg,router.allowedMethods());  
// 获取图片
	router.get("/originImg",fileController.loadOriginImg,router.allowedMethods());  
// 获取会员信息
	router.get("/member/getMemberInfo",memberController.getMemberInfo,router.allowedMethods());
// 发送文本消息
	router.post("/member/messageText",memberController.messageText,router.allowedMethods());
// 获取历史聊天记录
	router.post("/member/historyChat",memberController.updateActive,memberController.historyChat,router.allowedMethods());
// 发送图片消息
	router.post("/member/messageImg",fileController.insertImg,fileController.messageImg,router.allowedMethods());
// 获取最新消息
	router.get("/member/getMessageList",memberController.getMessageList,router.allowedMethods());
// 修改昵称
	router.post("/member/modifyNickname",memberController.modifyNickname,router.allowedMethods());
// 修改简介
	router.post("/member/modifyBrief",memberController.modifyBrief,router.allowedMethods());
// 修改地址
	router.post("/member/modifyAddress",memberController.modifyAddress,router.allowedMethods());
// 修改专业
	router.post("/member/modifySpeciality",memberController.modifySpeciality,router.allowedMethods());
// 删除专业
	router.post("/member/deleteSpeciality",memberController.deleteSpeciality,router.allowedMethods());
// 关注
	router.get("/member/followOne",memberController.followOne,router.allowedMethods());
// 取关
	router.get("/member/followOutOne",memberController.followOutOne,router.allowedMethods());
// 动态中的图片点赞功能
	router.get("/member/addLikeByName",memberController.addLikeByName,router.allowedMethods());
// 计算多少未读消息
	router.get("/member/countMessage",memberController.countMessage,router.allowedMethods());
// 计算多少未读通知
	router.get("/member/countNotice",memberController.countNotice,router.allowedMethods());
// 计算多少回复
	router.get("/member/countReply",memberController.countReply,router.allowedMethods());
// 计算多少入社请求
	router.get("/member/countRequest",memberController.countRequest,router.allowedMethods());
// 上传作品
	router.post("/member/submitPhotos",memberController.submitPhotos,fileController.uploadPhotos,router.allowedMethods());
// 赞
	router.get("/member/addLike",memberController.addLike,router.allowedMethods());
// 删除照片
	router.get("/member/deletePhoto",memberController.deletePhoto,fileController.deletePhoto,router.allowedMethods());
// 获取更新信息
	router.get("/member/getupdates",memberController.getupdates,router.allowedMethods());
// 添加新社团
	router.post("/organizations/addOrganization",organizationController.addOrganization,fileController.uploadOrganizationImg,router.allowedMethods());
// 修改社团信息
	router.post("/organizations/modifyOrganization",organizationController.modifyOrganization,fileController.uploadOrganizationImg,router.allowedMethods());
// 获取我创建的社团
	router.get("/organizations/getOrganizationByMe",organizationController.getOrganizationByMe,router.allowedMethods());
// 获取我加入的社团
	router.get("/organizations/getMyOrganization",organizationController.getMyOrganization,router.allowedMethods());
// 删除创建的社团
	router.post("/organizations/deleteOrganization",organizationController.deleteOrganization,router.allowedMethods());
// 获取社团基本信息
	router.get("/organizations/basicInfo",organizationController.basicInfo,router.allowedMethods());
// 获取所有的会员信息
	router.get("/organizations/getMembers",organizationController.getMembers,router.allowedMethods());
//上传文章信息
	router.post("/organizations/submitArticle",organizationController.addArticle,fileController.uploadArticleImg,router.allowedMethods());
// 加入社团
	router.post("/organizations/attendOrganization",organizationController.attendOrganization,router.allowedMethods());
// 退出社团
	router.get("/organizations/quitOrganization",organizationController.quitOrganization,router.allowedMethods());
// 按照会员数获取最热社团
	router.get("/organizations/OrganizationsSortByHot",organizationController.OrganizationsSortByHot,router.allowedMethods());
// 获取所有活动信息
	router.get("/organizations/getArticleList",organizationController.getArticleList,router.allowedMethods());
// 获取文章详情
	router.get("/organizations/article",organizationController.article,router.allowedMethods());
// 删除文章
	router.get("/organizations/deleteArticle",fileController.deletePhotos,organizationController.deleteArticle,router.allowedMethods());
// 获取文章回复
	router.get("/organizations/ArticleReply",organizationController.ArticleReply,router.allowedMethods());
// 删除文章回复
	router.get("/organizations/deleteReply",organizationController.deleteReply,router.allowedMethods());
// 评价文章
	router.post("/organizations/reply",organizationController.reply,router.allowedMethods());
// 发布的文章
	router.get("/organizations/getMyPost",organizationController.getMyPost,router.allowedMethods());
// 获取通知
	router.get("/organizations/getReplyMe",organizationController.getReplyMe,router.allowedMethods());
// 获取通知
	router.get("/organizations/getApproveMe",organizationController.getApproveMe,router.allowedMethods());
// 获取入社申请
	router.get("/organizations/getrequestData",organizationController.getrequestData,router.allowedMethods());
// 审核申请
	router.get("/organizations/isApprove",organizationController.isApprove,router.allowedMethods());

	// router.get('*', async function (next){
	    // this.res.sendFile(paths.client('static'))
		// this.redirect('/')
	    // await next
	// })
}
