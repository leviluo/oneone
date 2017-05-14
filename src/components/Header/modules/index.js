import axios from 'axios'
// ------------------------------------
// Constants
// ------------------------------------

const MESSAGEREQUEST = 'MESSAGEREQUEST'
const NOTICEREQUEST = 'NOTICEREQUEST'
const ADDMESSAGE = 'ADDMESSAGE'
const ADDNOTICE = 'ADDNOTICE'
const CLEARNOTICE = 'CLEARNOTICE'
const COUNTREQUEST = 'COUNTREQUEST'
const COUNTMESSAGE = 'COUNTMESSAGE'


export function addMessage(data) {
  return (dispatch, getState) => {
    dispatch({type:ADDMESSAGE,value:data})
  }
}

export function addNotice(data) {
  return (dispatch, getState) => {
    dispatch({type:ADDNOTICE,value:data})
  }
}

export function clearNotice(data) {
  return (dispatch, getState) => {
    dispatch({type:CLEARNOTICE})
  }
}

export function fetchNotice() {
  return (dispatch, getState) => {
    if (getState().message.noticefetching) {
      return
    }
    dispatch({type:NOTICEREQUEST})
    return axios.get('/notices?type=noread').then(({data}) => {
      dispatch({type:COUNTREQUEST,value:data.data})
    })
  }
}

export function fetchMessage() {
  return (dispatch, getState) => {
    if (getState().message.messagefetching) {
      return
    }
    dispatch({type:MESSAGEREQUEST})
    return axios.get('/messages').then(({data}) => {
      dispatch({type:COUNTMESSAGE,value:data.data})
    })
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [COUNTMESSAGE]:(state,action)=>{
    return({...state,isloaded:true,messages:action.value,messagefetching:false,messageisloaded:true})
  },
  [COUNTREQUEST]:(state,action)=>{
    return({...state,isloaded:true,notices:action.value,noticeisloaded:true,noticefetching:false})
  },
  [ADDMESSAGE]:(state,action)=>{
    return({...state,isloaded:true,messages:state.messages.concat(action.value)})
  },
  [ADDNOTICE]:(state,action)=>{
    return({...state,isloaded:true,notices:state.notices.concat(action.value)})
  },
  [CLEARNOTICE]:(state,action)=>{
    return({...state,notices:[]})
  },
  [MESSAGEREQUEST]:(state,action)=>{
    return({...state,messagefetching:true})
  },
  [NOTICEREQUEST]:(state,action)=>{
    return({...state,noticefetching:true})
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
//var isAuth = localStorage.getItem('token') ? true : false
//console.log(isAuth)
export const initialState = {
  messages:[],
  notices:[],
  noticeisloaded:false,
  messageisloaded:false,
  noticefetching:false,
  messagefetching:false
}
export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
