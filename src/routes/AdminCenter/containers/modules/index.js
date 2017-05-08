import axios from 'axios'
import {tipResult} from '../../../../components/Tips/modules/tips'

// export function countMessage(){
// 	return axios.get('/member/countMessage')
// }
// export function countNotice(){
// 	return axios.get('/member/countNotice')
// }
// export function countReply(){
// 	return axios.get('/member/countReply')
// }

const COUNTMESSAGE = 'COUNTMESSAGE'
const COUNTNOTICE = 'COUNTNOTICE'
const COUNTREPLY = 'COUNTREPLY'
const COUNTREQUEST = 'COUNTREQUEST'
// const CLEAR_LOGIN = 'CLEAR_LOGIN'

// ------------------------------------
// Actions
// ------------------------------------


export function countMessage() {
  return (dispatch, getState) => {
    axios.get('/member/countMessage').then(({data}) => {
      if (data.status == 200) {
        dispatch({type:COUNTMESSAGE,value:data.data});
      } else{
        dispatch(tipResult({type:"error",msg:data.msg}))
      }
    })
  }
}


export function countNotice() {
  return (dispatch, getState) => {
    axios.get('/member/countNotice').then(({data}) => {
      if (data.status == 200) {
        dispatch({type:COUNTNOTICE,value:data.data});
      } else{
        dispatch(tipResult({type:"error",msg:data.msg}))
      }
    })
  }
}


export function countReply() {
  return (dispatch, getState) => {
    axios.get('/member/countReply').then(({data}) => {
      if (data.status == 200) {
        dispatch({type:COUNTREPLY,value:data.data});
      } else{
        dispatch(tipResult({type:"error",msg:data.msg}))
      }
    })
  }
}

export function countRequest() {
  return (dispatch, getState) => {
    axios.get('/member/countRequest').then(({data}) => {
      if (data.status == 200) {
        dispatch({type:COUNTREQUEST,value:data.data});
      } else{
        dispatch(tipResult({type:"error",msg:data.msg}))
      }
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



