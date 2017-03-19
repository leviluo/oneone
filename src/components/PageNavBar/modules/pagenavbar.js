
// // ------------------------------------
// // Constants
// // ------------------------------------
// const PAGENAVINIT = 'PAGENAVINIT'
// const PAGENUM = 'PAGENUM'
// const PAGERESET = 'PAGERESET'

// // ------------------------------------
// // Actions
// // ------------------------------------

// export function pageNavInitiation(text) {
//   return (dispatch, getState) => {
//       dispatch({type:PAGENAVINIT,pageNums:text})
//   }
// }

// export function pageNumChange(text) {
//   return (dispatch, getState) => {
//       dispatch({type:PAGENUM,currentPage:text})
//   }
// }

// // export function pageReset(text) {
// //   return (dispatch, getState) => {
// //       dispatch({type:PAGERESET})
// //   }
// // }


// // ------------------------------------
// // Action Handlers
// // ------------------------------------
// const ACTION_HANDLERS = {
//   [PAGENAVINIT]: (state, action) => {
//     return ({...state,pageNums:action.pageNums,currentPage:1,isloaded:true})
//   },
//   [PAGENUM]: (state, action) => {
//     return ({...state,currentPage:action.currentPage})
//   },
//   [PAGERESET]: (state, action) => {
//     return ({...state,pageNums:1,currentPage:1,isloaded:false})
//   },
// }

// // ------------------------------------
// // Reducer
// // ------------------------------------
// export const initialState = {
//   pageNums:1,
//   currentPage:1,
//   isloaded:false
// }

// export default function (state = initialState, action) {
//   const handler = ACTION_HANDLERS[action.type]
//   return handler ? handler(state, action) : state
// }
