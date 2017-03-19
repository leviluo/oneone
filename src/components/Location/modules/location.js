import axios from 'axios'
require('es6-promise').polyfill();
import fetchJsonp from 'fetch-jsonp'

const RECEIVE_LOCATION = 'RECEIVE_LOCATION'
const REQUEST_LOCATION = 'REQUEST_LOCATION'

function requestLocation () {
  return {
    type: REQUEST_LOCATION
  }
}

let avaliableId = 0
export const receiveLocation = (value) => ({
  type: RECEIVE_LOCATION,
  payload: value
})

export function fetchLocation () {
  return (dispatch, getState) => {
    if (getState().mylocation.fetching) return
      dispatch(requestLocation())
    fetchJsonp('http://api.map.baidu.com/location/ip?ak=W6TiQkinV02e8UGbIPFqEZMzwWB3e797&callback=JSON_CALLBACK&coor=bd09ll').then(function(response) {
    return response.json()
    }).then(function(data) {
      dispatch(receiveLocation(data.content.address))
    }).catch(function(ex) {
      console.log('parsing failed', ex)
    })
  }
}
export function modifyLocation(city) {
  return (dispatch, getState) => {
      dispatch(receiveLocation(city))
  }
}


// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUEST_LOCATION]: (state) => {
    return ({...state, fetching: true})
  },
  [RECEIVE_LOCATION]: (state, action) => {
    return ({...state, fetching: false, text:[action.payload],isloaded:true})
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
export const initialState = {
  fetching: false,
  text:[],
  isloaded:false
}
export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
