import io from 'socket.io-client'

var socket = io();

export function initSocket(id){
	socket.emit('setName',id)
}

export default socket
