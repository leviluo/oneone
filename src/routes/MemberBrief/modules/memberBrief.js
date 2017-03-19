import axios from 'axios'

export function getSpecialities(id) {
	return axios.get('/public/specialities?id='+id)
}

export function memberInfo(id) {
	return axios.get('/public/memberInfo?id='+id)
}

export function followOne(id) {
	return axios.get('/member/followOne?id='+id)
}

export function followOutOne(id) {
	return axios.get('/member/followOutOne?id='+id)
}

export function getMyUpdates(id,limit){
	return axios.get(`/public/getMyUpdates?id=${id}&limit=${limit}`)
}

export function addLike(name){
	return axios.get(`/member/addLikeByName?name=${name}`)
}
