import React, {Component} from 'react'
import './myMessage.scss'
import { connect } from 'react-redux'
import { tipShow } from '../../../../components/Tips/modules/tips'
import {messageList,getHistory,submitText} from './modules/myMessage'
import Chat,{chatShow} from '../../../../components/Chat'
import {asyncConnect} from 'redux-async-connect'
import {Link} from 'react-router'
import socket from '../../../../socket'

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    
  }
}])

@connect(
  state => ({
    auth:state.auth,
    pagenavbar:state.pagenavbar
    }),
  {chatShow,tipShow}
)

export default class myMessage extends Component {

  state ={
    items:[],
    averagenum:5,
    tag:1,
    showEmotion:false,
    chatContent:[],
    msgIndex:0
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentWillMount =()=>{
   this.recentChats(1)
   socket.on('message',function(data){
      var date = new Date()
      var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate() < 10 ? '0'+date.getDate() :date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}`
      this.state.chatContent.push({
        time:time,
        text:data.text,
        sendTo:data.sendTo,
        sendnickname:data.sendnickname
      })
      this.setState({})
      this.setHeight()
    }.bind(this))
  }

  recentChats = (currentPage)=>{
    messageList(`${this.state.averagenum*(currentPage-1)},${this.state.averagenum}`).then(({data})=>{
      if (data.status == 200) {
        this.setState({
          items:data.data
        })
        if (data.data[0]) { 
          this.checkHistory(data.data[0].memberId,true)
        }
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

  changeTag =(index)=>{
    this.setState({
      tag:index
    })
    if (index == 1) { // 

    }else if (index == 2) { // 

    }else if (index == 3) { // 

    }
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
      document.onclick = function(){
      if (!this.state.showEmotion) return
        this.setState({
          showEmotion:false 
      })
   }.bind(this)

  }

  componentWillUnmount =()=>{
    document.onclick = null
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

    submitText(fd).then(({data}) => {
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
          this.setState({})
          this.setHeight()
          this.refs.text.innerHTML = ""
      }else{
          this.props.tipShow({type:"error",msg:"发送失败"})
      }
    }).then(()=>{
          this.refs.text.value = ''
          this.refs.text.focus()
    })
  }

  checkHistory =(sendTo,isTop)=>{
    if(typeof sendTo == "object")sendTo = ''
    getHistory({chatWith:sendTo,lastUpdate:this.lastUpdate || ''}).then(({data})=>{
        var data = data.data.reverse()

        if (data.length == 0) {
          this.props.tipShow({type:"error",msg:"没有更多的消息"})
          return
        };

        if (this.lastUpdate) {
          this.state.chatContent = data.concat(this.state.chatContent)
          this.setState({})
        }else{
          this.setState({
            chatContent:data
          })
        }
        
        var sendDate = new Date(data[0].time)
        if(data[0])this.lastUpdate = `${sendDate.getFullYear()}-${sendDate.getMonth()+1}-${sendDate.getDate()} ${sendDate.getHours()}:${sendDate.getMinutes()}:${sendDate.getSeconds()}`;
        if(isTop==true){
          this.setHeight()
        }
    })
  }

  setHeight=()=>{
    setTimeout(()=>{
            this.refs.contentBody.scrollTop = this.refs.contentBody.scrollHeight;
    },50)
  }

  changeChat =(e,index)=>{
    this.setState({
      msgIndex:index,
      chatContent:[]
    })
    this.lastUpdate = ""
    this.checkHistory(this.state.items[index].memberId,true)
  }

  render () {
    const num = new Array(100).fill(0)
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
                var isRead = item.active == '0'?'对方未读':'对方已读'
              }else{
                var isRead = item.active == '0'?'未读':'已读'
              }
              item.text = item.text.replace(/<img(.*)>/,"[图片]")
              return <li key={index} style={{background:this.state.msgIndex == index ? "#efefef" : "#fff"}} onClick={(e)=>this.changeChat(e,index)}>
                <div><img src={`/originImg?from=member&name=${item.memberId}`} width="40" alt="头像"/><strong><Link to={`/memberBrief/${item.memberId}`}>{item.nickname}</Link></strong></div>
                <div>
                  <ul>
                    <li><span style={{borderLeftColor:item.active == '0' ? 'green' : '#666',borderLeftWidth:'2px',borderLeftStyle:'solid',paddingLeft:"5px"}} className="lightColor">{isRead}</span><span className="lightColor pull-right smallFont">{time}</span></li>
                  </ul>
                </div>
              </li>
              })}
              </ul>
            </aside>
            <aside>
              <div className="chatrecent" ref="contentBody">
                  <p><a onClick={()=>this.checkHistory(this.state.items[this.state.msgIndex].memberId)}>查看更多...</a></p>
                  <div className="chat" ref="chat">
                  {this.state.chatContent.map((item,index)=>{
                     var date = new Date(item.time)
                     var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate() < 10 ? '0'+date.getDate() :date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}`
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
          {this.state.tag == 2 && <article>2222</article>}
          {this.state.tag == 3 && <article>3333</article>}
          </div>
       </div>
    </div>
    )
  }
}

myMessage.propTypes = {
  auth: React.PropTypes.object
}