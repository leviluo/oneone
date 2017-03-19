
// ------------------------------------
// Constants
// ------------------------------------
const CONDIRM_SHOW = 'CONDIRM_SHOW'
const CONDIRM_HIDE = 'CONDIRM_HIDE'

// ------------------------------------
// Actions
// ------------------------------------

export function confirmShow(text) {
  return (dispatch, getState) => {
      dispatch({type:CONDIRM_SHOW,text:text})
  }
}

export function confirmHide() {
  return (dispatch, getState) => {
      dispatch({type:CONDIRM_HIDE})
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [CONDIRM_SHOW]: (state, action) => {
    return ({...state, isShow:true,submit:action.text.submit,text:action.text.text})
  },
  [CONDIRM_HIDE]: (state, action) => {
    return ({...state, isShow:false,submit:null})
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
export const initialState = {
  isShow:false,
  submit:null
}

export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
