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

CREATE TABLE `extraInfo` (         
  `id` int unsigned auto_increment,
  `memberId` int unsigned not null default 0,
  `price` int unsigned not null default 0,
  PRIMARY KEY  (`id`)
);

CREATE TABLE `admin` (         
  `id` int unsigned auto_increment,
  `account` varchar(20) DEFAULT '',
  `password` char(40) DEFAULT '',
  `degree` tinyint(1) DEFAULT 0,
  PRIMARY KEY  (`id`)
);

insert into admin(`account`,`password`) values("admin","9cbf8a4dcb8e30682b927f352d6559a0");

CREATE TABLE `follows` (  
  `id` int unsigned auto_increment,
  `memberId` int unsigned not null default 0,
  `followId` int unsigned not null default 0,
  `createAt` datetime not null default now(),
  PRIMARY KEY  (`id`)
);


CREATE TABLE `blacklist` (  
  `id` int unsigned auto_increment,
  `memberId` int unsigned not null default 0,
  `blackId` int unsigned not null default 0,
  `createAt` datetime not null default now(),
  PRIMARY KEY  (`id`)
);


CREATE TABLE `memberupdates` (  
  `id` int unsigned auto_increment,
  `memberId` int unsigned not null default 0,
  -- `articleId` int unsigned not null default 0,
  -- `memberSpecialityId` int unsigned not null default 0,
  -- `works` varchar(300) not null default '',
  `text` varchar(140) not null DEFAULT '',
  `type` varchar(15) not null default '',
  `createAt` datetime not null default now(),
  PRIMARY KEY  (`id`)
);

CREATE TABLE `specialityCategory` (  
  `id` int unsigned auto_increment,
  `name` varchar(20) not null DEFAULT '',
  PRIMARY KEY  (`id`)
);

CREATE TABLE `specialities` (  
  `id` int unsigned auto_increment,
  `categoryId` int unsigned not null default 0,
  `name` varchar(20) not null DEFAULT '',
  PRIMARY KEY  (`id`)
);

CREATE TABLE `memberSpeciality` (  
  `id` int unsigned auto_increment,
  `memberId` int unsigned not null default 0,
  `specialitiesId` int unsigned not null default 0,
  `brief` varchar(300) not null DEFAULT '',
  `experience` text not null,
  PRIMARY KEY  (`id`)
);

CREATE TABLE `works` (  
  `id` int unsigned auto_increment,
  `memberSpecialityId` int unsigned not null default 0,
  `name` char(30) not null default '',
  `createdAt` datetime not null DEFAULT now(),
  `updateId` int unsigned not null default 0,
  PRIMARY KEY  (`id`)
);

CREATE TABLE `likes` (  
  `id` int unsigned auto_increment,
  `updatesId` int unsigned not null default 0,
  `memberId` int unsigned not null default 0,
  PRIMARY KEY  (`id`)
);

-- CREATE TABLE `organizations` (  
--   `id` int unsigned auto_increment,
--   `categoryId` int unsigned not null default 0,
--   `name` varchar(40) not null default '',
--   `brief` varchar(1000) not null default '',
--   `time` datetime not null default NOW(),
--   `head` varchar(80) not null default '',
--   `createById` int unsigned not null default 0,
--   PRIMARY KEY  (`id`)
-- );

CREATE TABLE `team` (  
  `id` int unsigned auto_increment,
  `name` varchar(40) not null default '',
  `brief` varchar(1000) not null default '',
  `time` datetime not null default NOW(),
  `head` varchar(80) not null default '',
  `createById` int unsigned not null default 0,
  PRIMARY KEY  (`id`)
);

CREATE TABLE `memberTeam` (  
  `id` int unsigned auto_increment,
  `memberId` int unsigned not null default 0,
  `teamId` int unsigned not null default 0,
  PRIMARY KEY  (`id`)
);

CREATE TABLE `report` (  
  `id` int unsigned auto_increment,
  `hostId` int unsigned not null default 0, --举报人
  `memberId` int unsigned not null default 0, --举报用户
  `updatesId` int unsigned not null default 0, --举报信息
  `teamId` int unsigned not null default 0, --举报群
  `text` char not null default "", -- 举报原因
  `type` varchar(10) not null DEFAULT '', -- "member","updates","team"
  `time` datetime not null default NOW()
  PRIMARY KEY  (`id`)
);

CREATE TABLE `invites` (  
  `id` int unsigned auto_increment,
  `hostId` int unsigned not null default 0, --邀请人
  `memberId` int unsigned not null default 0, --被邀请人
  `teamId` int unsigned not null default 0, 
  `time` datetime not null default NOW(),
  `status` tinyint(1) unsigned not null DEFAULT 0 COMMENT '//0:未读,1:已通过',
  PRIMARY KEY  (`id`)
);

