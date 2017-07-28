import axios from 'axios'

export function getworksData(id,limit){
	return axios.get(`/works?id=${id}&limit=${limit}`)
}

export function addLike(id){
	return axios.get(`/member/addLike?id=${id}`)
}

export function deletePhoto(id,name){
	return axios.get(`/member/deletePhoto?id=${id}&name=${name}`)
}

export function getMemberInfo(id){
	return axios.get(`/public/getMemberInfoWork?id=${id}`)
}
