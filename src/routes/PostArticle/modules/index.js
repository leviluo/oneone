import axios from 'axios'

export function submitArticle(fd) {
    return axios.post('/organizations/submitArticle',fd)
}