import axios from 'axios'


export function getrequestData(id,limit){
	return axios.get(`/organizations/getrequestData?id=${id}&limit=${limit}`)
}

export function isApprove(flag,id){
	return axios.get(`/organizations/isApprove?flag=${flag}&id=${id}`)
}

