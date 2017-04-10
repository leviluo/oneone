import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom';
import {connect} from 'react-redux'
import {chatHide,submitText,getHistory,chatShowAction} from './modules/chat'
import {imgbrowserShow} from '../ImageBrowser'
import './chat.scss'
import {tipShow} from '../Tips'
import socket from '../../socket'

@connect(
  state=>({
    chat:state.chat,
    auth:state.auth
  }),
{chatHide,imgbrowserShow,tipShow})

export default class Chat extends Component{

  state = {
    showEmotion:false,
    chatContent:[]
  }

  componentWillMount =()=>{
      var me = this
      socket.on('message',function(data){
        var date = new Date()
        var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate() < 10 ? '0'+date.getDate() :date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}`
        me.state.chatContent.push({
          time:time,
          text:data.text,
          sendTo:data.sendTo
        })
        me.setState({})
      })
  }

  sendMessage =()=>{
    
  }

  componentDidMount =(e)=>{
    this.Chat = this.refs.chat
    this.contentBody = this.refs.contentBody
  }

  componentWillReceiveProps =(nextProps)=>{
    //清空留言板
    this.refs.chat.innerHTML = ""
    if (nextProps.chat.sendTo) {
      this.lastUpdate = ''
      this.checkHistory(nextProps.chat.sendTo,true)
    }
  }

  shouldComponentUpdate =(nextProps,nextState)=>{
    if (nextProps.chat.isShow) {
      this.showchat();
    }else{
      return false
    }
      return true
  }

  componentDidUpdate =()=>{

  }

  showchat =()=>{
    findDOMNode(this).setAttribute('class','showChat')
    findDOMNode(this).style.display = "block"

    var ele = findDOMNode(this) 
    var height = window.getComputedStyle(ele,null).height.slice(0,-2)
    var scrollTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop
    ele.style.top = scrollTop + document.body.clientHeight - height+'px'

    window.onscroll = function (){
      var height = window.getComputedStyle(ele,null).height.slice(0,-2)
      var scrollTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop
      ele.style.top = scrollTop + document.body.clientHeight - height+'px'
      // ele.style.top = scrollTop +'px'
    }
  }

  hidechat =()=>{
    findDOMNode(this).setAttribute('class','')
    findDOMNode(this).style.display = "none"
    window.onscroll = null
    this.props.chatHide()
  }

  // static propTypes = {
  //   chatTo:React.PropTypes.string.isRequired,
  //   sendTo:React.PropTypes.string.isRequired,
  // }

// base64转为file
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

  submitText =()=>{

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
    fd.append('sendTo',this.props.chat.sendTo)

    submitText(fd).then(({data}) => {
      if (data.status==200) {
          var date = new Date()
          var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate() < 10 ? '0'+date.getDate() :date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}`
          // var str = `<p class="sendFrom"><span class="lightColor">${this.props.chat.chatFrom}&nbsp;:&nbsp;</span><span class="time">${time}</span><span class="text">${this.refs.text.value}</span></p>`
          // this.Chat.innerHTML += str; 
          this.state.chatContent.push({
            time:time,
            text:html,
            sendTo:this.props.chat.sendTo
          })
          this.setState({})
          this.contentBody.scrollTop = this.contentBody.scrollHeight;
          this.refs.text.innerHTML = ""
      }else{
          this.props.tipShow({type:"error",msg:"发送失败"})
      }
    }).then(()=>{
          this.refs.text.value = ''
          this.refs.text.focus()
    })
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

  checkHistory =(sendTo,isTop)=>{
    if(typeof sendTo == "object")sendTo = ''
    getHistory({chatWith:sendTo || this.props.chat.sendTo,lastUpdate:this.lastUpdate || ''}).then(({data})=>{
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
        if(isTop==true)this.contentBody.scrollTop = this.contentBody.scrollHeight;
    })
  }

  componentDidUpdate=()=>{
    this.contentBody.scrollTop = this.contentBody.scrollHeight;
  }

  addEvent = ()=>{
    var el = this.contentBody.getElementsByTagName('img');
    for (var i = 0; i < el.length; i++) {
      el[i].onclick = this.showThisImg
    }
  }

  showThisImg =(e)=>{
    this.props.imgbrowserShow({currentChoose:0,imgs:[e.target.src.replace(/\/img\?/,'/originImg?')]})
  }

  isEmotion = ()=>{
      this.setState({
        showEmotion:this.state.showEmotion ? false : true
      })
      this.insertContent()
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

  recordPoint = ()=>{
    this.saveRange()
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

  ifSend =(e)=>{
    if (e.keyCode == 13) {
      this.submitText()
    }
  }

  render(){
    const{chatTo} = this.props.chat;
    const num = new Array(100).fill(0)
    return(
        <div id='chat'>
          <div className="content">
            <div className="content-header">
              <div className="close" onClick={this.hidechat}>×</div>
              <h3>{`与${chatTo}的对话`}</h3>
            </div>
            <div className="content-body" ref="contentBody">
                  <p><a onClick={this.checkHistory}>查看更多...</a></p>
                  <p style={{color:"red"}}>{this.state.error}</p>
                  <div className="chat" ref="chat">
                  {this.state.chatContent.map((item,index)=>{
                     var date = new Date(item.time)
                     var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate() < 10 ? '0'+date.getDate() :date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}`
                     if(item.sendTo == this.props.chat.sendTo){
                       return <article className="sendFrom" key={index}>
                        <p className="text-center lightColor">{time}</p>
                        <p>{this.props.chat.chatFrom}<img className="head pull-right" width="30" src={`/originImg?from=member&name=${this.props.auth.memberId}`} /></p>
                        <p><span dangerouslySetInnerHTML={{__html:item.text}}></span></p>
                       </article>
                     }else{
                        return <article className="sendTo" key={index}>
                        <p className="text-center lightColor">{time}</p>
                        <p><img width="30" className="head pull-left" src={`/originImg?from=member&name=${this.props.chat.sendTo}`} />{this.props.chat.chatTo}</p>
                        <p><span dangerouslySetInnerHTML={{__html:item.text}}></span></p>
                       </article>
                     }
                  })}
                  </div>
            </div>
            <div className="content-message">
              <div contentEditable="true" ref="text" onKeyUp={this.recordPoint} onKeyUp={this.ifSend} onClick={this.recordPoint} >
              </div>
            </div>
            <div className="content-footer">
              <strong>
                  <a className="fa fa-smile-o" onClick={this.isEmotion}></a>
                  {this.state.showEmotion && <div>
                    {num.map((item,index)=>
                      <div key={index} onClick={(e)=>this.chooseEmotion(e,index)}>
                        <img src={`https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${index}.gif`} />
                      </div>)}
                  </div>}
              </strong>
              &nbsp;
              <strong><a className="fa fa-image" onClick={()=>{this.refs.imageInput.click()}}></a></strong>
              <input onChange={this.insertImage} ref="imageInput" type="file" style={{display:"none"}}/>
              <button className="btn-success" onClick={this.submitText}>发送</button>
            </div>
          </div>
        </div>
      )
  }
}


export const chatShow = chatShowAction