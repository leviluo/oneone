import axios from 'axios'
// ------------------------------------
// Constants
// ------------------------------------

const COUNTMESSAGE = 'COUNTMESSAGE'
const COUNTNOTICE = 'COUNTNOTICE'
const COUNTREPLY = 'COUNTREPLY'
const COUNTREQUEST = 'COUNTREQUEST'

// ------------------------------------
// Actions
// ------------------------------------

// export function modalShow(text) {
//   return (dispatch, getState) => {
//       dispatch({type:MODAL_SHOW,text:text})
//   }
// }

// export function modalHide() {
//   return (dispatch, getState) => {
//       dispatch({type:MODAL_HIDE})
//   }
// }

// export function modalUpdate(content) {
//   return (dispatch, getState) => {
//       dispatch({type:MODAL_MODIFY,content:content})
//   }
// }

export function updateNotice() {
  return (dispatch, getState) => {
    return axios.put('/notices').then(({data}) => {
      // if (data.status == 200) {
      //     dispatch(authIn(data.nickname,data.memberId));
      //     history.push('/memberCenter')
      // }else{
      //     dispatch(tipResult({type:"error",msg:data.msg}))
      // }
      return data
    })
  }
}

export function fetchNotice() {
  return (dispatch, getState) => {
    return axios.get('/notices?type=noread').then(({data}) => {
      // if (data.status == 200) {
      //     dispatch(authIn(data.nickname,data.memberId));
      //     history.push('/memberCenter')
      // }else{
      //     dispatch(tipResult({type:"error",msg:data.msg}))
      // }
      return data
    })
  }
}

export function fetchMessage() {
  return (dispatch, getState) => {
    return axios.get('/messages').then(({data}) => {
      // if (data.status == 200) {
      //     dispatch(authIn(data.nickname,data.memberId));
      //     history.push('/memberCenter')
      // }else{
      //     dispatch(tipResult({type:"error",msg:data.msg}))
      // }
      return data
    })
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [COUNTMESSAGE]:(state,action)=>{
    return({...state,isloaded:true,countMessage:action.value})
  },
  [COUNTNOTICE]:(state,action)=>{
    return({...state,isloaded:true,countNotice:action.value})
  },
  [COUNTREPLY]:(state,action)=>{
    return({...state,isloaded:true,countReply:action.value})
  },
  [COUNTREQUEST]:(state,action)=>{
    return({...state,isloaded:true,countRequest:action.value})
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
//var isAuth = localStorage.getItem('token') ? true : false
//console.log(isAuth)
export const initialState = {
  countMessage:0,
  countNotice:0,
  countReply:0,
  countRequest:0,
  isloaded:false
}
export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
