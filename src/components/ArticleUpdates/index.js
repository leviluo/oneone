import React, { Component, PropTypes } from 'react'
// import { findDOMNode } from 'react-dom';
// import {connect} from 'react-redux'
// import * as actions from './modules/modal'
import {Link} from 'react-router'
import './index.scss'

// const hide = actions.modalHide

// @connect(
//   state=>({modalStatus:state.modal}),
// {hide})
export default class articleupdates extends Component{

  state = {
    item:{}
  }

  componentWillMount =()=>{
    this.setState({
      item:this.props.items
    })
  }

  render(){
    if(this.state.item.createAt)var time = this.state.item.createAt.DateFormat("yyyy-MM-dd hh:mm")
    return(
        <div className='articleupdates'>
          <img width="50" src={`/originImg?from=member&name=${this.state.item.memberId}`} alt=""/>
                {this.state.item.list && <div className="header">
                  <span className="lightColor smallFont pull-right">{time}</span>&nbsp;&nbsp;&nbsp;<Link to={`/memberBrief/${this.state.item.memberId}`}>{this.state.item.nickname}</Link>在<Link to={`/organizationsHome/${this.state.item.list[0].organizationsId}`}>{this.state.item.list[0].organizationsName}</Link>
                  发布了<Link to={`/article/${this.state.item.list[0].articleId}`}>{this.state.item.list[0].title}({this.state.item.list[0].titleType})</Link>
            </div>}
        </div>
      )
  }
}