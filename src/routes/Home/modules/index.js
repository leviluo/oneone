import axios from 'axios'

export function getupdates(limit,location){ 
	return axios.get(`/photoUpdates?limit=${limit}`)
}

export function addLike(name){
	return axios.get(`/member/addLikeByName?name=${name}`)
}

