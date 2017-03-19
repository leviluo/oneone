import React, {Component} from 'react'
import './myMessage.scss'
import { connect } from 'react-redux'
import { tipShow } from '../../../../components/Tips/modules/tips'
import {messageList} from './modules/myMessage'
import Chat,{chatShow} from '../../../../components/Chat'
import PageNavBar,{pageNavInit} from '../../../../components/PageNavBar'
import {asyncConnect} from 'redux-async-connect'
import {Link} from 'react-router'
import {countMessage} from '../../containers/modules'

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    
  }
}])

@connect(
  state => ({
    auth:state.auth,
    pagenavbar:state.pagenavbar
    }),
  {chatShow,tipShow,countMessage,pageNavInit}
)

export default class myMessage extends Component {

  state ={
    items:[],
    averagenum:5
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentWillMount =()=>{
    this.props.pageNavInit(this.messageListData)
  }

  messageListData = (currentPage)=>{
    return messageList(`${this.state.averagenum*(currentPage-1)},${this.state.averagenum}`).then(({data})=>{
      if (data.status == 200) {
        this.setState({
          items:data.data
        })
        return Math.ceil(data.count/this.state.averagenum)
      }else if (data.status==600) {
        this.props.dispatch({type:"AUTHOUT"})
        this.context.router.push('/login')
      }{
        this.props.tipShow({type:'error',msg:data.msg})
      }
    })
  }

  showChat =(nickname,phone)=>{
    // this.setState({
    //     chatTo:name,
    //     sendTo:phone
    // })
    this.props.chatShow({chatTo:nickname,chatFrom:this.props.auth.nickname,sendTo:phone})
  }

  componentWillUnmount =()=>{
    this.props.countMessage()
  }

  render () {

    return (
    <div>
      <div className="messageContent">
        {this.state.items.length == 0 && <div className="text-center">您还没有收到任何私信耶~</div>}
        {this.state.items.map((item,index)=>{
          var headImg = `/originImg?from=member&name=${item.phone}`
          var imgUrl = item.imgUrl ? `/img?from=chat&name=${item.imgUrl}` : ''
          var date = new Date(item.time)
          var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}`
          var link = `/memberBrief/${item.memberId}`
          if (item.isSend) {
            var head = <span>你发送给 <Link to={link}>{item.nickname}</Link> 的消息:</span>
            var isRead = item.active == '0'?'对方未读':'对方已读'
          }else{
            var head = <span><Link to={link}>{item.nickname}</Link> 发送给你的消息:</span> 
            var isRead = item.active == '0'?'未读':'已读'
          }
          return <div key = {index}>
              <img src={headImg} /><span><button className="btn-default" onClick={()=>this.showChat(item.nickname,item.phone)}>查看</button></span>
              <ul>
                <li><span style={{color:item.active == '0' ? 'green' : '#666'}}>●</span><span className="lightColor">({isRead})</span><span>{time}</span>{head} </li>
                <li>{item.text}{item.imgUrl && <img src={imgUrl} />}</li>
              </ul>
          </div>
        })}
      <PageNavBar />
      </div>
      <Chat />
    </div>
    )
  }
}

myMessage.propTypes = {
  auth: React.PropTypes.object
}

