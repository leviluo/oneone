import axios from 'axios'
// ------------------------------------
// Constants
// ------------------------------------

const MESSAGEREQUEST = 'MESSAGEREQUEST'
const NOTICEREQUEST = 'NOTICEREQUEST'
const ADDMESSAGE = 'ADDMESSAGE'
const ADDNOTICE = 'ADDNOTICE'
const COUNTREQUEST = 'COUNTREQUEST'
const COUNTMESSAGE = 'COUNTMESSAGE'
// const COUNTREPLY = 'COUNTREPLY'
// const COUNTREQUEST = 'COUNTREQUEST'

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

export function fetchNotice() {
  return (dispatch, getState) => {
    if (getState().message.noticefetching) {
      return
    }
    dispatch({type:NOTICEREQUEST})
    return axios.get('/notices?type=noread').then(({data}) => {
      // if (data.status == 200) {
      //     dispatch(authIn(data.nickname,data.memberId));
      //     history.push('/memberCenter')
      // }else{
      //     dispatch(tipResult({type:"error",msg:data.msg}))
      // }
      dispatch({type:COUNTREQUEST,value:data.data})
      // return data
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
      // if (data.status == 200) {
      //     dispatch(authIn(data.nickname,data.memberId));
      //     history.push('/memberCenter')
      // }else{
      //     dispatch(tipResult({type:"error",msg:data.msg}))
      // }
      dispatch({type:COUNTMESSAGE,value:data.data})
      // return data
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
