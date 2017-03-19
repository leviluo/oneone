
// ------------------------------------
// Constants
// ------------------------------------
const MODAL_SHOW = 'MODAL_SHOW'
const MODAL_HIDE = 'MODAL_HIDE'
const MODAL_MODIFY = 'MODAL_MODIFY'

// ------------------------------------
// Actions
// ------------------------------------

export function modalShow(text) {
  return (dispatch, getState) => {
      dispatch({type:MODAL_SHOW,text:text})
  }
}

export function modalHide() {
  return (dispatch, getState) => {
      dispatch({type:MODAL_HIDE})
  }
}

export function modalUpdate(content) {
  return (dispatch, getState) => {
      dispatch({type:MODAL_MODIFY,content:content})
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [MODAL_SHOW]: (state, action) => {
    return ({...state, isShow:true,header:action.text.header,content:action.text.content,submit:action.text.submit})
  },
  [MODAL_HIDE]: (state, action) => {
    return ({...state, isShow:false,header:'',content:'',submit:null})
  },
  [MODAL_MODIFY]: (state, action) => {
    return ({...state, content:action.content})
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
export const initialState = {
  isShow:false,
  header:'',
  content:'',
  submit:null
}

export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
