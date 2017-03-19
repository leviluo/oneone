import axios from 'axios'


export function getMyPost(limit){
	return axios.get(`/organizations/getMyPost?limit=${limit}`)
}

