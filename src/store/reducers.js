import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import { ReduxAsyncConnect, asyncConnect, reducer as reduxAsyncConnect } from 'redux-async-connect'

// Fix: "React-Redux: Combining reducers: Unexpected Keys"
// http://stackoverflow.com/a/33678198/789076
const initialReducers = {
  mytips: (state = require('../components/Tips/modules/tips').initialState) => state,
  modal: (state = require('../components/Modal/modules/modal').initialState) => state,
  confirm: (state = require('../components/Confirm/modules').initialState) => state,
  chat: (state = require('../components/Chat/modules/chat').initialState) => state,
  imageBrowser: (state = require('../components/ImageBrowser/modules').initialState) => state,
  mylocation: (state = require('../components/Location/modules/location').initialState) => state,
  auth: (state = require('../reducers/auth').initialState) => state,
  catelogues:(state = require('../reducers/category').initialState) => state,
  pagenavbar:(state = require('../components/PageNavBar/modules').initialState) => state,
  message:(state = require('../components/Header/modules').initialState) => state,
  loading:(state = require('../components/Loading/modules').initialState) => state,
  // articleUpdates:(state = require('../routes/Organizations/modules').initialState) => state,
  myspecialities:(state = require('../routes/memberCenter/routes/BasicInfo/modules/basicInfo').initialState) => state,
  // items:(state = {text:[],isloaded:false}) => state,
}


export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    // Add sync reducers here
    reduxAsyncConnect,
    router,
    ...initialReducers,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
