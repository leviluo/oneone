create database onetoone;
use onetoone;

CREATE TABLE `member` (         
  `id` int unsigned auto_increment,
  `nickname` varchar(20) DEFAULT '',
  `password` char(40) DEFAULT '',
  `phone` varchar(40) DEFAULT '',   
  `brief` varchar(100) DEFAULT '',  
  `location` varchar(15) default '',
  `head` varchar(30) default '',
  `address` varchar(100) default '',
  `sex` char(1),
  `createAt` datetime default now(),
  `updateAt` datetime default now(),
  PRIMARY KEY  (`id`)
);

--关注
CREATE TABLE `follows` (  
  `id` int unsigned auto_increment,
  `memberId` int unsigned,
  `followId` int unsigned,
  `createAt` datetime default now(),
  PRIMARY KEY  (`id`)
);

--会员更新
CREATE TABLE `memberupdates` (  
  `id` int unsigned auto_increment,
  `memberId` int unsigned,
  `articleId` int unsigned,
  `memberSpecialityId` int unsigned,
  `works` varchar(300) not null default '',
  `createAt` datetime default now(),
  PRIMARY KEY  (`id`)
);

--专业类目表
CREATE TABLE `specialityCategory` (  
  `id` int unsigned auto_increment,
  `name` varchar(20) DEFAULT '',
  PRIMARY KEY  (`id`)
);

--专业表
CREATE TABLE `specialities` (  
  `id` int unsigned auto_increment,
  `categoryId` int unsigned,
  `name` varchar(20) DEFAULT '',
  PRIMARY KEY  (`id`)
);

--用户专业表
CREATE TABLE `memberSpeciality` (  
  `id` int unsigned auto_increment,
  `memberId` int unsigned,
  `specialitiesId` int unsigned,
  `brief` varchar(300) DEFAULT '',
  `experience` text ,
  PRIMARY KEY  (`id`)
);

--作品表
CREATE TABLE `works` (  
  `id` int unsigned auto_increment,
  `memberSpecialityId` int unsigned,
  `name` char(30) default '',
  `createdAt` datetime DEFAULT now(),
  PRIMARY KEY  (`id`)
);

--点赞表
CREATE TABLE `likes` (  
  `id` int unsigned auto_increment,
  `worksId` int unsigned auto_increment,
  `memberId` int unsigned auto_increment,
  PRIMARY KEY  (`id`)
);

--社团表
CREATE TABLE `organizations` (  
  `id` int unsigned auto_increment,
  `categoryId` int unsigned,
  `name` varchar(40) default '',
  `brief` varchar(1000) default '',
  `time` datetime default NOW(),
  `head` varchar(80) default '',
  `createById` int unsigned,
  PRIMARY KEY  (`id`)
);

--用户社团
CREATE TABLE `memberOrganizations` (  
  `id` int unsigned auto_increment,
  `memberId` int unsigned,
  `organizationsId` int unsigned,
  PRIMARY KEY  (`id`)
);

--加入社团申请表
CREATE TABLE `organizationsRequest` (  
  `id` int unsigned auto_increment,
  `memberId` int unsigned,
  `organizationsId` int unsigned,
  `createdAt` datetime DEFAULT now() COMMENT '//',
  `verified` varchar(300) default '',
  `status` tinyint(1) unsigned DEFAULT 0 COMMENT '//0:未读,1:已通过',
  PRIMARY KEY  (`id`)
);

--社团通知活动等
CREATE TABLE `article`(  
  `id` int unsigned auto_increment,
  `organizationsId` int unsigned,
  `memberId` int unsigned,
  `title` varchar(50) DEFAULT '' COMMENT '//标题',
  `content` text COMMENT '//',
  `type` tinyint(1) unsigned DEFAULT 0 COMMENT '//0:普通,1:活动,2:公告,3:咨询',
  `attachedImgs` varchar(300) default '',
  `createdAt` datetime DEFAULT now() COMMENT '//',
  `updatedAt` datetime DEFAULT now() COMMENT '//',
  PRIMARY KEY  (`id`)
);

--评论列表
CREATE TABLE `comments` (  
  `id` int unsigned auto_increment,
  `articleId` int unsigned,
  `memberId` int unsigned,
  `comment` varchar(1000) default '',
  `status` tinyint(1) unsigned DEFAULT 0 COMMENT '//0:未读,1:已读',
  `createdAt` datetime DEFAULT now() COMMENT '//',
  PRIMARY KEY  (`id`)
);

--回复通知 
CREATE TABLE `reReply` (  
  `id` int unsigned auto_increment,
  `replyTo` int unsigned,
  `commentsId` int unsigned,
  `status` tinyint(1) unsigned DEFAULT 0 COMMENT '//0:未读,1:已读',
  PRIMARY KEY  (`id`)
);

--私信
CREATE TABLE `message` (  
  `id` int unsigned auto_increment,
  `fromMember` int unsigned,
  `toMember` int unsigned,
  `active` char(1) default 0,
  `text` varchar(300) default '',
  `imgUrl` varchar(80) default '',
  `time` datetime default NOW(),
  PRIMARY KEY  (`id`)
);

--article修改了organizationsId,comments删除了replyTo,comments增加了status,notice增加了replyTo,notice改为reReply
insert into organizations(`categoryId`,`name`,`brief`,`createById`) values(1,"爱乐动","运动爱好者",20),(1,"爱乐动2","运动爱好者2",20),(2,"爱健康","运动爱好者2",20)

insert into specialityCategory set name="运动";
insert into specialityCategory set name="健康";
insert into specialityCategory set name="理财/经济";
insert into specialityCategory set name="法律";
insert into specialityCategory set name="学习";
insert into specialityCategory set name="生活";

insert into specialities set name="健身教练",categoryId=1;
insert into specialities set name="游泳教练",categoryId=1;
insert into specialities set name="篮球教练",categoryId=1;
insert into specialities set name="羽毛球教练",categoryId=1;

insert into specialities set name="台球教练",categoryId=1;
insert into specialities set name="保龄球教练",categoryId=1;
insert into specialities set name="乒乓球教练",categoryId=1;
insert into specialities set name="营养师",categoryId=2;

insert into specialities set name="私人健康管理",categoryId=2;
insert into specialities set name="理财规划",categoryId=3;
insert into specialities set name="会计",categoryId=3;

insert into specialities set name="婚姻家庭",categoryId=4;
insert into specialities set name="刑事诉讼",categoryId=4;
insert into specialities set name="劳动纠纷",categoryId=4;
insert into specialities set name="交通事故",categoryId=4;
insert into specialities set name="合同纠纷",categoryId=4;
insert into specialities set name="房产纠纷",categoryId=4;
insert into specialities set name="公司法律",categoryId=4;
insert into specialities set name="医疗事故",categoryId=4;
insert into specialities set name="工程纠纷",categoryId=4;
insert into specialities set name="征地拆迁",categoryId=4;
insert into specialities set name="工程纠纷",categoryId=4;
insert into specialities set name="知识产权",categoryId=4;
insert into specialities set name="保险理赔",categoryId=4;

insert into specialities set name="英语家教",categoryId=5;
insert into specialities set name="日语家教",categoryId=5;
insert into specialities set name="法语家教",categoryId=5;
insert into specialities set name="西班牙语家教",categoryId=5;
insert into specialities set name="数学家教",categoryId=5;
insert into specialities set name="物理家教",categoryId=5;
insert into specialities set name="化学家教",categoryId=5;
