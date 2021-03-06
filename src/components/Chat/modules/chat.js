import axios from 'axios'

// ------------------------------------
// Constants
// ------------------------------------
const CHAT = 'CHAT'
const CHAT_HIDE = 'CHAT_HIDE'

// ------------------------------------
// Actions
// ------------------------------------

export function chatShowAction(text) {
  // console.log(text)
  return (dispatch, getState) => {
      dispatch({type:CHAT,value:text})
  }
}
export function chatHide() {
  return (dispatch, getState) => {
      dispatch({type:CHAT_HIDE})
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [CHAT]: (state, action) => {
    return ({...state, isShow:true, chatTo:action.value.chatTo,chatFrom:action.value.chatFrom,sendTo:action.value.sendTo})
  },
  [CHAT_HIDE]: (state, action) => {
    return ({...state, isShow:false, chatTo:'',chatFrom:'',sendTo:''})
  }
}

// <Chat chatTo={this.state.chatTo} sendFrom = {this.props.auth.nickname} sendTo={this.state.sendTo} />

// ------------------------------------
// Reducer
// ------------------------------------
export const initialState = {
  isShow:false,
  chatTo:'',
  chatFrom:'',
  sendTo:''
}

export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}

//otherMethods
export function submitText(fd){
    return axios.post('/message',fd)
}



export function getHistory(data){
    return axios.get(`/message?chatWith=${data.chatWith}&lastUpdate=${data.lastUpdate}`)
}
