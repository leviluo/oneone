import React, { Component, PropTypes } from 'react'
import { IndexLink, Link,browserHistory } from 'react-router'
import {loginOut,isAuth} from '../../reducers/auth'
// import Location from '../Location'
import {connect} from 'react-redux'
import './Header.scss'
import 'font-awesome/scss/font-awesome.scss'
import {tipShow} from '../Tips/modules/tips'
import {fetchNotice,fetchMessage,addMessage,addNotice,clearNotice} from './modules'
import socket from '../../socket'

@connect(
  state=>({
    auth:state.auth,
    message:state.message,
    chat:state.chat
  }),
{loginOut,isAuth,tipShow,fetchNotice,fetchMessage,addMessage,addNotice,clearNotice})
export default class Header extends Component{

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };


  state = {
    // notice:[],
    // message:[],
    ifnotice:false,
    // ifmessage:false,
    // currentPage:1,
    // ifAddMore:true,
    // averageNum:5
  }

  componentWillMount =()=>{
    // console.log(this)
    if(!this.props.auth.isAuth)this.props.isAuth()

    socket.on('notice',function(data){
      this.props.addNotice(data)
      this.setState({ifnotice:true})
    }.bind(this))

    socket.on('primessage',function(data){
      // console.log(data)
      // console.log(this.props)
      if(this.props.chat.isShow || browserHistory.getCurrentLocation().pathname == "/memberCenter/myMessage"){
        if (data.type != "privatemessage") {
          this.props.addMessage(data)
        }
      }else{
          this.props.addMessage(data)
      }



    }.bind(this))
    
    document.addEventListener('click', this.setModal, false);
  }

  setModal = ()=>{
    this.setState({
        ifnotice:false,
        // ifmessage:false
    })
    this.props.clearNotice()
  }

  componentDidMount =()=>{
    // document.onclick = function(){
    //   this.setState({
    //     ifnotice:false,
    //     ifmessage:false
    //   })
    // }.bind(this)
    // console.log(this.props)
    // console.log()
  }

  componentWillUnMount =()=>{
     // document.onclick = null
  }

  componentWillReceiveProps =(nextProps)=>{
    if (nextProps.auth.memberId === 0) return
    if(nextProps.auth.isAuth && !this.props.message.messageisloaded){
        this.props.fetchMessage()
    }
    if(nextProps.auth.isAuth && !this.props.message.noticeisloaded){
        this.props.fetchNotice()
    }
  }

  // updateNotice=()=>{
  //   this.props.fetchNotice().then(data=>{
  //     if (data.status == 200) {
  //         this.setState({
  //           notice:data.data
  //         })
  //       }else{
  //         this.props.tipShow({type:"error",msg:data.msg})
  //       }
  //   })
  // }

  // updateMessage=()=>{
  //   this.props.fetchMessage().then(data=>{
  //     if (data.status == 200) {
  //         this.setState({
  //           message:data.data
  //         })
  //       }else{
  //         this.props.tipShow({type:"error",msg:data.msg})
  //       }
  //   })
  // }

  loginOut =()=>{
    this.props.loginOut(this.context.router);
  }

 // goMessage =(e)=>{
 //    this.setState({
 //      ifmessage:this.state.ifmessage ? false : true
 //    })
 //    this.updateMessage()
 //    // e.nativeEvent.stopImmediatePropagation();
 //  }

 goNotice =(e)=>{
    // console.log(this.state.ifnotice)
    this.setState({
      ifnotice:this.state.ifnotice ? false : true
    })
    // this.updateNotice()
  }

  // updateNotice=()=>{
  //    this.props.updateNotice().then(data=>{
  //     if (data.status == 200) {
  //       var notice = this.props.message.notices;
  //       for (var i = 0; i < notice.length; i++) {
  //         notice[i].status = 1
  //       }
  //       this.setState({})
  //     }else{
  //       this.props.tipShow({type:"error",msg:data.msg})
  //     }
  //   })
  // }

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
    // var isMessage = this.props.message.messages[0] ? this.props.message.messages[0].status : ''
    // var isNotice = this.props.message.notices[0] ? this.props.message.notices[0].status : ''
    const{auth} = this.props;
    return(
        <header>
          <nav>
          <span className="pull-left">
            <h1 ><IndexLink to="/" className="brand">OneOne</IndexLink></h1>
            <h4 >一个奇趣的人</h4>
          </span>
              <Link className="item pull-left" to="/"><strong><i className="fa fa-home"></i>&nbsp;首页</strong></Link>
              <Link className="item pull-left" to="/Organization"><strong><i className="fa fa-users"></i>&nbsp;社团</strong></Link>
            <div className="headerRight">
             {!auth.isAuth && <span><Link to='/login'>登录</Link>
             <Link to='/register'>注册</Link>
             </span>}
             {auth.isAuth && <span><a onClick={this.loginOut}>退出</a>
             <Link to={this.props.auth.memberId > 0 ? "/memberCenter/updates/follow" : "/admincenter"} title="个人中心"><i className="fa fa-user-circle"></i>&nbsp;{auth.nickname}</Link>
             {this.props.auth.memberId > 0 && <Link to="/memberCenter/myMessage" className="messageNav" title="消息">
                <i className={this.props.message.messages.length > 0 ? "fa fa-envelope alternate" :"fa fa-envelope"}>{this.props.message.messages.length > 0 && <b>({this.props.message.messages.length})</b>}</i>
             </Link>}
             {this.props.auth.memberId > 0 && <span onClick={this.goNotice} className="messageNav" title="通知">
                <i className={this.props.message.notices.length > 0 ? "fa fa-bell alternate" : "fa fa-bell"}></i>
             </span>}
             </span>}
              {this.state.ifnotice && <span ref="notice" className={this.state.isNotice ? "messagemove message" : "message"}><span className="fa fa-play pull-right" ></span><ul className="details">
                  {this.props.message.notices.length == 0 && <li className="text-center">没有新的通知~</li>}
                  {this.props.message.notices.map((item,index)=>{
                    var time = item.createdate.DateFormat("yyyy-MM-dd hh:mm")
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



