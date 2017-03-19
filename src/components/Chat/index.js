import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom';
import {connect} from 'react-redux'
import {chatHide,submitText,submitImg,getHistory,chatShowAction} from './modules/chat'
import {imgbrowserShow} from '../ImageBrowser'
import './chat.scss'

@connect(
  state=>({chat:state.chat}),
{chatHide,imgbrowserShow})

export default class Chat extends Component{

  state = {
 
  }

  componentWillMount =()=>{
    
  }

  componentDidMount =(e)=>{
    // this.refs.text.focus()
    this.Chat = findDOMNode(this).getElementsByClassName('chat')[0]
    this.contentBody = findDOMNode(this).getElementsByClassName('content-body')[0]
  }

  componentWillReceiveProps =(nextProps)=>{
    //清空留言板
    var ele = findDOMNode(this).getElementsByClassName('chat')[0].getElementsByTagName('p')
    var num = ele.length
    for (var i = 0; i < num; i++) {
        ele[0].parentNode.removeChild(ele[0])
    }
    this.refs.text.value = '说些什么吧'

    setTimeout(()=>{  //定位输入焦点
    this.refs.text.focus()
    },10)
    this.lastUpdate = ''
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
    if (this.props.chat.isShow) {
      var ele = findDOMNode(this)
      var height = window.getComputedStyle(ele,null).height.slice(0,-2)
      var scrollTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop
      ele.style.top = scrollTop + document.body.clientHeight - height+'px'
      this.checkHistory(true)
    }else{
      this.hidechat()
    }
    // console.log("0000")
  }

  showchat =()=>{
    findDOMNode(this).setAttribute('class','showChat')
    findDOMNode(this).style.display = "block"
    var ele = findDOMNode(this) 
    window.onscroll = function (){
      var height = window.getComputedStyle(ele,null).height.slice(0,-2)
      var scrollTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop
      ele.style.top = scrollTop + document.body.clientHeight - height+'px'
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

  submitText =()=>{
    if (!/[^\t\r\n\s]/.test(this.refs.text.value)) {
      this.refs.text.focus()
      return //过滤只有制表符
    }
    if (this.refs.text.value.length > 280) {
      this.error('文本过长')
      return;
    }
    submitText({text:this.refs.text.value,sendTo:this.props.chat.sendTo}).then(({data}) => {
      if (data.status==200) {
          var date = new Date()
          var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}`
          var str = `<p class="sendFrom"><span class="name">${this.props.chat.chatFrom}&nbsp;:&nbsp;</span><span class="time">${time}</span><span class="text">${this.refs.text.value}</span></p>`
          this.Chat.innerHTML += str; 
          this.contentBody.scrollTop = this.contentBody.scrollHeight;
      }else{
          this.error('发送失败')
      }
    }).then(()=>{
          this.refs.text.value = ''
          this.refs.text.focus()
    })
  }

  error =(error)=>{
    this.setState({
      error:error
    })
    var _this = this;
    setTimeout(()=>{
      _this.setState({
      error:'',
      })
    },2000)
  }


  submitImage =(e)=>{
    // 判断文件类型
    var value = e.target.value
    var filextension=value.substring(value.lastIndexOf("."),value.length);
    filextension = filextension.toLowerCase();
    if ((filextension!='.jpg')&&(filextension!='.gif')&&(filextension!='.jpeg')&&(filextension!='.png')&&(filextension!='.bmp'))
    {
      this.error('文件类型不正确')
      return;
    }
    var file = e.target.files[0]
    var fd = new FormData(); 
    fd.append("file", file); 
    fd.append("sendTo",this.props.chat.sendTo)
    var me = this;
    submitImg(fd).then(({data}) => {
      if (data.status==200) {
            var reader = new FileReader();  
            reader.onload = function(e) {  
                var src = e.target.result;  
                var date = new Date() 
                var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}`
                var str = `<p class="sendFrom img"><span class="name">${me.props.chat.chatFrom}&nbsp;:&nbsp;</span><span class="time">${time}</span><img src="${src}"/></p>`
                me.Chat.innerHTML += str; 
                me.contentBody.scrollTop = me.contentBody.scrollHeight;
                me.addEvent()
            }  
            reader.readAsDataURL(file);  
      }else{
          this.error(data.msg)
      }
    })
  }

  checkHistory =(isTop)=>{
    getHistory({chatWith:this.props.chat.sendTo,lastUpdate:this.lastUpdate || ''}).then((response)=>{
        var data = response.data.data
        if (data.length == 0) {
          return
        };
        var str = ''
        for (var i = data.length-1; i >= 0; i--) {
              var date = new Date(data[i].time)
              var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}`
          if(data[i].send != this.props.chat.sendTo){ //我是发送者
            if (data[i].text) {
              str += `<p class="sendFrom"><span class="name">${this.props.chat.chatFrom}&nbsp;:&nbsp;</span><span class="time">${time}</span><span class="text">${data[i].text}</span></p>`
            }else{
              str += `<p class="sendFrom img"><span class="name">${this.props.chat.chatFrom}&nbsp;:&nbsp;</span><span class="time">${time}</span><img src="/img?from=chat&name=${data[i].imgUrl}"/></p>`
            }
          }else{
            if (data[i].text) {
              str += `<p class="sendTo"><span class="name">${this.props.chat.chatTo}&nbsp;:&nbsp;</span>&nbsp;<span class="time">${time}</span><span class="text">${data[i].text}</span></p>`
            }else{
              str += `<p class="sendTo img"><span class="name">${this.props.chat.chatTo}&nbsp;:&nbsp;</span>&nbsp;<span class="time">${time}</span><img src="/img?from=chat&name=${data[i].imgUrl}"/></p>`
            }
          }
        };
        if (this.lastUpdate) {
          this.Chat.innerHTML = str + this.Chat.innerHTML;
        }else{
          this.Chat.innerHTML = str
        }

        this.addEvent()

        var sendDate = new Date(data[data.length-1].time)
        if(data[data.length-1])this.lastUpdate = `${sendDate.getFullYear()}-${sendDate.getMonth()+1}-${sendDate.getDate()} ${sendDate.getHours()}:${sendDate.getMinutes()}:${sendDate.getSeconds()}`;
        if(isTop==true)this.contentBody.scrollTop = this.contentBody.scrollHeight;
    })
  }

  addEvent = ()=>{
    var el = this.contentBody.getElementsByTagName('img');
    for (var i = 0; i < el.length; i++) {
      el[i].onclick = this.showThisImg
    }
  }

  showThisImg =(e)=>{
    console.log(e.target.src)
    // alert("00")
    this.props.imgbrowserShow({currentChoose:0,imgs:[e.target.src.replace(/\/img\?/,'/originImg?')]})
  }

  render(){
    const{chatTo} = this.props.chat;
    return(
        <div id='chat'>
          <div className="content">
            <div className="content-header">
              <div className="close" onClick={this.hidechat}>×</div>
              <h3>{`与${chatTo}的对话`}</h3>
            </div>
            <div className="content-body">
                  <p><a onClick={this.checkHistory}>查看更多...</a></p>
                  <p style={{color:"red"}}>{this.state.error}</p>
                  <div className="chat"></div>
            </div>
            <div className="content-message">
                  <textarea rows="5" ref="text" defaultValue="说些什么吧"></textarea>
            </div>
            <div className="content-footer">
              <a className="fa fa-image"><input onChange={this.submitImage} type="file" /></a>
              <button className="btn-success" onClick={this.submitText}>发送</button>
            </div>
          </div>
        </div>
      )
  }
}


export const chatShow = chatShowAction