import axios from 'axios'

export function getworksData(id,worksId,limit,direction){
	if (direction) {
		var directions = direction
	}else{
		var directions = 0
	}
	return axios.get(`/public/getWorksFrom?id=${id}&limit=${limit}&worksId=${worksId}&direction=${directions}`)
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
