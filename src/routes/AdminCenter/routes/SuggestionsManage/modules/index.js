import axios from 'axios'

export function getSuggestions(limit,p){
	return axios.get(`/suggestions?limit=${limit}&p=${p}`)
}
