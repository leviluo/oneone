//socket io module
import socketIo from 'socket.io';
import { sqlStr } from '../dbHelps/mysql'
import {find,update,remove} from '../dbHelps/mongodb'

async function getTeams(id){
	var ss = await sqlStr("select t.id from team as t left join memberTeam as tm on tm.teamId = t.id where tm.memberId = ?",[id])
	return ss
}

async function sendNoRead(id,socket){
	var msgs = await find("msg",{hostId:id})
	for(var key in msgs){
		socket.emit("notice",msgs[key])
	}
	var notices = await find("notice",{hostId:id})
	for(var key in notices){
		socket.emit("notice",notices[key])
	}
	await remove("msg",{hostId:id})
	await remove("notice",{hostId:id})
}

// create a new ojbect chat
var chat = {};

//chat property
// io object
chat.io = false;
//user name
chat.userName = {};
//name has been used
chat.usedName = [];
//user number
chat.userNum = 0;
//current room name
chat.currentRoom = {};

chat.onlines = {}

chat.rooms = {}

//room list
chat.roomList = ['Lobby'];

//chat initialization with the passing http object
chat.initialize = function(http) {
	this.io = socketIo(http);
	this.ioListen();
}

// major socket listening method
chat.ioListen = function() {
	
	var that = this;

	this.io.on('connection', function(socket){

		// socket.manager.transports[socket.id].socket.setTimeout(3000);

		// that.assignRoom(socket);

		// socket.on('change room', function(msg){

		// 	that.changeRoom(socket, msg);

		// });

		// that.sysMsg(socket);

		console.log("socket connection")

		that.userMsg(socket);


		// that.changeName(socket);

		that.disconnect(socket);

	});

}

// send user message
chat.userMsg = function(socket) {

	var that = this;

	// socket.on('chat message', function(msg){
	// 	msg = that.userName[socket.id] + ' said: ' + msg;
	// 	that.io.to(that.currentRoom[socket.id]).emit('chat message', msg);
	// });

	socket.on('setName',function (data) {
		sendNoRead(data,socket)
        that.onlines[data] = socket
        socket.name = data
		getTeams(data).then(res=>{
			// console.log(res)
			for (var i = 0; i < res.length; i++) {
				let id = res[i].id
				socket.join(id, function(){
					console.log("加入群聊成功")
					if(that.rooms[id]){
						that.rooms[id].push(data)
					}else{
						that.rooms[id] = [data]
					}
				})
			}
		})

    });

}

//send system message
chat.sysMsg = function(socket) {

	var that = this;

	socket.on('sys message', function(msg){
		that.io.to(that.currentRoom[socket.id]).emit('sys message', msg);
	});	
	
}

//assign a guest name to new joining user
chat.assignGuestName = function(socket) {

	this.userName[socket.id] = 'Guest' + this.userNum;
	this.usedName.push('Guest' + this.userNum);
	this.userNum++;

	var msg = this.userName[socket.id] + ' enter the room! Welcome!';

	this.io.to(this.currentRoom[socket.id]).emit('new user', msg);

}
// 成员离开组
chat.leaveGroup = function(memberId,id){
	this.onlines[memberId].leave(id, function(){
		console.log(memberId,"自动离开房间")
	})
	for (var i = 0; i < this.rooms[id].length; i++) {
		if(this.rooms[id][i] == memberId){
			this.rooms[id].splice(i,1)
			console.log(memberId,"从群删除")
			return
		}
	}
}
// 解散组
chat.deleteGroup = function(id){
	var that = this
	this.rooms[id].forEach(item => {
		that.onlines[item].leave(id, function(){
			console.log(item,"离开房间")
		})
	})
	this.rooms[id] = []
}

//disconnection
chat.disconnect = function(socket) {

	var that = this;

	socket.on('disconnect', function(){
		console.log("chat 断开链接了")

		delete that.onlines[socket.name]

		goto:for(var key in that.rooms){
			for (var i = 0; i < that.rooms[key].length; i++) {
				if(that.rooms[key][i] == socket.name){
					that.rooms[key].splice(i,1)
					socket.leave(key, function(){
						console.log("自动离开房间")
					})
					continue goto
				}
			}
		}

		console.log(that.rooms)
		// var msg = that.userName[socket.id] + ' just left';

		// that.io.emit('exit user', msg);

		// var nameIndex = that.usedName.indexOf(that.userName[socket.id]);

		// delete that.userName[socket.id];
		// delete that.usedName[nameIndex];   

		// socket.leave(that.currentRoom[socket.id]);

		// delete that.currentRoom[socket.id]; 
	});

}

//change user name
chat.changeName = function(socket) {

	var that = this;

	socket.on('change name', function(msg){
		if (that.usedName.indexOf(msg) == -1) {

			var nameIndex = that.usedName.indexOf(that.userName[socket.id]);
			that.userName[socket.id] = msg;
			that.usedName[nameIndex] = msg;
			socket.emit('sys message', 'Your name has been changed as ' + msg);
		}
		else {
			socket.emit('sys message', 'Your name has been used');
		}

	});
}

//assign room 'Lobby' once they enter
chat.assignRoom = function(socket) {
	
	var that = this;

	socket.on('joinGroup', function(id){
			// console.log("去哦加入房间咯")
			// console.log(id)
		socket.join(id, function(){
			// console.log("加入房间:"+id)
			// that.currentRoom[socket.id] = id;
			// that.assignGuestName(socket);
			// socket.emit('room list', that.roomList);
		});
	})

	socket.on('leaveGroup', function(id){
			// console.log("去哦加入房间咯")
			// console.log(id)
		socket.leave(id, function(){
			// console.log("离开房间:"+id)
			// that.currentRoom[socket.id] = id;
			// that.assignGuestName(socket);
			// socket.emit('room list', that.roomList);
		});
	})
}

//change room
// chat.changeRoom = function(socket, msg) {

// 	var that = this;

// 	var sysMsg = that.userName[socket.id] + ' left room ' + that.currentRoom[socket.id];

// 	this.io.to(this.currentRoom[socket.id]).emit('sys message', sysMsg);

// 	if (msg != 'room') {
// 		socket.leave(this.currentRoom[socket.id], function(){

// 			var isExist = false;

// 			if (that.currentRoom[socket.id] !== 'Lobby') {

// 				for (key in that.currentRoom) {

// 					if (key == socket.id) {
// 						continue;
// 					}

// 					if (that.currentRoom[key] === that.currentRoom[socket.id]) {
// 						isExist = true;
// 						break;
// 					}
// 				}
				
// 			}
// 			else {
// 				isExist = true;
// 			}

// 			if (isExist === false) {
// 				var roomIndex = that.roomList.indexOf(that.currentRoom[socket.id]);
// 				console.log(roomIndex);
// 				that.roomList.splice(roomIndex, 1);
// 			}

// 			console.log(isExist + '-' + that.roomList);
			
// 			socket.join(msg);

// 			that.currentRoom[socket.id] = msg;

// 			sysMsg = that.userName[socket.id] + ' join room ' + that.currentRoom[socket.id];

// 			if (that.roomList.indexOf(msg) == -1) {
// 				that.roomList.push(msg);
// 				// console.log('add ' + that.roomList);
// 			}

// 			socket.emit('sys message', sysMsg);

// 			socket.emit('change room name', {'msg': msg, 'roomList': that.roomList});
			
// 			that.io.emit('room list', that.roomList);

// 		});
// 	}
// 	else {
// 		socket.emit('sys message', '无法加入房间room！');
// 	}
// }

export default chat;

export function queryid(sendTo){
    return chat.onlines[sendTo]
}