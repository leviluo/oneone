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
    replyToId:''
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
    var comment = this.refs.replyContent.value
    if (!comment)return
    if (!this.props.auth.phone) {
      this.props.tipShow({type:"error",msg:"请先登录"})
      return
    }
    submitReply({comment:comment,articleId:this.props.params.id,replyToId:this.state.replyToId}).then(({data})=>{
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
    if (!this.props.auth.phone) {
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
    if (!this.props.auth.phone) {
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
    deleteReply(this.state.replyData[index].id).then(({data})=>{
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
    deleteArticle(this.props.params.id).then(({data})=>{
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
    var headSrc = `/originImg?from=member&name=${this.state.articleData.phone}`
    let link = `/memberBrief/${this.state.articleData.memberId}`
    var date = new Date(this.state.articleData.updatedAt)
    var time = `${date.getFullYear()} ${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}`
    var editLink = `/postArticle/${this.props.params.id}/edit`
      return(
      <div id="article">
        <Helmet title="文章详情" />
        <div>
          <button className="btn-default" onClick={()=>window.history.go(-1)} href="javascript.void(0)">返回 <i className="fa fa-mail-reply"></i></button>
          <Share />
        </div>
        <div className="articleContent">
          <h3>{this.state.articleData.title}</h3>
          <div className="articleContentTop">
            <img src={headSrc} alt=""/>
            <div><span className="lightColor">来自于&nbsp;:&nbsp;</span><Link to={link}>{this.state.articleData.nickname}</Link><span className="lightColor">&nbsp;&nbsp;最后修改&nbsp;:&nbsp;</span>{time}</div>
            {this.state.articleData.phone != this.props.auth.phone && <span className="lightColor"><a className="pull-right" onClick={this.goReply}>回复</a></span>}{this.state.articleData.phone == this.props.auth.phone && <span className="operate"><Link to={editLink} query={this.state.articleData}>编辑</Link><a onClick={this.deleteArticle}>删除</a></span>}
          </div>
          <div className="content" dangerouslySetInnerHTML={{__html:this.state.articleData.content}}>
          </div>
          <div className="attachedImgs">
          {this.state.articleData.attachedImgs && <div className="imgShow"><span className="lightColor">附图:&nbsp;&nbsp;</span>
          {this.state.articleData.attachedImgs.split(',').map((item,index)=>{
            if (!item) return;
            if (!this.imgs) {this.imgs = []}
            var url = `/originImg?from=article&name=${item}`
            this.imgs.push(url)
            return <div key={index} onClick={(e)=>this.props.imgbrowserShow({currentChoose:index,imgs:this.imgs})} style={{backgroundImage:`url(${url.replace(/\/originImg\?/,"/img?")})`}}></div>
              })}
          </div>
          }
          </div>
          <span>回复区:&nbsp;&nbsp;</span>
          <div className="historyReplys">
            {this.state.replyData.map((item,index)=>{
              var headSrc = `/originImg?from=member&name=${item.phone}`
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
                  {item.phone != this.props.auth.phone && <a className="pull-right" onClick={(e)=>this.replyTo(e,index)}>回复</a>}{item.phone == this.props.auth.phone && <a onClick={(e)=>this.deleteReply(e,index)} className="pull-right">删除</a>}
                  <img src={headSrc} alt="" />
                  <div><span>来自于&nbsp;:&nbsp;</span><Link to={link}>{item.nickname}</Link>&nbsp;&nbsp;<span>时间&nbsp;:&nbsp;</span>{rtime}{replyData && <p><span>回复</span>&nbsp;<Link to={replyLink}>{replyData.nickname}</Link><br />{replyData.comment}</p>}<p>{item.comment}</p></div>
              </div>
            })}
            {this.state.replyData.length == 0 && <div>还没有人回复耶</div>}
          </div>
          <div className="reply">
            <span>回复</span>&nbsp;{this.state.isReply && <span><Link to={this.state.link}>{this.state.replyToName}</Link><div>{this.state.replyToComment}</div> </span>}
            <textarea ref="replyContent" rows="5"></textarea><button className="btn-success" onClick={this.reply}>发送</button>
          </div>
        </div>
        <ImageBrowser />
        <Confirm />
      </div>
      )
  }
}

