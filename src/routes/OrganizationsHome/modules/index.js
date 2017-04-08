import axios from 'axios'

// 基本信息
export function getBasicInfo(id) {
      return axios.get('/organizations/basicInfo?id='+id)
}
// 所有会员
export function getMembers(id) {
      return axios.get('/organizations/getMembers?id='+id)
}
// 获取活动
export function getArticleList(id,type,limit) {
      return axios.get(`/organizations/getArticleList?id=${id}&limit=${limit}&type=${type}`)
}
// 获取咨询
export function getConsults() {
      return axios.get('/organizations/getConsults')
}

export function attendOrganization(item) {
      return axios.post('/organizations/attendOrganization',item)
}

export function quitOrganization(id) {
      return axios.get('/organizations/quitOrganization?id='+id)
}

export function submitText(fd){
    return axios.post('/groupmessages',fd)
}

export function getHistory(data){
    return axios.get(`/groupmessages?lastUpdate=${data.lastUpdate}&organizationsId=${data.organizationsId}`)
}

// export function modifyNickname(item) {
//       return axios.post('/member/modifyNickname',item)
// }

// export function modifyAddress(item) {
//       return axios.post('/member/modifyAddress',item)
// }




// // ------------------------------------
// // Constants
// // ------------------------------------
// const RECEIVE_SPECIALITIES = 'RECEIVE_SPECIALITIES'
// const ADD_SPECIALITIES = 'ADD_SPECIALITIES'
// // ------------------------------------
// // Actions
// // ------------------------------------

// export const receiveSpeciality = (value) => ({
//   type: RECEIVE_SPECIALITIES,
//   value: value,
// })

// export function fetchSpeciality () {
//   return (dispatch, getState) => {
//     axios.get('/member/specialities').then(({data}) => {
//       dispatch(receiveSpeciality(data.data))
//       })
//   }
// }

// export function updateSpeciality (data) {
//   return (dispatch, getState) => {
//       dispatch(receiveSpeciality(data))
//   }
// }

// // ------------------------------------
// // Action Handlers
// // ------------------------------------
// const ACTION_HANDLERS = {
//   [RECEIVE_SPECIALITIES]: (state, action) => {
//     return ({...state, text: action.value,isloaded:true})
//   },
//   [ADD_SPECIALITIES]: (state, action) => {
//     return ({...state, text: state.text.concat(action.value)})
//   }
// }

// // ------------------------------------
// // Reducer
// // ------------------------------------
// export const initialState = {
//   text: []
// }

// export default function (state = initialState, action) {
//   const handler = ACTION_HANDLERS[action.type]

//   return handler ? handler(state, action) : state
// }

