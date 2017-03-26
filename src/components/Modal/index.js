import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom';
import {connect} from 'react-redux'
import * as actions from './modules/modal'
import './Modal.scss'

const hide = actions.modalHide

@connect(
  state=>({modalStatus:state.modal}),
{hide})
export default class Modal extends Component{

  componentWillMount =()=>{

  }

  componentDidMount =(e)=>{

  }

  componentWillReceiveProps =(nextProps)=>{
    // console.log(nextProps.modalStatus)
  }

  shouldComponentUpdate =(nextProps,nextState)=>{
    if (nextProps.modalStatus.isShow) {
      this.showModal();
    }else{
      this.hideModal();
    }
      return true
  }

  componentDidUpdate =()=>{
      var ele = findDOMNode(this)
      var element = ele.getElementsByClassName("content")[0];
      var height = window.getComputedStyle(element,null).height.slice(0,-2)
      var width = window.getComputedStyle(element,null).width.slice(0,-2)
      var scrollTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop
      ele.style.height = document.body.scrollHeight + scrollTop + 'px';
      element.style.top = scrollTop + ((document.body.clientHeight - height)/2)+'px'
      element.style.left = (document.body.clientWidth - width)/2 + 'px'
  }

  showModal =()=>{
    findDOMNode(this).style.display = "block"
    document.body.style.width = parseInt(window.getComputedStyle(document.body,null).width.slice(0,-2)) + 'px'//防止滚动条消失的闪烁
    document.body.style.overflow = "hidden"
  }

  hideModal =()=>{
    findDOMNode(this).style.display = "none"
    document.body.style.width = 'auto'   //在打开modal之后，关闭了modal，得改为自动，网页才会自动调整大小
    document.body.style.overflow = "auto"
  }

  static propTypes = {
    // header:React.PropTypes.string.isRequired,
    // content:React.PropTypes.element.isRequired,
    // submit:React.PropTypes.func.isRequired,
  }

  render(){
    const{header,content,submit} = this.props.modalStatus;
    return(
        <div className='modal'>
          <div className="content">
            <div className="content-header">
              <div className="close" onClick={()=>this.props.hide()}><div>×</div></div>
              <h2>{header}</h2>
            </div>
            <div className="content-body">
                  {content}
            </div>
            <div className="content-footer">
              <button className="btn-primary" onClick={submit}>提交</button>
            </div>
          </div>
        </div>
      )
  }
}

export const modalShow = actions.modalShow
export const modalHide = actions.modalHide
export const modalUpdate = actions.modalUpdate
