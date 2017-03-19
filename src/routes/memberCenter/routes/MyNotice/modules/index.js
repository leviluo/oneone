import axios from 'axios'


export function getReplyMe(){
	return axios.get('/organizations/getReplyMe')
}

export function getApproveMe(){
	return axios.get('/organizations/getApproveMe')
}

