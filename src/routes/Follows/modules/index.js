import axios from 'axios'

export function getFollows(id,limit){
	return axios.get(`/public/getFollows?id=${id}&limit=${limit}`)
}

export function getFans(id,limit){
	return axios.get(`/public/getFans?id=${id}&limit=${limit}`)
}

export function followOne(id) {
	return axios.get('/member/followOne?id='+id)
}

export function followOutOne(id) {
	return axios.get('/member/followOutOne?id='+id)
}
