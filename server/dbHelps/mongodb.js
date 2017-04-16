import mongoose from 'mongoose'
import {mongodbOp} from '../config/dbconfig'

export default function(){
	mongoose.Promise = global.Promise;
	var db = mongoose.connect(mongodbOp.mongodb)
	console.log("启动mongo")
	require("../models/message")
	return db; 
}

export function save(data){
	return new Promise((reslove,reject)=>{
		data.save(function(err, docs) {
            if (err) reject(err);
            reslove(docs)
        })
	})
}

export function findOne(data,condition){
	return new Promise((reslove,reject)=>{
		data.findOne(condition, function(err, docs) {
			if (err) reject(err);
            reslove(docs)
		})
	})
}

export function findLimit(data,condition,options){
	var options = options ? options : {}
	return new Promise((reslove,reject)=>{
		data.find(condition).sort(options.sort?options.sort:{'_id':1}).skip(options.p?(options.p-1)*options.limit:0).limit(options.limit?options.limit:10).exec(function(err,docs){
			if (err) reject(err);
            reslove(docs)
		})
	})
}

export function find(data,condition){
	var options = options ? options : {}
	return new Promise((reslove,reject)=>{
		data.find(condition).exec(function(err,docs){
			if (err) reject(err);
            reslove(docs)
		})
	})
}

export function remove(data,condition){
	return new Promise((reslove,reject)=>{
		console.log(condition)
		data.remove(condition,function(err,docs){
			if (err) reject(err);
            reslove(docs)
		})
	})
}

export function update(data,condition,update,options){
	var options = options ? options : {}
	return new Promise((reslove,reject)=>{
		data.update(condition, update, options,function(err, docs) {
			if (err) reject(err);
            reslove(docs)
		})
	})
}

// db.notices.aggregate([{$group:{_id:"$hostId",total:{$sum:1}}}])

export function aggregate(data,options){
	var options = options ? options : {}
	return new Promise((reslove,reject)=>{
		data.aggregate([{$group:options}]).exec(function(err, docs) {
			if (err) reject(err);
            reslove(docs)
		})
	})
}
