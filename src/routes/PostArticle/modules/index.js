import axios from 'axios'

export function submitArticle(fd) {
    return axios.post('/organizations/submitArticle',fd)
}

export function getArticle(id) {
      return axios.get('/organizations/article?id='+id)
}