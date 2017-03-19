import axios from 'axios'

export function getupdates(limit){ 
	return axios.get(`/member/getupdates?limit=${limit}`)
}

export function addLike(name){
	return axios.get(`/member/addLikeByName?name=${name}`)
}


