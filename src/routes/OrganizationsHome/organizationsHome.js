import React, { Component, PropTypes } from 'react'
import './organizationsHome.scss'
// import {getSpecialities} from './modules/memberBrief'
import Helmet from 'react-helmet'
import {connect} from 'react-redux'
import {getBasicInfo,attendOrganization,getMembers,quitOrganization,getArticleList} from './modules'
import {Link} from 'react-router'
// import {pageNavInit} from '../../components/PageNavBar/modules/pagenavbar'
import PageNavBar,{pageNavInit} from '../../components/PageNavBar'
import Modal,{modalShow,modalHide} from '../../components/Modal'
import Textarea from '../../components/Textarea'
import {tipShow} from '../../components/Tips'

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
  }

  componentWillUnmount =()=>{
    this.props.pageNavInit(null)
  }

  activityData = (currentPage)=>{
    return getArticleList(this.props.params.id,this.state.type,`${this.state.averagenum*(currentPage-1)},${this.state.averagenum}`).then(({data})=>{
      if (data.status == 200) { 
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
    averagenum:5,
    type:0, //文章类型
    verified:''
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
    attendOrganization({id:this.props.params.id,verified:this.state.verified}).then(({data})=>{
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
    quitOrganization(this.props.params.id).then(({data})=>{
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

  render(){
  	var headImg = this.state.BasicInfo.head ? `/originImg?name=${this.state.BasicInfo.head}&from=organizations` : ''
  	var date = new Date(this.state.BasicInfo.time)
    var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}` 
    var link = `/memberBrief/${this.state.BasicInfo.createById}`
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
                var headImg = `/originImg?from=member&name=${item.phone}`
                var link = `/memberBrief/${item.id}`
                return <Link to={link} key={index}>
                          <img src={headImg} width="30" alt="" />
                          {item.nickname}
                        </Link>
              })}
          </div>
      	</div>
        <Modal />
      </div>
      )
  }
}

