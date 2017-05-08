import axios from 'axios'

export function getCatelogues(){
	return axios.get('/specialities')
}

export function addNewItem(items){
	return axios.post('/specialities',items)
}

export function modifyItem(items){
	return axios.put('/specialities',items)
}

export function deleteItem(id,type){
	return axios.delete(`/specialities?id=${id}&type=${type}`)
}

// axios.get('/public/catelogues').then(({data}) => {
     
// })

