import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import {loginOut,isAuth} from '../../reducers/auth'
import Location from '../Location'
import {connect} from 'react-redux'
import './Header.scss'
import 'font-awesome/scss/font-awesome.scss'
import {tipShow} from '../Tips/modules/tips'
import {fetchNotice,fetchMessage} from './modules'

@connect(
  state=>({auth:state.auth}),
{loginOut,isAuth,tipShow,fetchNotice,fetchMessage})
export default class Header extends Component{

  static contextTypes = {
    router:React.PropTypes.object.isRequired
  };

  componentWillMount =()=>{
    if(!this.props.auth.isAuth)this.props.isAuth()
  }

  componentWillReceiveProps =(nextProps)=>{
    if(nextProps.auth.isAuth){
        this.props.fetchNotice()
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
    var ele = e.target.getElementsByTagName('ul')[0]
    if (ele) {
      ele.style.display = ele.style.display == "block" ? "none" : "block"
    }else{
      ele = e.target.parentNode.getElementsByTagName('ul')[0]
      ele.style.display = ele.style.display == "block" ? "none" : "block"
    }
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
                <ul ref="message" className="details">
                  <li>asdfsafds23<Link to="/queryresult">asdf</Link>1423</li>
                  <li>asdfsafds</li>
                </ul>
             </span>
             <span onClick={this.goMessage} className="message" title="通知">
                <i className="fa fa-bell"></i>
                <ul className="details">
                  <li>asdfsafds23<Link to="/queryresult">asdf</Link>1423</li>
                  <li>asdfsafds</li>
                </ul>
             </span>
              <Link to='/queryresult' title="搜索"><i className="fa fa-search"></i></Link>
             </div>
          </nav>
        </header>
      )
  }
}

