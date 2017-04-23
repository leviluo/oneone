import React, { Component, PropTypes } from 'react'
import './article.scss'
import {getArticle,submitReply,getArticleReply,deleteReply,deleteArticle} from './modules'
import Helmet from 'react-helmet'
import {connect} from 'react-redux'
// import {getBasicInfo,attendOrganization,getMembers,quitOrganization,getActivities} from './modules'
import {Link} from 'react-router'
import {tipShow} from '../../components/Tips'
import Confirm,{confirmShow} from '../../components/Confirm'
import {pageNavInit} from '../../components/PageNavBar/modules/pagenavbar'
import PageNavBar from '../../components/PageNavBar'
import ImageBrowser,{imgbrowserShow} from '../../components/ImageBrowser'
import Share from '../../components/Share'
import {asyncConnect} from 'redux-async-connect'

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
   
  }
}])
@connect(
  state=>({
    auth:state.auth,
    pagenavbar:state.pagenavbar
  }),
{tipShow,pageNavInit,imgbrowserShow,confirmShow})
export default class Article extends Component{

	state = {
    averagenum:1,
    articleData:[],
    replyData:[],
    isReply:false,
    replyToId:'',
    request:{}
	}

  componentWillMount =()=>{
    getArticle(this.props.params.id).then(({data})=>{
      if (data.status==200) {
        this.setState({
          articleData:data.data
        })
      }else{
        this.props.tipShow({type:"error",msg:data.msg})
      }
    })
    getArticleReply(this.props.params.id).then(({data})=>{
      if (data.status==200) {
        this.setState({
          replyData:data.data
        })
      }else{
        this.props.tipShow({type:"error",msg:data.msg})
      }
    })
  }



  reply =()=>{
    if (!this.props.auth.memberId) {
      this.props.tipShow({type:"error",msg:"请先登录"})
      return
    }
    var comment = this.refs.replyContent.value.trim()

    if (!comment || comment.length < 1 ||comment.length > 1000){
      this.props.tipShow({type:"error",msg:"回复在1 ~ 1000个字符"})
      return
    }
    if(this.state.request['reply'])return
    this.state.request['reply'] = true;
    submitReply({comment:comment,articleId:this.props.params.id,replyToId:this.state.replyToId}).then(({data})=>{
    this.state.request['reply'] = false;
         if (data.status==200) {
            getArticleReply(this.props.params.id).then(({data})=>{
              if (data.status==200) {
                this.setState({
                  replyData:data.data,
                  isReply:false,
                })
                this.refs.replyContent.value = ''
              }else{
                this.props.tipShow({type:"error",msg:data.msg})
              }
            })
          }else if (data.status==600) {
              this.props.dispatch({type:"AUTHOUT"})
              this.context.router.push('/login')
          }else{
            this.props.tipShow({type:'error',msg:data.msg})
          }
    })
  }

  goReply =(e)=>{
    if (!this.props.auth.memberId) {
      this.props.tipShow({type:"error",msg:"请先登录"})
      return
    }
    this.refs.replyContent.focus();
    this.setState({
      isReply:false,
      replyToId:'',
    })
  }

  replyTo =(e,index)=>{
    if (!this.props.auth.memberId) {
      this.props.tipShow({type:"error",msg:"请先登录"})
      return
    }
    this.setState({
      isReply:true,
      replyToId:this.state.replyData[index].id,
      replyToName:this.state.replyData[index].nickname,
      replyToComment:this.state.replyData[index].comment,
      link:`/memberBrief/${this.state.replyData[index].memberId}`
    })
  }

  deleteReply =(e,index)=>{
    if(this.state.request['deleteReply'])return
    this.state.request['deleteReply'] = true;
    deleteReply(this.state.replyData[index].id).then(({data})=>{
      this.state.request['deleteReply'] = false;
       if (data.status==200) {
            this.state.replyData.splice(index,1)
            this.setState({})
          }else if (data.status==600) {
              this.props.dispatch({type:"AUTHOUT"})
              this.context.router.push('/login')
          }else{
            this.props.tipShow({type:'error',msg:data.msg})
          }
    })
  }

