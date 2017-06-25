import axios from 'axios'
import {tipResult} from '../../../../../components/Tips/modules/tips'

const REQUESTADDSPECIALITY = "REQUESTADDSPECIALITY"
const FINISHADDSPECIALITY = "FINISHADDSPECIALITY"

export function commitHeadImg(items) {
  return (dispatch, getState) => {
    return axios.post('/member/HeadImg',items).then(({data}) => {
        return data
    })
  }
}

export function submitPhotos(fd){
  return axios.post("/member/submitPhotos",fd)
}

export function modifyBrief(fd){
  return axios.post("/member/modifyBrief",fd)
}


export function getMemberInfo() {
      return axios.get('/member/getMemberInfo')
}


export function modifyNickname(item) {
      return axios.post('/member/modifyNickname',item)
}


export function modifyAddress(item) {
      return axios.post('/member/modifyAddress',item)
}


export function modifySpeciality(items) {
      return axios.post('/member/modifySpeciality',items)
}

export function deleteSpeciality(item) {
	    return axios.post('/member/deleteSpeciality',item)
}

export function addSpeciatity (items) {
  // console.log(itens)
  return (dispatch, getState) => {
    if (getState().myspecialities.fetching) return
      dispatch({type:REQUESTADDSPECIALITY}) 
    
     return axios.post('/member/addSpeciality',items).then(data=>{
      dispatch({type:FINISHADDSPECIALITY})
      return data
     })
  }
}

// ------------------------------------
// Constants
// ------------------------------------
const RECEIVE_SPECIALITIES = 'RECEIVE_SPECIALITIES'
const ADD_SPECIALITIES = 'ADD_SPECIALITIES'
// ------------------------------------
// Actions
// ------------------------------------

export const receiveSpeciality = (value) => ({
  type: RECEIVE_SPECIALITIES,
  value: value,
})

export function fetchSpeciality () {
  return (dispatch, getState) => {
    axios.get('/public/specialities').then(({data}) => {
        if (data.status==200) {
          dispatch(receiveSpeciality(data.data))
        }else{
          dispatch(tipResult({type:"error",msg:data.msg}))
        }
      })
  }
}

export function updateSpeciality (data) {
  return (dispatch, getState) => {
      dispatch(receiveSpeciality(data))
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [RECEIVE_SPECIALITIES]: (state, action) => {
    return ({...state, text: action.value,isloaded:true})
  },
  [ADD_SPECIALITIES]: (state, action) => {
    return ({...state, text: state.text.concat(action.value)})
  },
  [REQUESTADDSPECIALITY]: (state, action) => {
    return ({...state, fetching: true })
  },
  [FINISHADDSPECIALITY]: (state, action) => {
    return ({...state, fetching: false })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
export const initialState = {
  text: [],
  fetching:false
}

export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

