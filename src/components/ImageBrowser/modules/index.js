
import axios from 'axios'

export function ifliked(name){
  return axios.get(`/member/ifliked?name=${name}`)
}

// ------------------------------------
// Constants
// ------------------------------------
const IMGBROWSER_SHOW = 'IMGBROWSER_SHOW'
// const IFLIKED = 'IFLIKED'

// ------------------------------------
// Actions
// ------------------------------------

export function imgbrowser(text) {
  return (dispatch, getState) => {
      dispatch({type:IMGBROWSER_SHOW,text:text})
  }
}

// export function imgLiked(text) {
//   return (dispatch, getState) => {
//       dispatch({type:IFLIKED,text:text})
//   }
// }

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [IMGBROWSER_SHOW]: (state, action) => {
    return ({...state, isShow:true,currentChoose:action.text.currentChoose,imgs:action.text.imgs,likeFunc:action.text.likeFunc})
  }
  // [IFLIKED]: (state, action) => {
  //   return ({...state, isliked:action.text.isliked})
  // }
}

// ------------------------------------
// Reducer
// ------------------------------------
export const initialState = {
  isShow:false,
  currentChoose:0,
  imgs:[],
  likeFunc:null,
  ifliked:null,
  isliked:0
}

export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
