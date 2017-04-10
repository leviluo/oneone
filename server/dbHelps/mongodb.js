import mongoose from 'mongoose'
import {mongodbOp} from '../config/dbconfig'

export default function(){
	var db = mongoose.connect(mongodbOp.mongodb)
	console.log("启动mongo")
	require("../models/message")
	return db; 
}