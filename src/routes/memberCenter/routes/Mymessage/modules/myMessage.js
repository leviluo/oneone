import axios from 'axios'

export function messageList(limit){
	return axios.get(`/recentmessage?limit=${limit}`)
}

export function getHistory(data){
    return axios.get(`/message?chatWith=${data.chatWith}&lastUpdate=${data.lastUpdate}`)
}

//otherMethods
export function submitText(fd){
    return axios.post('/message',fd)
}

export function getReplyMe(limit){
	return axios.get('/organizations/getReplyMe?limit='+limit)
}

export function getcommentData(limit){
	return axios.get('/commentsme?limit='+limit)
}

export function getrequestData(limit){
	return axios.get('/requestorganizations?limit='+limit)
}

export function submitReply(text) {
      return axios.post('/organizations/reply',text)
}

export function isApprove(flag,id){
	return axios.get(`/organizations/isApprove?flag=${flag}&id=${id}`)
}
