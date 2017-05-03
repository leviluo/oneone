
// ------------------------------------
// Constants
// ------------------------------------
const LOADING_SHOW = 'LOADING_SHOW'
const LOADING_HIDE = 'LOADING_HIDE'


export function loadingShow(text) {
  return (dispatch, getState) => {
      dispatch({type:LOADING_SHOW})
  }
}

export function loadingHide() {
  return (dispatch, getState) => {
      dispatch({type:LOADING_HIDE})
  }
}


// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [LOADING_SHOW]: (state, action) => {
    return ({...state, isShow:true})
  },
  [LOADING_HIDE]: (state, action) => {
    return ({...state, isShow:false})
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
export const initialState = {
  isShow:false,
}

export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
