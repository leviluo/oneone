
// ------------------------------------
// Constants
// ------------------------------------
const TIP_RESULT = 'TIP_RESULT'
// const TIP_SHOW = 'TIP_SHOW'

// ------------------------------------
// Actions
// ------------------------------------

export const tipResult = (value) => ({
  type: TIP_RESULT,
  payload: value,
})


export function tipShow (text) {
  return (dispatch, getState) => {
      dispatch(tipResult(text))
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [TIP_RESULT]: (state, action) => {
    return ({...state, text: action.payload})
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
export const initialState = {
  text: {
    type:"",
    msg:""
  }
}

export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
