import axios from 'axios'

export function getMyOrganization(){
	return axios.get('/organizations/getMyOrganization')
}


