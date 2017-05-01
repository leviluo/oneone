import mongoose from 'mongoose'
import {mongodbOp} from '../config/dbconfig'

export default function(){
	mongoose.Promise = global.Promise;
	var db = mongoose.connect(mongodbOp.mongodb)
	console.log("启动mongo")
	require("../models/message")
	return db; 
}

export function save(obj,items){
	var model = mongoose.model(obj);
	var data = new model(items);
	return new Promise((reslove,reject)=>{
		data.save(function(err, docs) {
            if (err) reject(err);
            reslove(docs)
        })
	})
}

export function findOne(data,condition){
	var model = mongoose.model(data);
	return new Promise((reslove,reject)=>{
		model.findOne(condition, function(err, docs) {
			if (err) reject(err);
            reslove(docs)
		})
	})
}

export function findLimit(data,condition,options){
	var options = options ? options : {}
	var model = mongoose.model(data);
	return new Promise((reslove,reject)=>{
		model.find(condition).sort(options.sort?options.sort:{'_id':1}).skip(options.p?(options.p-1)*options.limit:0).limit(options.limit?options.limit:10).exec(function(err,docs){
			if (err) reject(err);
            reslove(docs)
		})
	})
}

export function find(data,condition){
	var options = options ? options : {}
	var model = mongoose.model(data);
	return new Promise((reslove,reject)=>{
		model.find(condition).exec(function(err,docs){
			if (err) reject(err);
            reslove(docs)
		})
	})
}

export function remove(data,condition){
	var model = mongoose.model(data);
	return new Promise((reslove,reject)=>{
		model.remove(condition,function(err,docs){
			if (err) reject(err);
            reslove(docs)
		})
	})
}

export function update(data,condition,update,options){
	var options = options ? options : {}
	var model = mongoose.model(data);
	return new Promise((reslove,reject)=>{
		model.update(condition, update, options,function(err, docs) {
			if (err) reject(err);
            reslove(docs)
		})
	})
}

export function aggregate(data,options){
	var options = options ? options : {}
	var model = mongoose.model(data);
	return new Promise((reslove,reject)=>{
		model.aggregate([{$group:options}]).exec(function(err, docs) {
			if (err) reject(err);
            reslove(docs)
		})
	})
}
