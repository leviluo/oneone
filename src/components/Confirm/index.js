import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom';
import {connect} from 'react-redux'
import * as actions from './modules'
import './confirm.scss'

@connect(
  state=>({confirm:state.confirm}),
{})
export default class Comfirm extends Component{

  componentWillMount =()=>{

  }

  componentDidMount =(e)=>{

  }

  componentWillReceiveProps =(nextProps)=>{
    // console.log(nextProps.modalStatus)
  }

  shouldComponentUpdate =(nextProps,nextState)=>{
    if (nextProps.confirm.isShow) {
      this.showModal();
    }else{
      this.hideModal();
      return false
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

  submit = ()=>{
    this.hideModal();
    this.props.confirm.submit();
  }

  render(){
    return(
        <div className='confirm'>
          <div className="content">
            <div className="content-header">
              <div className="close" onClick={this.hideModal}><div>×</div></div>
            </div>
            <div className="content-body">
                  {this.props.confirm.text || '此操作不可更改,确定继续吗？'}
            </div>
            <div className="content-footer">
              <button className="btn-default" onClick={this.hideModal}>取消</button>
              <button className="btn-default" onClick={this.submit}>确定</button>
            </div>
          </div>
        </div>
      )
  }
}

export const confirmShow = actions.confirmShow
export const confirmHide = actions.confirmHide
// export const modalUpdate = actions.modalUpdate
