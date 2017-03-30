create database onetoone;
use onetoone;

CREATE TABLE `member` (         
  `id` int unsigned auto_increment,
  `nickname` varchar(20) not null DEFAULT '',
  `password` char(40) not null DEFAULT '',
  `phone` varchar(40) not null DEFAULT '',   
  `brief` varchar(100) not null DEFAULT '',  
  `location` varchar(15) not null default '',
  `head` varchar(30) not null default '',
  `address` varchar(100) not null default '',
  `sex` tinyint(1) not null default 0,
  `createAt` datetime not null default now(),
  `updateAt` datetime not null default now(),
  PRIMARY KEY  (`id`)
);

--关注
CREATE TABLE `follows` (  
  `id` int unsigned auto_increment,
  `memberId` int unsigned not null default 0,
  `followId` int unsigned not null default 0,
  `createAt` datetime not null default now(),
  PRIMARY KEY  (`id`)
);

--会员更新
CREATE TABLE `memberupdates` (  
  `id` int unsigned auto_increment,
  `memberId` int unsigned not null default 0,
  `articleId` int unsigned not null default 0,
  `memberSpecialityId` int unsigned not null default 0,
  `works` varchar(300) not null default '',
  `createAt` datetime not null default now(),
  PRIMARY KEY  (`id`)
);

--专业类目表
CREATE TABLE `specialityCategory` (  
  `id` int unsigned auto_increment,
  `name` varchar(20) not null DEFAULT '',
  PRIMARY KEY  (`id`)
);

--专业表
CREATE TABLE `specialities` (  
  `id` int unsigned auto_increment,
  `categoryId` int unsigned not null default 0,
  `name` varchar(20) not null DEFAULT '',
  PRIMARY KEY  (`id`)
);

--用户专业表
CREATE TABLE `memberSpeciality` (  
  `id` int unsigned auto_increment,
  `memberId` int unsigned not null default 0,
  `specialitiesId` int unsigned not null default 0,
  `brief` varchar(300) not null DEFAULT '',
  `experience` text not null default '',
  PRIMARY KEY  (`id`)
);

--作品表
CREATE TABLE `works` (  
  `id` int unsigned auto_increment,
  `memberSpecialityId` int unsigned not null default 0,
  `name` char(30) not null default '',
  `createdAt` datetime not null DEFAULT now(),
  PRIMARY KEY  (`id`)
);

--点赞表
CREATE TABLE `likes` (  
  `id` int unsigned auto_increment,
  `worksId` int unsigned not null default 0,
  `memberId` int unsigned not null default 0,
  PRIMARY KEY  (`id`)
);

--社团表
CREATE TABLE `organizations` (  
  `id` int unsigned auto_increment,
  `categoryId` int unsigned not null default 0,
  `name` varchar(40) not null default '',
  `brief` varchar(1000) not null default '',
  `time` datetime not null default NOW(),
  `head` varchar(80) not null default '',
  `createById` int unsigned not null default 0,
  PRIMARY KEY  (`id`)
);

--用户社团
CREATE TABLE `memberOrganizations` (  
  `id` int unsigned auto_increment,
  `memberId` int unsigned not null default 0,
  `organizationsId` int unsigned not null default 0,
  PRIMARY KEY  (`id`)
);

--加入社团申请表
CREATE TABLE `organizationsRequest` (  
  `id` int unsigned auto_increment,
  `memberId` int unsigned not null default 0,
  `organizationsId` int unsigned not null default 0,
  `createdAt` datetime not null DEFAULT now() COMMENT '//',
  `verified` varchar(300) not null default '',
  `status` tinyint(1) unsigned not null DEFAULT 0 COMMENT '//0:未读,1:已通过',
  PRIMARY KEY  (`id`)
);

--社团通知活动等
CREATE TABLE `article`(  
  `id` int unsigned auto_increment,
  `organizationsId` int unsigned not null default 0,
  `memberId` int unsigned not null default 0,
  `title` varchar(50) not null DEFAULT '' COMMENT '//标题',
  `content` text not null default '' COMMENT '//',
  `type` tinyint(1) unsigned not null DEFAULT 0 COMMENT '//0:普通,1:活动,2:公告,3:咨询',
  `attachedImgs` varchar(300) not null default '',
  `createdAt` datetime not null DEFAULT now() COMMENT '//',
  `updatedAt` datetime not null DEFAULT now() COMMENT '//',
  PRIMARY KEY  (`id`)
);

--评论列表
CREATE TABLE `comments` (  
  `id` int unsigned auto_increment,
  `articleId` int unsigned not null default 0,
  `memberId` int unsigned not null default 0,
  `comment` varchar(1000) not null default '',
  `status` tinyint(1) unsigned not null DEFAULT 0 COMMENT '//0:未读,1:已读',
  `createdAt` datetime not null DEFAULT now() COMMENT '//',
  PRIMARY KEY  (`id`)
);

--回复通知 
CREATE TABLE `reReply` (  
  `id` int unsigned auto_increment,
  `replyTo` int unsigned not null default 0,
  `commentsId` int unsigned not null default 0,
  `status` tinyint(1) unsigned not null DEFAULT 0 COMMENT '//0:未读,1:已读',
  PRIMARY KEY  (`id`)
);

--私信
CREATE TABLE `message` (  
  `id` int unsigned auto_increment,
  `fromMember` int unsigned not null default 0,
  `toMember` int unsigned not null default 0,
  `active` char(1) not null default 0,
  `text` varchar(300) not null default '',
  `imgUrl` varchar(80) not null default '',
  `time` datetime not null default NOW(),
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
