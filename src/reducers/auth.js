import axios from 'axios'
import {tipResult} from '../components/Tips/modules/tips'
import {initSocket} from '../socket'
// ------------------------------------
// Constants
// ------------------------------------
const REQUEST_LOGIN = 'REQUEST_LOGIN'
const AUTHIN = 'AUTHIN'
const AUTHOUT = 'AUTHOUT'
const MODIFYNICKNAME = 'MODIFYNICKNAME'
// const CLEAR_LOGIN = 'CLEAR_LOGIN'

// ------------------------------------
// Actions
// ------------------------------------

function requestLOGIN () {
  return {
    type: REQUEST_LOGIN
  }
}


function authIn (nickname,memberId) {
  initSocket(memberId)
  return {
    type: AUTHIN,
    nickname: nickname,
    memberId:memberId,
  }
}

function authOut () {
  return {
    type: AUTHOUT
  }
}

export function isAuth(history) {
  return (dispatch, getState) => {
    axios.get('/auth').then(({data}) => {
      if (data.status == 200) {
        // localStorage.setItem("nickname",data.nickname)
        dispatch(authIn(data.nickname,data.memberId));
      } else{
        // localStorage.setItem("nickname",data.nickname)
        if (history) {
           history.push('/login')
        }
      }
    })
  }
}


export function login(items,history) {
  return (dispatch, getState) => {
    if (getState().auth.fetching) return
    dispatch(requestLOGIN())
    axios.post('/login',items).then(({data}) => {
      if (data.status == 200) {
          // localStorage.setItem("nickname",data.nickname)
          dispatch(authIn(data.nickname,data.memberId));
          history.push('/memberCenter')
      }else{
          dispatch(tipResult({type:"error",msg:data.msg}))
      }
    })
  }
}

export function loginOut (history) {
  return (dispatch, getState) => {
    axios.get('/loginOut').then(({data}) => {
      if (data.status == 200) {
      // localStorage.removeItem("nickname")
      dispatch(authOut())
      history.push('/')
      }
    })
  }
}

export function modifyNickname (newName) {
  return (dispatch, getState) => {
      dispatch({type:MODIFYNICKNAME,nickname:newName})
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUEST_LOGIN]: (state) => {
    return ({...state, fetching: true})
  },
  [AUTHIN]:(state,action)=>{
    return({...state,isAuth: true,nickname:action.nickname,memberId:action.memberId})
  },
  [AUTHOUT]:(state)=>{
    return({...state,isAuth: false,nickname:'',memberId:''})
  },
  [MODIFYNICKNAME]:(state,action)=>{
    return({...state,nickname:action.nickname})
  },
}

// ------------------------------------
// Reducer
// ------------------------------------
//var isAuth = localStorage.getItem('token') ? true : false
//console.log(isAuth)
export const initialState = {
  fetching: false,
  isAuth: false,
  nickname:'',
  memberId:''
}
export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
