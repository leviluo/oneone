import axios from 'axios'

export function messageList(limit){
	return axios.get(`/recentmessage?limit=${limit}`)
}