import axios from 'axios'

export function addOrganization(fd){
	return axios.post('/organizations/addOrganization',fd)
}

export function modifyOrganization(fd){
	return axios.post('/organizations/modifyOrganization',fd)
}

export function deleteOrganization(id){
	return axios.post('/organizations/deleteOrganization',{id:id})
}

export function getOrganizationByMe(){
	return axios.get('/organizations/getOrganizationByMe')
}

export function getMyOrganization(){
	return axios.get('/organizations/getMyOrganization')
}

export function getCatelogy(){
	return axios.get('/public/getCatelogy')
}
