import axios from 'axios'

export function messageList(limit){
	return axios.get(`/recentmessage?limit=${limit}`)
}

export function getHistory(data){
    return axios.get(`/message?chatWith=${data.chatWith}&lastUpdate=${data.lastUpdate}`)
}