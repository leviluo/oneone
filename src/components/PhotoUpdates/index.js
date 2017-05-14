import React, { Component, PropTypes } from 'react'
// import { findDOMNode } from 'react-dom';
import {connect} from 'react-redux'
// import * as actions from './modules/modal'
import {Link} from 'react-router'
import './index.scss'
import {imgbrowserShow} from '../ImageBrowser'

// const hide = actions.modalHide

@connect(
  state=>({}),
{imgbrowserShow})
export default class photoupdates extends Component{

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
        <div className='photoupdates'>
          <img width="50" src={`/originImg?from=member&name=${this.state.item.memberId}`} alt=""/>
                  {this.state.item.list && <div>
                     <div className="header">&nbsp;&nbsp;<span className="lightColor smallFont pull-right">{time}</span><Link to={`/memberBrief/${this.state.item.memberId}`}>{this.state.item.nickname}</Link>在<Link to={`/works/${this.state.item.list[0].memberSpecialityId}`}>{this.state.item.list[0].specialityName}</Link>上传了新照片</div>
                    <div className="photoLists">
                    {this.state.item.list.map((item,index)=>{
                      if (index >= 8) return
                      return <div key={index} onClick={(e)=>this.props.imgbrowserShow({currentChoose:index,imgs:this.state.item.list})} style={{backgroundImage:`url(/img?from=speciality&name=${item.workName})`}}></div>
                    })}             
                    {this.state.item.list.length > 8 && <a style={{backgroundImage:`url(/img?from=speciality&name=${this.state.item.list[8].workName})`,cursor:"auto"}}>+{this.state.item.list.length - 8}</a>}
                </div>
            </div>}
        </div>
      )
  }
}