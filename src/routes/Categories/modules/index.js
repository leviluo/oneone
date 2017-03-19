import axios from 'axios'

export function fetchItems(items){
  return axios.post('/public/Items',items)
}

// // ------------------------------------
// // Constants
// // ------------------------------------
// const RECEIVE_ITEMS = 'RECEIVE_ITEMS'
// // ------------------------------------
// // Actions
// // ------------------------------------

// export const receiveItems = (value) => ({
//   type: RECEIVE_ITEMS,
//   value: value,
// })

// export function fetchItems (items) {
//   return (dispatch, getState) => {
//     axios.post('/public/Items',items).then(({data}) => {
//         dispatch({type:'PAGERESET'})   //请求数据重置reset
//         dispatch(receiveItems(data.data))
//       })
//   }
// }

// // ------------------------------------
// // Action Handlers
// // ------------------------------------
// const ACTION_HANDLERS = {
//   [RECEIVE_ITEMS]: (state, action) => {
//     return ({...state, text: action.value,isloaded:true})
//   }
// }

// // ------------------------------------
// // Reducer
// // ------------------------------------
// export const initialState = {
//   text: [],
//   isloaded:false
// }

// export default function (state = initialState, action) {
//   const handler = ACTION_HANDLERS[action.type]

//   return handler ? handler(state, action) : state
// }

