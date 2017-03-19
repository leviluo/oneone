import axios from 'axios'

export function messageList(limit){
	return axios.get(`/member/getMessageList?limit=${limit}`)
}