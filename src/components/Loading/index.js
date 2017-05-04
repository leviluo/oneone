import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom';
import {connect} from 'react-redux'
import * as actions from './modules'
import './index.scss'
import loading from './assets/loading.gif'

// const hide = actions.loadingHide

@connect(
  state=>({status:state.loading}),
{})
export default class Loading extends Component{

	componentWillReceiveProps =(nextProps)=>{
    // if (nextProps.status.isShow) {
    //     ele.style.display = "block"
    //     document.body.style.width = parseInt(window.getComputedStyle(document.body,null).width.slice(0,-2)) + 'px'//防止滚动条消失的闪烁
    //     document.body.style.overflow = "hidden"
    // }else{
    //   ele.style.display = "none"
    //   document.body.style.width = 'auto'   //在打开modal之后，关闭了modal，得改为自动，网页才会自动调整大小
    //   document.body.style.overflow = "auto"
    // }
  }

  componentDidUpdate = ()=>{
		var ele = findDOMNode(this)

    if (this.props.status.isShow) {
        document.body.style.width = parseInt(window.getComputedStyle(document.body,null).width.slice(0,-2)) + 'px'//防止滚动条消失的闪烁

        var scrollTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop
        ele.style.top = scrollTop + 'px';

        document.body.style.overflow = "hidden"
        ele.style.display = "block"
    }else{
        ele.style.display = "none"
        document.body.style.width = 'auto'   //在打开modal之后，关闭了modal，得改为自动，网页才会自动调整大小
        document.body.style.overflow = "auto"
    }
  }

  render(){
    // const{header,content,submit} = this.props.modalStatus;
    return(
        <div id='loading'>
          <div>
          <img src={loading} alt=""/>
          </div>
        </div>
      )
  }
}

export const loadingShow = actions.loadingShow
export const loadingHide = actions.loadingHide
