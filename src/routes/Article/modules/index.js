import axios from 'axios'

// 基本信息
export function getArticle(id) {
      return axios.get('/organizations/article?id='+id)
}

export function submitReply(text) {
      return axios.post('/organizations/reply',text)
}

export function getArticleReply(id) {
      return axios.get('/organizations/ArticleReply?id='+id)
}

export function deleteReply(id) {
      return axios.get('/organizations/deleteReply?id='+id)
}

export function deleteArticle(id) {
      return axios.get('/organizations/deleteArticle?id='+id)
}