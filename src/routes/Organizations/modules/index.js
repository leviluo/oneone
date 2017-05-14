import axios from 'axios'

export function OrganizationsSortByHot(id) {
      return axios.get('/organizations/OrganizationsSortByHot')
}

export function getUpdates(limit,location){ 
	return axios.get(`/public/getArticleUpdates?limit=${limit}`)
}

// ------------------------------------
// Constants
// ------------------------------------
// const RECEIVE_UPDATES = 'RECEIVE_UPDATES'
// const REQUEST_UPDATES = 'REQUEST_UPDATES'
// const averagenum = 2

// // ------------------------------------
// // Actions
// // ------------------------------------

// // function requestUpdates () {
// //   return {
// //     type: REQUEST_UPDATES
// //   }
// // }

// // let avaliableId = 0
// // export const receiveUpdates = (value) => ({
// //   type: RECEIVE_UPDATES,
// // })

// // export const clearUpdates = () => ({
// //   type: CLEAR_Updates
// // })

// export function fetchUpdates (limit) {
//   return (dispatch, getState) => {
//     if (getState().articleupdates.fetching || getState().articleupdates.isloaded) return
//     dispatch({type:REQUEST_UPDATES})
//     return axios.get(`/public/getArticleUpdates?limit=${limit}`)
//       .then(({data}) => {
//       	dispatch(receiveUpdates({type:RECEIVE_UPDATES,payload:data}))
//         // if(!getState().articleupdates.isloaded)dispatch({type:'PAGENUMS',payload:data.count/averagenum})
//       })
//   }
// }

// // export const actions = {
// //   requestZen,
// //   receiveZen,
// //   clearZen,
// //   fetchZen
// // }

// // ------------------------------------
// // Action Handlers
// // ------------------------------------
// const ACTION_HANDLERS = {
//   [REQUEST_UPDATES]: (state) => {
//     return ({...state, fetching: true})
//   },
//   [RECEIVE_UPDATES]: (state, action) => {
//     return ({...state, isloaded: true,fetching: false, data: action.payload})
//   }
// }

// // ------------------------------------
// // Reducer
// // ------------------------------------
// const initialState = {
//   fetching: false,
//   data: [],
//   isloaded:false
// }
// export default function (state = initialState, action) {
//   const handler = ACTION_HANDLERS[action.type]

//   return handler ? handler(state, action) : state
// }