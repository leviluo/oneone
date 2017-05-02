import axios from 'axios'


// export function getReplyMe(){
// 	return axios.get('/organizations/getReplyMe')
// }

// export function getApproveMe(){
// 	return axios.get('/organizations/getApproveMe')
// }

export function fetchNotices(items) {
    return axios.get(`/notices?type=all&p=${items.p}&limit=${items.limit}`).then(({data}) => {
      return data
    })
}
