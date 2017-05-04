import React, {Component} from 'react'
import './myMessage.scss'
import { connect } from 'react-redux'
import { tipShow } from '../../../../components/Tips/modules/tips'
import {messageList,getHistory,submitText,getReplyMe,submitReply,getcommentData,getrequestData,isApprove} from './modules/myMessage'
import Chat,{chatShow} from '../../../../components/Chat'
import {fetchMessage} from '../../../../components/Header/modules'
import {loadingShow,loadingHide} from '../../../../components/Loading'
import {asyncConnect} from 'redux-async-connect'
import {Link} from 'react-router'
import socket from '../../../../socket'
import PageNavBar,{pageNavInit} from '../../../../components/PageNavBar'
import Modal,{modalShow,modalHide} from '../../../../components/Modal'
import Textarea from '../../../../components/Textarea'


@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    
  }
}])

@connect(
  state => ({
    auth:state.auth,
    pagenavbar:state.pagenavbar,
    messages:state.message.messages
    }),
  {chatShow,tipShow,pageNavInit,modalShow,modalHide,fetchMessage,loadingShow,loadingHide}
)

export default class myMessage extends Component {

  state ={
    items:[],
    averagenum:3,
    tag:1,
    showEmotion:false,
    chatContent:[],
    msgIndex:0,
    currentPage:1,
    replyMe:[],
    commentMe:[],
    requestMe:[],
    // flag:{},
    privatemessage:0,
    articlecomment:0,
    attendrequest:0,
    articlereply:0,
    setHeight:true
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentWillMount =()=>{
   this.recentChats(1)
   socket.on('message',function(data){
      var date = (new Date()).toString()
      if (this.state.items[this.state.msgIndex].memberId == data.sendFrom) { //就在当前聊天页面
          // var time = date.DateFormat("yyyy-MM-dd hh:mm")
          this.state.chatContent.push({
            time:date,
            text:data.text,
            sendTo:data.sendTo,
            sendnickname:data.sendnickname
          })
          this.setState({setHeight:true})
      }

      for (var i = 0; i < this.state.items.length; i++) { //在聊天列表里
        if(this.state.items[i].memberId == data.sendFrom){
          this.changeChat(i)
          return
        }
      }

      this.state.items.unshift({ //没在聊天列表里添加到新列表里
        active:1,
        isSend:0,
        memberId:data.sendFrom,
        nickname:data.sendnickname,
        text:data.text,
        time:date
      })

      this.changeChat(0)
     
    }.bind(this)) 
    document.addEventListener('click', this.closeEmotion, false);
    // if (this.props.messages.length > 0) {  //只有最后一条消息的尴尬
      this.initNum(this.props.messages)
    // }
  }



  recentChats = (currentPage)=>{
    if (this.state.isEnd) {return}
    messageList(`${this.state.averagenum*(currentPage-1)},${this.state.averagenum}`).then(({data})=>{
      if (data.status == 200) {
        if(this.state.privatemessage)this.props.fetchMessage()
        if (currentPage == 1) {
            this.setState({
              items:data.data
            })
          if (data.data[0]) { 
            this.checkHistory(data.data[0].memberId)
          }
        }else{
          if (data.data.length == 0) {
            this.props.tipShow({type:"error",msg:"没有更多的消息"})
            this.setState({
              isEnd:true
            })
            return
          };
          this.state.items = this.state.items.concat(data.data)
          this.setState({})
        }
      }else if (data.status==600) {
        this.props.dispatch({type:"AUTHOUT"})
        this.context.router.push('/login')
      }{
        this.props.tipShow({type:'error',msg:data.msg})
      }
    })
  }


  addMore =()=>{
    this.setState({
      currentPage:this.state.currentPage + 1
    })
    this.recentChats(this.state.currentPage + 1)
  }

  changeTag =(index)=>{
    this.setState({
      tag:index
    })
    if (index == 1) { // 获取聊天记录
      this.recentChats(1)
    }else if (index == 2) { // 获取评论
      this.props.pageNavInit(this.commentData)
    }else if (index == 3) { // 获取回复
      this.props.pageNavInit(this.replyData)
    }else if (index == 4) { // 入社请求
      this.props.pageNavInit(this.requestData)
    }
    // console.log(this.props.fetchMessage)
    
  }

  requestData =(currentPage)=>{
     return getrequestData(`${this.state.averagenum*(currentPage-1)},${this.state.averagenum}`).then(({data})=>{
      if (data.status == 200) { 
        this.setState({
          requestMe:data.data
        })
      if(this.state.attendrequest)this.props.fetchMessage() //更新状态信息
      return Math.ceil(data.count/this.state.averagenum)
      }else{
       this.props.tipShow({type:'error',msg:data.msg})
      }
    })
  }

  commentData = (currentPage)=>{
    return getcommentData(`${this.state.averagenum*(currentPage-1)},${this.state.averagenum}`).then(({data})=>{
      if (data.status == 200) { 
        this.setState({
          commentMe:data.data
        })
        if(this.state.articlecomment)this.props.fetchMessage()
      return Math.ceil(data.count/this.state.averagenum)
      }else{
       this.props.tipShow({type:'error',msg:data.msg})
      }
    })
  }

  replyData = (currentPage)=>{
    return getReplyMe(`${this.state.averagenum*(currentPage-1)},${this.state.averagenum}`).then(({data})=>{
      if (data.status == 200) { 
        this.setState({
          replyMe:data.data
        })
        if(this.state.articlereply)this.props.fetchMessage()
      return Math.ceil(data.count/this.state.averagenum)
      }else{
       this.props.tipShow({type:'error',msg:data.msg})
      }
    })
  }

  chooseEmotion = (e,index)=>{
    if(e.target.childNodes[0]){
      var src = e.target.childNodes[0].src
      this.insertContent() // 点击了div之后重新写入选区
    }else{
      var src = e.target.src
    }

    document.execCommand("InsertImage", false, src);
    this.saveRange() //插入新图片后重新保存选区

    this.setState({
        showEmotion:false
    })
  }

  recordPoint = (e)=>{
    this.saveRange()
    if (e.keyCode == 13) {
      this.sendMsg()
    }
  }

  saveRange = ()=> {
       var selection = window.getSelection ? window.getSelection() : document.selection;
       if (!selection.rangeCount) return;
       var range = selection.createRange ? selection.createRange() : selection.getRangeAt(0);
       window._range = range;
  }

  insertContent = ()=> {
       if(!window._range){
         this.refs.text.focus()
         return
       }
       var selection, range = window._range;
       if (!window.getSelection) {
            range.collapse(false);
            range.select();
       } else {
            selection = window.getSelection ? window.getSelection() : document.selection;
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
       }   
  }

  isEmotion = (e)=>{
      this.setState({
        showEmotion:this.state.showEmotion ? false : true
      })
      this.insertContent()
      e.nativeEvent.stopImmediatePropagation();
  }

  closeEmotion =()=>{
    if (!this.state.showEmotion) return
    this.setState({
          showEmotion:false 
    })
  }


  componentWillUnmount =()=>{
    document.removeEventListener('click',this.closeEmotion)
    this.props.pageNavInit(null)
  }

  componentDidUpdate =()=>{
    if (!(this.state.tag == 1)) return
    if (this.state.setHeight) {
      var me = this
      setTimeout(()=>{
        me.refs.contentBody.scrollTop = me.refs.contentBody.scrollHeight;
      },20)
    }
  }

  insertImage =(e)=>{
    // 判断文件类型
    var value = e.target.value
    if (!value)return
    var filextension=value.substring(value.lastIndexOf("."),value.length);
    filextension = filextension.toLowerCase();
    if ((filextension!='.jpg')&&(filextension!='.gif')&&(filextension!='.jpeg')&&(filextension!='.png')&&(filextension!='.bmp'))
    {
      this.props.tipShow({type:"error",msg:"文件类型不正确"})
      return;
    }
    var file = e.target.files[0]
    var reader = new FileReader();  

    reader.onload = function(e) {  
        var src = e.target.result;  
        this.insertContent()
        document.execCommand("InsertImage", false, src);
        this.saveRange()
    }.bind(this)

    reader.readAsDataURL(file); 
  }

  convertBase64UrlToBlob =(data)=>{
    // var data=url.split(',')[1];
    if (!data) {return}

    data=window.atob(data);
    var ia = new Uint8Array(data.length);
    for (var i = 0; i < data.length; i++) {
        ia[i] = data.charCodeAt(i);
    };
    // canvas.toDataURL 返回的默认格式就是 image/png
    var blob=new Blob([ia], {type:"image/png"});

    return blob
  }

  sendMsg =()=>{

    var html = this.refs.text.innerHTML;
    var fd = new FormData(); 
    var file = []
    var content = html.replace(/<img\ssrc="data:image\/(png|jpeg|gif);base64,([0-9a-zA-Z\/\+=]+)">/g,function(_,$1,$2){
      var secret = Math.random() 
      fd.append(secret,this.convertBase64UrlToBlob($2))
      // file.push({key:secret,file:this.convertBase64UrlToBlob($2)})
      return secret
    }.bind(this))
    // console.log(content)
    if (!content || content.length > 300) {
      this.props.tipShow({type:"error",msg:"回复内容在1~300个字符"})
      return //过滤只有制表符
    }
    // fd.append('file',file)
    fd.append('text',content)
    fd.append('sendTo',this.state.items[this.state.msgIndex].memberId)
    // if (this.state.flag['sendMsg']) return
    // this.state.flag['sendMsg'] = true;
    this.props.loadingShow()
    submitText(fd).then(({data}) => {
      // this.state.flag['sendMsg'] = false;
      this.props.loadingHide()
      if (data.status==200) {
          var date = new Date()
          var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate() < 10 ? '0'+date.getDate() :date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}`
          this.state.chatContent.push({
            time:time,
            text:html,
            sendTo:this.state.items[this.state.msgIndex].memberId,
            send:this.props.auth.memberId,
            sendnickname:this.props.auth.nickname
          })
          this.setState({setHeight:true})
          this.refs.text.innerHTML = ""
      }else{
          this.props.tipShow({type:"error",msg:"发送失败"})
      }
    }).then(()=>{
          this.refs.text.value = ''
          this.refs.text.focus()
    })
  }

  checkHistory =(sendTo)=>{
    if(typeof sendTo == "object")sendTo = ''
    getHistory({chatWith:sendTo,lastUpdate:this.lastUpdate || ''}).then(({data})=>{

        var res = data.data.reverse()

        if (this.lastUpdate) {
          this.state.chatContent = res.concat(this.state.chatContent)
          if (data.data.length < 10) {
            this.props.tipShow({type:"error",msg:"没有更多的消息"})
            this.setState({historyFull:true})
            return
          };
          this.setState({})
        }else{
          this.setState({
            chatContent:res
          })
          if (data.data.length < 10) {
            this.setState({historyFull:true})
            return
          };
        }
        
        var sendDate = new Date(res[0].time)
        if(res[0])this.lastUpdate = `${sendDate.getFullYear()}-${sendDate.getMonth()+1}-${sendDate.getDate()} ${sendDate.getHours()}:${sendDate.getMinutes()}:${sendDate.getSeconds()}`;
        // if(isTop==true){
        //   this.setHeight()
        // }
    })
  }

  changeChat =(index)=>{
    this.setState({
      msgIndex:index,
      chatContent:[],
      historyFull:false
    })
    this.lastUpdate = ""
    this.setState({
      setHeight:true
    })
    this.checkHistory(this.state.items[index].memberId)
  }

  replyText =(e)=>{
    this.setState({
      replyText:e.target.value
    })
  }

  replyNow = (nickname,articleId,replyId)=>{
    this.setState({
      articleId:articleId,
      replyToId:replyId,
    })
    var content = <Textarea header="回复内容" handleTextarea = {this.replyText} rows="10" />

    this.props.modalShow({header:`回复 ${nickname} 的消息`,content:content,submit:this.submitReply})
  }

  submitReply = ()=>{
    var comment = this.state.replyText.trim()

    if (!comment) {
      this.props.tipShow({type:"error",msg:"请填写回复内容"})
      return
    }

    if (comment.length > 1000) {
      this.props.tipShow({type:"error",msg:"回复内容不超过1000个字符"})
      return
    }
      this.props.loadingShow()
    submitReply({comment:comment,articleId:this.state.articleId,replyToId:this.state.replyToId}).then(data=>{
      this.props.loadingHide()

      if (data.status == 200) {
        this.props.tipShow({
          type:"success",
          msg:"回复成功"
        })
        this.props.modalHide()
      }else{
        this.props.tipShow({
          type:"error",
          msg:data.msg
        })
      }
    })
  }



  componentWillReceiveProps =(nextProps)=>{
    // console.log(nextProps)
    var messages = nextProps.messages
    // if (messages.length > 0){ 
      this.initNum(messages)
    // }
  }

  initNum =(messages)=>{
    var articlereply = 0,
        articlecomment = 0,
        privatemessage = 0,
        attendrequest = 0
        // console.log("000")
    for (var i = 0; i < messages.length; i++) {
      switch(messages[i].type){
        case 'privatemessage':
              privatemessage += 1
              break;
        case 'articlecomment':
              articlecomment += 1
              break;
        case 'attendrequest':
              attendrequest += 1
              break;
        case 'articlereply':
              articlereply += 1
      }
    }
    this.setState({
      privatemessage:privatemessage,
      articlecomment:articlecomment,
      attendrequest:attendrequest,
      articlereply:articlereply,
    })
  }

  isApprove =(e,flag,id)=>{
    this.props.loadingShow()
    isApprove(flag,id).then(({data})=>{
      this.props.loadingHide()
      if (data.status == 200) {
        this.props.tipShow({type:'success',msg:"操作成功"})
          for (var i = 0; i < this.state.requestMe.length; i++) {
            if(this.state.requestMe[i].id == id){
              this.state.requestMe.splice(i,1)
              this.setState({})
              break
            }
          }
        }else if (data.status == 600) {
          this.props.dispatch({type:"AUTHOUT"})
          this.context.router.push('/login')
        }else{
          this.props.tipShow({type:'error',msg:data.msg})
        }
    })
  }

  static contextTypes = {
      router: React.PropTypes.object.isRequired
  };


  render () {
    const num = new Array(100).fill(0)
    return (
    <div>
       <div id="message">
          <div className="top">
              <span className={this.state.tag == 1 ? "active" : ""} onClick={()=>this.changeTag(1)}>私信{this.state.privatemessage > 0 && <span>{this.state.privatemessage}</span>}</span>
              <span className={this.state.tag == 2 ? "active" : ""} onClick={()=>this.changeTag(2)}>评论{this.state.articlecomment > 0 && <span>{this.state.articlecomment}</span>}</span>
              <span className={this.state.tag == 3 ? "active" : ""} onClick={()=>this.changeTag(3)}>回复{this.state.articlereply > 0 && <span>{this.state.articlereply}</span>}</span>
              <span className={this.state.tag == 4 ? "active" : ""} onClick={()=>this.changeTag(4)}>入社请求{this.state.attendrequest > 0 && <span>{this.state.attendrequest}</span>}</span>
          </div>
          <div className="content">
          {this.state.tag == 1 && <article className="chat">
            <aside>
              <ul>
              {this.state.items.map((item,index)=>{
              var time = item.time.DateFormat("yyyy-MM-dd hh:mm")
              var link = `/memberBrief/${item.memberId}`
              if (item.isSend) {
                var isRead = item.active == '0'?'对方未读':'对方已读'
              }else{
                var isRead = item.active == '0'?'未读':'已读'
              }
              item.text = item.text.replace(/<img(.*)>/,"[图片]")
              return <li key={index} style={{background:this.state.msgIndex == index ? "#efefef" : "#fff"}} onClick={()=>this.changeChat(index)}>
                <div><img src={`/originImg?from=member&name=${item.memberId}`} width="40" alt="头像"/><strong><Link to={`/memberBrief/${item.memberId}`}>{item.nickname}</Link></strong></div>
                <div>
                  <ul>
                    <li><span style={{borderLeftColor:item.active == '0' ? 'green' : '#666',borderLeftWidth:'2px',borderLeftStyle:'solid',paddingLeft:"5px"}} className="lightColor">{isRead}</span><span className="lightColor pull-right smallFont">{time}</span></li>
                  </ul>
                </div>
              </li>
              })}
              <li className="text-center"><a onClick={this.addMore}>加载更多</a></li>
              </ul>
            </aside>
            <aside>
              <div className="chatrecent" ref="contentBody">
                  {!this.state.historyFull && <p><a onClick={()=>{this.setState({setHeight:false});this.checkHistory(this.state.items[this.state.msgIndex].memberId)}}>查看更多...</a></p>}
                  <div className="chat" ref="chat">
                  {this.state.chatContent.map((item,index)=>{
                    var time = item.time.DateFormat("yyyy-MM-dd hh:mm")
                     if(item.sendTo != this.props.auth.memberId){
                       return <article className="sendFrom" key={index}>
                        <p className="text-center lightColor smallFont">{time}</p>
                        <p>{item.sendnickname}<img className="head pull-right" width="30" src={`/originImg?from=member&name=${this.props.auth.memberId}`} /></p>
                        <p><span className="fa fa-play pull-right" ></span><span dangerouslySetInnerHTML={{__html:item.text}}></span></p>
                       </article>
                     }else{
                        return <article className="sendTo" key={index}>
                        <p className="text-center lightColor smallFont">{time}</p>
                        <p><img width="30" className="head pull-left" src={`/originImg?from=member&name=${item.send}`} />{item.sendnickname}</p>
                        <p><span className="fa fa-play pull-left" ></span><span dangerouslySetInnerHTML={{__html:item.text}}></span></p>
                       </article>
                     }
                  })}
                  </div>
              </div>
              <div className="nav">
                  <strong>
                      <a className="fa fa-smile-o" onClick={this.isEmotion}></a>
                      {this.state.showEmotion && <div>
                        {num.map((item,index)=>
                          <div key={index} onClick={(e)=>this.chooseEmotion(e,index)}>
                            <img src={`https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${index}.gif`} />
                          </div>)}
                      </div>}
                  </strong>
                  &nbsp;&nbsp;
                  <strong><a className="fa fa-image" onClick={()=>{this.refs.imageInput.click()}}></a></strong>
                  <input onChange={this.insertImage} ref="imageInput" type="file" style={{display:"none"}}/>
              </div>
              <div className="chatcontent">
                  <div contentEditable="true" ref="text" onKeyUp={this.recordPoint} onClick={this.recordPoint} >
                  </div>
                  <div>
                    <button className="btn btn-success" onClick={this.sendMsg}>发送</button>
                  </div>
              </div>
            </aside>
          </article>}
          {this.state.tag == 2 && <article className="replys">
            <ul>
              {this.state.commentMe.length == 0 && <li className="text-center">暂时没有记录</li>}
              {this.state.commentMe.map((item,index)=>{
                var time = item.createdAt.DateFormat("yyyy-MM-dd hh:mm")
                return <li key={index}><Link to={`/memberBrief/${item.memberId}`}>{item.nickname}</Link>&nbsp;在&nbsp;<Link to={`/article/${item.articleId}`}>{item.title}</Link>&nbsp;中评论了你<span className="pull-right lightColor smallFont">{time}</span> <a onClick={()=>this.replyNow(item.nickname,item.articleId,item.replyId)} className="pull-right">立即回复</a><p dangerouslySetInnerHTML={{__html:item.comment}} className="lightBackground"></p></li>
              })}
            </ul>
          </article>}
          {this.state.tag == 3 && <article className="replys">
            <ul>
              {this.state.replyMe.length == 0 && <li className="text-center">暂时没有记录</li>}
              {this.state.replyMe.map((item,index)=>{
                var time = item.createdAt.DateFormat("yyyy-MM-dd hh:mm")
                return <li key={index}><Link to={`/memberBrief/${item.memberId}`}>{item.nickname}</Link>&nbsp;在&nbsp;<Link to={`/article/${item.articleId}`}>{item.title}</Link>&nbsp;中回复了你<span className="pull-right lightColor smallFont">{time}</span> <a onClick={()=>this.replyNow(item.nickname,item.articleId,item.replyId)} className="pull-right">立即回复</a><p dangerouslySetInnerHTML={{__html:item.comment}} className="lightBackground"></p></li>
              })}
            </ul>
            </article>}
          {this.state.tag == 4 && <article className="replys">
            <ul>
              {this.state.requestMe.length == 0 && <li className="text-center">暂时没有记录</li>}
              {this.state.requestMe.map((item,index)=>{
                var time = item.createdAt.DateFormat("yyyy-MM-dd hh:mm")
                return <li key={index}><Link to={`/memberBrief/${item.memberId}`}>{item.nickname}</Link>&nbsp;请求加入&nbsp;<Link to={`/organizationsHome/${item.organizationsId}`}>{item.name}</Link><span className="pull-right lightColor smallFont">{time}</span><a className="pull-right" onClick={(e)=>this.isApprove(e,1,item.id)} style={{marginLeft:"10px"}}>通过</a><a onClick={(e)=>this.isApprove(e,0,item.id)} className="pull-right">拒绝</a><p dangerouslySetInnerHTML={{__html:item.verified}} className="lightBackground"></p></li>
              })}
            </ul>
            </article>}
          {this.state.tag !=1 && <PageNavBar></PageNavBar>}
          </div>
       </div>
       <Modal></Modal>
    </div>
    )
  }
}

myMessage.propTypes = {
  auth: React.PropTypes.object
}