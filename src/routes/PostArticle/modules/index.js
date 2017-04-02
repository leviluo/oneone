import axios from 'axios'

export function submitArticle(fd) {
    return axios.post('/organizations/submitArticle',fd)
}

export function getArticle(id) {
	console.log(id)
      return axios.get('/organizations/article?id='+id)
}