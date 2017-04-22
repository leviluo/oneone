import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import {loginOut,isAuth} from '../../reducers/auth'
import Location from '../Location'
import {connect} from 'react-redux'
import './Header.scss'
import 'font-awesome/scss/font-awesome.scss'
import {tipShow} from '../Tips/modules/tips'
import {fetchNotice,fetchMessage,updateNotice} from './modules'
import socket from '../../socket'

@connect(
  state=>({auth:state.auth}),
{loginOut,isAuth,tipShow,fetchNotice,fetchMessage,updateNotice})
export default class Header extends Component{

  static contextTypes = {
    router:PropTypes.object.isRequired
  };

  state = {
    notice:[],
    message:[],
    ifnotice:false,
    ifmessage:false,
    // currentPage:1,
    // ifAddMore:true,
    // averageNum:5
  }

  componentWillMount =()=>{
    if(!this.props.auth.isAuth)this.props.isAuth()

    socket.on('notice',function(data){
      this.state.notice.unshift(data)
      this.setState({ifnotice:true})
      this.updateNotice()
    }.bind(this))

    socket.on('message',function(data){
      console.log(data)
    }.bind(this))
    
  }

  componentDidMount =()=>{
    document.getElementsByClassName('mainContainer')[0].onclick = function(){
      this.setState({
        ifnotice:false,
        ifmessage:false
      })
    }.bind(this)
  }

  componentWillUnMount =()=>{
     document.getElementsByClassName('mainContainer')[0].onclick = null
  }

  componentWillReceiveProps =(nextProps)=>{
    if(nextProps.auth.isAuth){
        this.updateNotice()
        this.props.fetchMessage()
    }
  }

  updateNotice=()=>{
    this.props.fetchNotice().then(data=>{
      if (data.status == 200) {
          this.setState({
            notice:data.data
          })
        }else{
          this.props.tipShow({type:"error",msg:data.msg})
        }
    })
  }

  loginOut =()=>{
    this.props.loginOut(this.context.router);
  }

 goMessage =(e)=>{
    this.setState({
      ifnotice:this.state.ifnotice ? false : true
    })
  }

 goNotice =(e)=>{
    this.setState({
      ifnotice:this.state.ifnotice ? false : true
    })
   this.updateNotice()
  }

  updateNotice=()=>{
     this.props.updateNotice().then(data=>{
      if (data.status == 200) {
        var notice = this.state.notice;
        for (var i = 0; i < notice.length; i++) {
          notice[i].status = 1
        }
        this.setState({})
      }else{
        this.props.tipShow({type:"error",msg:data.msg})
      }
    })
  }

  addMore =()=>{
    this.updateNotice(this.state.currentPage + 1)
    this.setState({
      currentPage:this.state.currentPage + 1
    })

  }

  //私信                        “谁” 给你发了私信               属于消息（type="privatemessage"） 转到通知消息页面的私信选项
  //文章评价                    “谁” 在 “文章”                  属于消息（type="articlecomment"） 转到通知消息页面的回复选项
  //请求入群                    “谁” 请求加入 “社团”            属于消息（type="attendrequest"）  转到通知消息页面的请求选项
  //文章中回复了你              “谁” 在 “文章”                  属于消息（type="articlereply"）   转到通知消息页面的回复选项

  //关注                        “谁“ 关注了你                   属于通知（type="focusyou"）      转到通知页面
  //通知                        “社团” 通过了你的加入请求       属于通知（type="attendapprove"） 转到通知页面

  render(){
    var isMessage = this.state.message[0] ? this.state.message[0].status : ''
    var isNotice = this.state.notice[0] ? this.state.notice[0].status : ''
    const{auth} = this.props;
    return(
        <header>
          <nav>
          <span className="pull-left">
            <h1 ><IndexLink to="/" className="brand">OneOne</IndexLink></h1>
            <h4 >一个有用的人</h4><Location />
          </span>
              <Link className="item pull-left" to="/"><strong><i className="fa fa-home"></i>&nbsp;首页</strong></Link>
              <Link className="item pull-left" to="/Organization"><strong><i className="fa fa-users"></i>&nbsp;社团</strong></Link>
            <div className="headerRight">
             {!auth.isAuth && <span><Link to='/login'>登录</Link>
             <Link to='/register'>注册</Link>
             </span>}
             {auth.isAuth && <span><a onClick={this.loginOut}>退出</a>
             <Link to="/memberCenter" title="个人中心"><i className="fa fa-user-circle"></i>&nbsp;{auth.nickname}</Link>
             <span onClick={this.goMessage} className="messageNav" title="消息">
                <i className={isMessage === 0 ? "fa fa-envelope alternate" :"fa fa-envelope"}></i>
             </span>
             <span onClick={this.goNotice} className="messageNav" title="通知">
                <i className={isNotice === 0 ? "fa fa-bell alternate" : "fa fa-bell"}></i>
             </span></span>}
              {this.state.ifnotice && <span ref="notice" className={this.state.isNotice ? "messagemove message" : "message"}><ul className="details">
                  {this.state.notice.length == 0 && <li className="text-center">没有新的通知~</li>}
                  {this.state.notice.map((item,index)=>{
                    var date = new Date(item.createdate)
                    var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}`
                    switch(item.type){
                      case 'focusyou':
                        return <li key={index}><div className="focusyou"><img src={`/originImg?name=${item.memberId}&from=member`} width="30" /><Link to={`/memberBrief/${item.memberId}`}><strong>{item.nickname}</strong></Link><span className="lightColor smallFont pull-right">{time}</span></div><p>关注了你</p></li>
                      case 'attendapprove':
                        return <li key={index}><div className="focusyou"><img src={`/originImg?name=${item.organizationshead}&from=organizations`} width="30" /><Link to={`/organizationsHome/${item.organizationsId}`}><strong>{item.organizationsname}</strong></Link><span className="lightColor smallFont pull-right">{time}</span></div><p>通过了你的入社请求</p></li>
                    } 
                  })}
                  <li className="text-center checkmore"><Link to="/memberCenter/myNotice">查看更多</Link></li>
                </ul>
              </span>}
              <Link to='/queryresult' title="搜索"><i className="fa fa-search"></i></Link>
             </div>
          </nav>
        </header>
      )
  }
}

