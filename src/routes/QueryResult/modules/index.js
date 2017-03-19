import axios from 'axios'

export function query(items) {
    return axios.get(`/public/query?type=${items.type}&queryStr=${items.queryStr}&limit=${items.limit}`)
}