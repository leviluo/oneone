import React, { Component, PropTypes } from 'react'
import './organizationsHome.scss'
// import {getSpecialities} from './modules/memberBrief'
import Helmet from 'react-helmet'
import {connect} from 'react-redux'
import {getBasicInfo,attendOrganization,getMembers,quitOrganization,getArticleList,submitText,getHistory} from './modules'
import {Link} from 'react-router'
// import {pageNavInit} from '../../components/PageNavBar/modules/pagenavbar'
import PageNavBar,{pageNavInit} from '../../components/PageNavBar'
import Modal,{modalShow,modalHide} from '../../components/Modal'
import Textarea from '../../components/Textarea'
import {tipShow} from '../../components/Tips'
import socket,{initGroupChat,leaveGroupChat} from '../../socket'

@connect(
  state=>({
    auth:state.auth,
    pagenavbar:state.pagenavbar
  }),
{tipShow,pageNavInit,modalHide,modalShow})
export default class OrganizationsHome extends Component{


  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentWillMount =()=>{
    getBasicInfo(this.props.params.id).then(({data})=>{
      this.setState({
        BasicInfo:data.data[0]
      })
    })
    this.props.pageNavInit(this.activityData)
    getMembers(this.props.params.id).then(({data})=>{
      for (var i = 0; i < data.data.length; i++) {
        if(data.data[i].id == this.props.auth.memberId){
          this.setState({
            isAttended:true,
            Members:data.data
          })
          return
        }
      }
      this.setState({
        isAttended:false,
        Members:data.data
      })
    })

    // 加入群聊
    initGroupChat(this.props.params.id)

    var me = this
    socket.on('groupMessage',function(data){
        var date = new Date()
        var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate() < 10 ? '0'+date.getDate() :date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}`
        me.state.chatContent.push({
          time:time,
          text:data.text,
          sendFrom:data.sendFrom,
          nickname:data.nickname
        })
        me.setState({})
    })
    this.checkHistory()
  }


  componentWillUnmount =()=>{
    // 离开群聊
    leaveGroupChat(this.props.params.id)
    this.props.pageNavInit(null)
  }

  activityData = (currentPage)=>{
    return getArticleList(this.props.params.id,this.state.type,`${this.state.averagenum*(currentPage-1)},${this.state.averagenum}`).then(({data})=>{
      if (data.status == 200) { 
        console.log(data.data)
      this.setState({
          Activities:data.data
        })
      return Math.ceil(data.count/this.state.averagenum)
      }else{
       this.props.tipShow({type:'error',msg:data.msg})
      }
    })
  }

	state = {
		BasicInfo:[],
    Members:[],
    Activities:[],
    averagenum:10,
    type:0, //文章类型
    verified:'',
    request:{},
    chatContent:[],
    showEmotion:false
	}

  attendOrganization =()=>{
    if (!this.props.auth.memberId) {
      this.props.tipShow({type:"error",msg:"尚未登录"})
      return
    }

    var content = <Textarea header="请填写认证信息" handleTextarea = {this.verified} rows="10" />
    this.props.modalShow({header:"发送入社请求",content:content,submit:this.submitAttend})
  }

  verified = (e)=>{
    this.setState({
      verified:e.target.value
    })
  }

  submitAttend = ()=>{
    if (this.state.verified.length > 297) {
        this.props.tipShow({type:"error",msg:"认证信息不能超过300个字符"})
        return
    }
    this.props.modalHide()
    if (this.state.request['submitAttend']) return
        this.state.request['submitAttend'] = true
    attendOrganization({id:this.props.params.id,verified:this.state.verified}).then(({data})=>{
       this.state.request['submitAttend'] = false
      if (data.status == 200) {
        this.props.tipShow({type:"error",msg:"发送请求成功,等待管理员审核"})
      }else{
          this.props.tipShow({type:"error",msg:data.msg})
          return
      }
    })
  }



  quitOrganization =()=>{
    if (!this.props.auth.memberId) {
      this.props.tipShow({type:"error",msg:"尚未登录"})
      return
    }
    if (this.state.request['quitOrganization']) return
        this.state.request['quitOrganization'] = true
    quitOrganization(this.props.params.id).then(({data})=>{
       this.state.request['quitOrganization'] = false
      if (data.status == 200) {
          this.setState({
            isAttended:false
          })
      }else{
          this.props.tipShow({type:"error",msg:data.msg})
          return
      }
    })
  }

  postArticle = (e) =>{
    if (!this.state.isAttended && (this.props.auth.memberId != this.state.BasicInfo.memberId)) {
      console.log(this.props.tipShow)
      this.props.tipShow({type:"error",msg:"请先加入这个社团才能发帖"})
      return
    }
    this.context.router.push(`/postArticle/${this.props.params.id}/post`)
  }

  changeType =(e,type) =>{
    if (type == this.state.type)return;
    var elm = e.target.parentNode.getElementsByTagName('a');
    for (var i = elm.length - 1; i >= 0; i--) {
      elm[i].style.color = "#37a"
      elm[i].style.background = "#fff"
    };
    e.target.style.color = "#fff"
    e.target.style.background = "#37a"
    this.setState({
      type:type,
    })
    this.props.pageNavInit(this.activityData)
  }

  isEmotion = ()=>{
    // console.log("0000")
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
       var selection,range = window._range;
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

    if (!this.props.auth.memberId) {
      this.props.tipShow({type:"error",msg:"登录后才能发言"})
      return
    }

    if (!this.state.isAttended) {
      this.props.tipShow({type:"error",msg:"请先加入这个社团才能发言"})
      return
    }

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
    fd.append('sendTo',this.props.params.id)

    submitText(fd).then(({data}) => {
      if (data.status==200) {
          this.refs.text.innerHTML = ""
      }else{
          this.props.tipShow(type:"error",msg:data.msg)
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

  checkHistory =(sendTo)=>{
    if(typeof sendTo == "object")sendTo = ''
    getHistory({organizationsId:this.props.params.id,lastUpdate:this.lastUpdate || ''}).then(({data})=>{
        var data = data.data.reverse()

        if (data.length == 0) {
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
    })
  }

  componentDidUpdate =()=>{
    this.refs.contentBody.scrollTop = this.refs.contentBody.scrollHeight;
  }
   
  render(){
  	var headImg = this.state.BasicInfo.head ? `/originImg?name=${this.state.BasicInfo.head}&from=organizations` : ''
  	var date = new Date(this.state.BasicInfo.time)
    var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}` 
    var link = `/memberBrief/${this.state.BasicInfo.createById}`
    const num = new Array(100).fill(0)
      return(
      <div className="organizationHome">
        <Helmet title="社团" />
        <div className="BasicInfo">
        <div className="BasicInfoTop">
        <button className="btn-default" onClick={()=>window.history.go(-1)} href="javascript.void(0)">返回 <i className="fa fa-mail-reply"></i></button>
        </div>
        <div className="BasicInfoContent">
          <div className="head">
            <img src={headImg} alt=""/>
            <span>{this.state.BasicInfo.name}</span>
            {(!this.state.isAttended && (this.props.auth.memberId != this.state.BasicInfo.memberId)) && <button className="btn-default" onClick={this.attendOrganization} >加入社团</button>}
            {(this.state.isAttended && (this.props.auth.memberId != this.state.BasicInfo.memberId)) && <button className="btn-default" onClick={this.quitOrganization} >退出社团</button>}
          </div>

          <div className="content">
            <div>创建于: <span>{time}</span>&nbsp;团长:&nbsp;<Link to={link}>{this.state.BasicInfo.nickname}</Link></div>
            {this.state.BasicInfo.brief}
          </div>

          <div className="articleTop">
             <span><a onClick={(e)=>this.changeType(e,0)}>活动</a>&nbsp;/&nbsp;<a onClick={(e)=>this.changeType(e,1)}>咨询</a></span>
             <button className="btn-default" onClick={this.postArticle}><i className="fa fa-edit"></i>发布</button>
          </div>
          
          <table className="articleList">
            <thead>
              <tr>
                <td>标题</td>
                <td>最后更新时间</td>
                <td>发布者</td>
              </tr>
            </thead>
            <tbody>
            {this.state.Activities.map((item,index)=>{
              var date = new Date(item.updatedAt)
              var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}`
              var linkMember = `/memberBrief/${item.memberId}`
              var linkArticle = `/article/${item.id}`
                return <tr key={index}>
                  <td><Link to={linkArticle}>{item.title}</Link></td>
                  <td>{time}</td>  
                  <td><Link to={linkMember}>{item.publisher}</Link></td>
                </tr>
            })}
            </tbody>
          </table>
          {this.state.Activities.length == 0 && <span>还没有发布任何东西耶~</span>}
          <PageNavBar />
         </div>
        </div>

        <div className="members">
          <div>加入会员</div>
          <div>
              {this.state.Members.map((item,index)=>{
                var headImg = `/originImg?from=member&name=${item.id}`
                var link = `/memberBrief/${item.id}`
                return <Link to={link} key={index}>
                          <img src={headImg} width="30" alt="" />
                          {item.nickname}
                        </Link>
              })}
          </div>
        </div>

      	<div className="groupChat">
  				<div>群聊</div>
          <article>
            <div className="content-body" ref="contentBody">
                  <div><a onClick={this.checkHistory}>查看更多...</a></div>
                  <p style={{color:"red"}}>{this.state.error}</p>
                  <div className="chat" ref="chat">
                  {this.state.chatContent.map((item,index)=>{
                     var date = new Date(item.time)
                     var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate() < 10 ? '0'+date.getDate() :date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}`
                     if(item.sendFrom == this.props.auth.memberId){
                       return <article className="sendFrom" key={index}>
                        <p className="text-center lightColor">{time}</p>
                        <p>{this.props.auth.nickname}<img className="head pull-right" width="30" src={`/originImg?from=member&name=${this.props.auth.memberId}`} /></p>
                        <p><span dangerouslySetInnerHTML={{__html:item.text}}></span></p>
                       </article>
                     }else{
                        return <article className="sendTo" key={index}>
                        <p className="text-center lightColor">{time}</p>
                        <p><img width="30" className="head pull-left" src={`/originImg?from=member&name=${item.sendFrom}`} />{item.nickname}</p>
                        <p><span dangerouslySetInnerHTML={{__html:item.text}}></span></p>
                       </article>
                     }
                  })}
                  </div>
            </div>
            <div className="content-message">
              <div contentEditable="true" ref="text" onKeyUp={this.recordPoint} onClick={this.recordPoint} >
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
          </article>
      	</div>

        <Modal />
      </div>
      )
  }
}