  confirmDelete =()=>{
    if(this.state.request['confirmDelete'])return
    this.state.request['confirmDelete'] = true;
    deleteArticle(this.props.params.id).then(({data})=>{
       this.state.request['confirmDelete'] = false;
      if (data.status==200) {
        this.props.tipShow({type:"error",msg:"删除成功，2s后自动跳回上一页面"})
        setTimeout(()=>{
        window.history.go(-1)
        },2000)
        }else if (data.status==600) {
            this.props.dispatch({type:"AUTHOUT"})
            this.context.router.push('/login')
        }else{
            this.props.tipShow({type:"error",msg:data.msg})
      }
    })
  }

  deleteArticle =()=>{
     this.props.confirmShow({submit:this.confirmDelete})
  }

  render(){
    var headSrc = `/originImg?from=member&name=${this.state.articleData.memberId}`
    let link = `/memberBrief/${this.state.articleData.memberId}`
    var date = new Date(this.state.articleData.updatedAt)
    var time = `${date.getFullYear()} ${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}`
      return(
      <div id="article">
        <Helmet title="文章详情" />
        <div>
          <button className="btn-default" onClick={()=>window.history.go(-1)} href="javascript.void(0)">返回 <i className="fa fa-mail-reply"></i></button>
          <Share />
        </div>
        <div className="articleContent">
          <h3 dangerouslySetInnerHTML={{__html:this.state.articleData.title}}></h3>
          <div className="articleContentTop">
            <img src={headSrc} alt=""/>
            <div><span className="lightColor">来自于&nbsp;:&nbsp;</span><Link to={link}>{this.state.articleData.nickname}</Link><span className="lightColor">&nbsp;&nbsp;最后修改&nbsp;:&nbsp;</span>{time}</div>
            {this.state.articleData.memberId != this.props.auth.memberId && <span className="lightColor"><a className="pull-right" onClick={this.goReply}>回复</a></span>}{this.state.articleData.memberId == this.props.auth.memberId && <span className="operate"><Link to={`/postArticle/${this.props.params.id}/edit?id=${this.state.articleData.id}`}>编辑</Link><a onClick={this.deleteArticle}>删除</a></span>}
          </div>
          <div className="content" >
            <p dangerouslySetInnerHTML={{__html:this.state.articleData.content}}></p>
          </div>
          <span>回复区:&nbsp;&nbsp;</span>
          <div className="historyReplys">
            {this.state.replyData.map((item,index)=>{
              var headSrc = `/originImg?from=member&name=${item.memberId}`
              var link = `/memberBrief/${item.memberId}`
              if(item.replyTo){
                for (var i = 0; i < this.state.replyData.length; i++) {
                  if(this.state.replyData[i].id == item.replyTo){
                    var replyData = this.state.replyData[i]
                    var replyLink = `/memberBrief/${replyData.memberId}`
                  }
                }
                if(!replyData)replyData = {comment:"此消息已删除"}
              }
              var date = new Date(item.createdAt)
              var rtime = `${date.getFullYear()} ${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}`
              return <div key={index}>
                  {item.memberId != this.props.auth.memberId && <a className="pull-right" onClick={(e)=>this.replyTo(e,index)}>回复</a>}{item.memberId == this.props.auth.memberId && <a onClick={(e)=>this.deleteReply(e,index)} className="pull-right">删除</a>}
                  <img src={headSrc} alt="" />
                  <div><span>来自于&nbsp;:&nbsp;</span><Link to={link}>{item.nickname}</Link>&nbsp;&nbsp;<span className="smallFont">时间&nbsp;:&nbsp;{rtime}</span>{replyData && <p><span>回复</span>&nbsp;<Link to={replyLink}>{replyData.nickname}</Link><br /><span dangerouslySetInnerHTML={{__html:replyData.comment}}></span></p>}<p dangerouslySetInnerHTML={{__html:item.comment}}></p></div>
              </div>
            })}
            {this.state.replyData.length == 0 && <div>还没有人回复耶</div>}
          </div>
          <div className="reply">
            <span>回复</span>&nbsp;{this.state.isReply && <span><Link to={this.state.link}>{this.state.replyToName}</Link><p dangerouslySetInnerHTML={{__html:this.state.replyToComment}}></p> </span>}
            <textarea ref="replyContent" rows="5"></textarea><button className="btn-success" onClick={this.reply}>发送</button>
          </div>
        </div>
        <ImageBrowser />
        <Confirm />
      </div>
      )
  }
}

