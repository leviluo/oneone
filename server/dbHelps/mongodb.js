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

export function find(data,condition){
	return new Promise((reslove,reject)=>{
		data.find(condition, function(err, docs) {
			if (err) reject(err);
            reslove(docs)
		})
	})
}