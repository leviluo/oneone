import axios from 'axios'

// ------------------------------------
// Constants
// ------------------------------------
const RECEIVE_CATEGOIES = 'RECEIVE_CATEGOIES'
// ------------------------------------
// Actions
// ------------------------------------

export const receiveCatelogue = (value) => ({
  type: RECEIVE_CATEGOIES,
  value: value,
})

export function fetchCatelogue () {
  return (dispatch, getState) => {
    axios.get('/public/catelogues').then(({data}) => {
      dispatch(receiveCatelogue(data.data))
    })
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [RECEIVE_CATEGOIES]: (state, action) => {
    return ({...state, isloaded:true,text: action.value})
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
export const initialState = {
  text: [],
  isloaded:false
}

export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
