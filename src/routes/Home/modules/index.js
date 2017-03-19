import axios from 'axios'

export function getupdates(limit,location){ 
	return axios.get(`/public/getPhotoUpdates?limit=${limit}&location=${location}`)
}

export function addLike(name){
	return axios.get(`/member/addLikeByName?name=${name}`)
}

