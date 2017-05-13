import axios from 'axios'

export function getupdates(limit,id,type){ 
	if (type=="follow") {
		return axios.get(`/member/getupdates?limit=${limit}`)
	}else if (type=="my") {
		return axios.get(`/public/getMyUpdates?id=${id}&limit=${limit}`)
	}
}

export function addLike(name){
	return axios.get(`/member/addLikeByName?name=${name}`)
}


