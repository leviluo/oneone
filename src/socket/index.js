import io from 'socket.io-client'

var socket = io();

export function initSocket(id){  //
	socket.emit('setName',id)
}

export function initGroupChat(id){  //
	socket.emit('joinGroup',id)
}

export function leaveGroupChat(id){  //
	socket.emit('leaveGroup',id)
}



export default socket
