import axios from 'axios'
import {tipResult} from '../../../../../components/Tips/modules/tips'

export function commitHeadImg(items,phone) {
  return (dispatch, getState) => {
    axios.post('/member/HeadImg',items).then(({data}) => {
      if (data.status==200) {
        console.log(phone)
          document.getElementById('memberinfoHeadImg').src = '/public/Headload?member='+phone+"&"+Math.random()
      }else{
          dispatch(tipResult({type:"error",msg:data.msg}))
      }
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

export function addSpeciatity (that,items) {
  return (dispatch, getState) => {
    axios.post('/member/addSpeciality',items).then(({data}) => {
      if (data.status==200) {
          that.setState({showAddSpeciality:false})
          items.id = data.result.insertId
          items.work = null
          items.memberId = that.props.auth.memberId
          dispatch({type:"ADD_SPECIALITIES",value:items})
      }else if(data.status==600){
          that.props.dispatch({type:"AUTHOUT"})
          that.context.router.push('/login')
      }
      else{
          dispatch(tipResult({type:"error",msg:data.msg}))
      }
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
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
export const initialState = {
  text: []
}

export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