-- CREATE TABLE `memberOrganizations` (  
--   `id` int unsigned auto_increment,
--   `memberId` int unsigned not null default 0,
--   `organizationsId` int unsigned not null default 0,
--   PRIMARY KEY  (`id`)
-- );


-- CREATE TABLE `organizationsRequest` (  
--   `id` int unsigned auto_increment,
--   `memberId` int unsigned not null default 0,
--   `organizationsId` int unsigned not null default 0,
--   `createdAt` datetime not null DEFAULT now() COMMENT '//',
--   `verified` varchar(300) not null default '',
--   `status` tinyint(1) unsigned not null DEFAULT 0 COMMENT '//0:未读,1:已通过',
--   PRIMARY KEY  (`id`)
-- );


-- CREATE TABLE `article`(  
--   `id` int unsigned auto_increment,
--   `organizationsId` int unsigned not null default 0,
--   `memberId` int unsigned not null default 0,
--   `updateId` int unsigned not null default 0,
--   `title` varchar(50) not null DEFAULT '' COMMENT '//标题',
--   -- `content` text not null,
--   `type` tinyint(1) unsigned not null DEFAULT 0 COMMENT '//0:普通,1:活动,2:公告,3:咨询',
--   -- `attachedImgs` varchar(300) not null default '',
--   `createdAt` datetime not null DEFAULT now() COMMENT '//',
--   `updatedAt` datetime not null DEFAULT now() COMMENT '//',
--   PRIMARY KEY  (`id`)
-- );


CREATE TABLE `comments` (  
  `id` int unsigned auto_increment,
  `updatesId` int unsigned not null default 0,
  `memberId` int unsigned not null default 0,
  `comment` varchar(1000) not null default '',
  `status` tinyint(1) unsigned not null DEFAULT 0 COMMENT '//0:未读,1:已读',
  `createdAt` datetime not null DEFAULT now() COMMENT '//',
  PRIMARY KEY  (`id`)
);

-- CREATE TABLE `commentNotice` (  
--   `id` int unsigned auto_increment,
--   `memberId` int unsigned not null default 0,
--   `commentsId` varchar(1000) not null default '',
--   `status` tinyint(1) unsigned not null DEFAULT 0 COMMENT '//0:未读,1:已读',
--   `createdAt` datetime not null DEFAULT now() COMMENT '//',
--   PRIMARY KEY  (`id`)
-- );

-- CREATE TABLE `likeNotice` (  
--   `id` int unsigned auto_increment,
--   `memberId` int unsigned not null default 0,
--   `updatesId` varchar(1000) not null default '',
--   `status` tinyint(1) unsigned not null DEFAULT 0 COMMENT '//0:未读,1:已读',
--   `createdAt` datetime not null DEFAULT now() COMMENT '//',
--   PRIMARY KEY  (`id`)
-- );

-- CREATE TABLE `focusNotice` (  
--   `id` int unsigned auto_increment,
--   `memberId` int unsigned not null default 0,
--   `updatesId` varchar(1000) not null default '',
--   `status` tinyint(1) unsigned not null DEFAULT 0 COMMENT '//0:未读,1:已读',
--   `createdAt` datetime not null DEFAULT now() COMMENT '//',
--   PRIMARY KEY  (`id`)
-- );
 
CREATE TABLE `reReply` (  
  `id` int unsigned auto_increment,
  `replyTo` int unsigned not null default 0 COMMENT '//回复那条消息的',
  `commentsId` int unsigned not null default 0 COMMENT '//回复内容',
  `status` tinyint(1) unsigned not null DEFAULT 0 COMMENT '//0:未读,1:已读',
  PRIMARY KEY  (`id`)
);

CREATE TABLE `message` (  
  `id` int unsigned auto_increment,
  `fromMember` int unsigned not null default 0,
  `toMember` int unsigned not null default 0,
  -- `type` char(1) not null default 0,
  `type` varchar(10) not null DEFAULT '',
  `active` char(1) not null default 0,
  `text` varchar(300) not null default '',
  `time` datetime not null default NOW(),
  PRIMARY KEY  (`id`)
);

CREATE TABLE `groupmessage` (  
  `id` int unsigned auto_increment,
  `fromMember` int unsigned not null default 0,
  `teamId` int unsigned not null default 0,
  `text` varchar(1000) not null default '',
  `time` datetime not null default NOW(),
  PRIMARY KEY  (`id`)
);

