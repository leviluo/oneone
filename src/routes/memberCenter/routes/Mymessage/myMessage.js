import React, {Component} from 'react'
import './myMessage.scss'
import { connect } from 'react-redux'
import { tipShow } from '../../../../components/Tips/modules/tips'
import {messageList} from './modules/myMessage'
import Chat,{chatShow} from '../../../../components/Chat'
import PageNavBar,{pageNavInit} from '../../../../components/PageNavBar'
import {asyncConnect} from 'redux-async-connect'
import {Link} from 'react-router'
// import {countMessage} from '../../containers/modules'

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    
  }
}])

@connect(
  state => ({
    auth:state.auth,
    pagenavbar:state.pagenavbar
    }),
  {chatShow,tipShow,pageNavInit}
)

export default class myMessage extends Component {

  state ={
    items:[],
    averagenum:5,
    tag:1
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentWillMount =()=>{
    this.props.pageNavInit(this.messageListData)
    console.log("000")
  }

  messageListData = (currentPage)=>{
    console.log("0000")
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

  showChat =(nickname,id)=>{
    // this.setState({
    //     chatTo:name,
    //     sendTo:phone
    // })
    this.props.chatShow({chatTo:nickname,chatFrom:this.props.auth.nickname,sendTo:id})
  }

  componentWillUnmount =()=>{
    // this.props.countMessage()
  }

  changeTag =(index)=>{
    this.setState({
      tag:index
    })
  }

  render () {

    return (
    <div>
       <div id="message">
          <div className="top">
              <span className={this.state.tag == 1 ? "active" : ""} onClick={()=>this.changeTag(1)}>私信</span>
              <span className={this.state.tag == 2 ? "active" : ""} onClick={()=>this.changeTag(2)}>回复</span>
              <span className={this.state.tag == 3 ? "active" : ""} onClick={()=>this.changeTag(3)}>请求</span>
          </div>
          <div className="content">
          {this.state.tag == 1 && <article className="chat">
            <aside>
              <ul>
              {this.state.items.map((item,index)=>{
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
              return <li key={index}>
                <div><img src={`/originImg?from=member&name=${item.memberId}`} width="30" alt="头像"/></div>
                <div>
                  <ul>
                    <li><span style={{color:item.active == '0' ? 'green' : '#666'}}>●</span><span className="lightColor">({isRead})</span><span>{time}</span>{head} </li>
                    <li dangerouslySetInnerHTML={{__html:item.text}}></li>
                  </ul>
                </div>
              </li>
              })}
              </ul>
            </aside>
            <aside>

            </aside>
          </article>}
          {this.state.tag == 2 && <article>2222</article>}
          {this.state.tag == 3 && <article>3333</article>}
          </div>
          <PageNavBar />
       </div>
    </div>
    )
  }
}

myMessage.propTypes = {
  auth: React.PropTypes.object
}

  // {this.state.items.length == 0 && <div className="text-center">您还没有收到任何私信耶~</div>}
 //        {this.state.items.map((item,index)=>{
 //          var headImg = `/originImg?from=member&name=${item.memberId}`
 //          // var imgUrl = item.imgUrl ? `/img?from=chat&name=${item.imgUrl}` : ''
 //          var date = new Date(item.time)
 //          var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}`
 //          var link = `/memberBrief/${item.memberId}`
 //          if (item.isSend) {
 //            var head = <span>你发送给 <Link to={link}>{item.nickname}</Link> 的消息:</span>
 //            var isRead = item.active == '0'?'对方未读':'对方已读'
 //          }else{
 //            var head = <span><Link to={link}>{item.nickname}</Link> 发送给你的消息:</span> 
 //            var isRead = item.active == '0'?'未读':'已读'
 //          }
 //          return <div key = {index}>
 //              <img src={headImg} /><span><button className="btn-default" onClick={()=>this.showChat(item.nickname,item.memberId)}>查看</button></span>
 //              <ul>
 //                <li><span style={{color:item.active == '0' ? 'green' : '#666'}}>●</span><span className="lightColor">({isRead})</span><span>{time}</span>{head} </li>
 //                <li dangerouslySetInnerHTML={{__html:item.text}}></li>
 //              </ul>
 //          </div>
 //        })}
 //      <PageNavBar />
 //      </div>
 //      <Chat />