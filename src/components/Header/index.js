import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import {loginOut,isAuth} from '../../reducers/auth'
import Location from '../Location'
import {connect} from 'react-redux'
import './Header.scss'
import 'font-awesome/scss/font-awesome.scss'
import {tipShow} from '../Tips/modules/tips'
import {fetchNotice,fetchMessage} from './modules'
import socket from '../../socket'

@connect(
  state=>({auth:state.auth}),
{loginOut,isAuth,tipShow,fetchNotice,fetchMessage})
export default class Header extends Component{

  static contextTypes = {
    router:React.PropTypes.object.isRequired
  };

  state = {
    notice:[],
    message:[],
    ifnotice:false,
    ifmessage:false
  }

  componentWillMount =()=>{
    if(!this.props.auth.isAuth)this.props.isAuth()
    socket.on('notice',function(data){
      console.log(data)
    })
    // document.onclick = function(){
    //   // this.setState({
    //   //   ifnotice:false,
    //   //   ifmessage:false
    //   // })
    // }.bind(this)
  }

  componentWillUnMount =()=>{
     // document.onclick = null
  }

  componentWillReceiveProps =(nextProps)=>{
    if(nextProps.auth.isAuth){
        this.props.fetchNotice().then(data=>{
          this.setState({
            notice:data
          })
        })
        this.props.fetchMessage()
    }
  }

  loginOut =()=>{
    this.props.loginOut(this.context.router);
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

 goMessage =(e)=>{
    this.setState({
      ifnotice:this.state.ifnotice ? false : true
    })
    // e.preventDefault()
    // e.stopPropagation()
    // var ele = e.target.getElementsByTagName('ul')[0]
    // if (ele) {
    //   ele.style.display = ele.style.display == "block" ? "none" : "block"
    // }else{
    //   ele = e.target.parentNode.getElementsByTagName('ul')[0]
    //   ele.style.display = ele.style.display == "block" ? "none" : "block"
    // }
  }

  //私信                        “谁” 给你发了私信               属于消息（type="privatemessage"）
  //文章评价                    “谁” 在 “文章”                  属于消息（type="articlecomment"）
  //请求入群                    “谁” 请求加入 “社团”            属于消息（type="attendrequest"）
  //文章中回复了你              “谁” 在 “文章”                  属于消息（type="articlereply"）

  //关注                        “谁“ 关注了你                   属于通知（type="focusyou"）
  //通知                        “社团” 通过了你的加入请求       属于通知（type="attendapprove"）


  render(){
    // console.log(this.props.auth)
    const{auth} = this.props;
    return(
        <header>
          <nav>
          <span className="pull-left">
            <h1 ><IndexLink to="/" className="brand">OneOne</IndexLink></h1>
            <h4 >各个身怀绝技</h4><Location />
          </span>
              <Link className="item pull-left" to="/"><strong><i className="fa fa-home"></i>&nbsp;首页</strong></Link>
              <Link className="item pull-left" to="/Organization"><strong><i className="fa fa-users"></i>&nbsp;社团</strong></Link>
            <div className="headerRight">
             {!auth.isAuth && <span><Link to='/login'>登录</Link>
             <Link to='/register'>注册</Link>
             </span>}
             {auth.isAuth && <span><a onClick={this.loginOut}>退出</a>
             <Link to="/memberCenter" title="个人中心"><i className="fa fa-user-circle"></i>&nbsp;{auth.nickname}</Link></span>}
             <span onClick={this.goMessage} className="message" title="消息">
                <i className="fa fa-envelope"></i>
             </span>
             <span onClick={this.goMessage} className="message" title="通知">
                <i className="fa fa-bell"></i>
             </span>
              {this.state.ifnotice && <span className="message"><ul className="details">
                  {this.state.notice.map((item,index)=>{
                    var link = `/memberBrief/${item.data.id}`
                    switch(item.type){
                      case 'focusyou':
                        return <li key={index}><p><img src={`/originImg?name=${item.data.id}&from=member`} width="20" /><Link to={link}>{item.data.nickname}</Link>关注了你</p></li>
                      case 'attendapprove':
                        return <li key={index}><Link to={link}>{item.data.nickname}</Link>关注了你</li>
                    } 
                  })}
                </ul>
              </span>}
              <Link to='/queryresult' title="搜索"><i className="fa fa-search"></i></Link>
             </div>
          </nav>
        </header>
      )
  }
}

