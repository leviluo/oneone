import React, { Component, PropTypes } from 'react'
import './memberBrief.scss'
import {getSpecialities,memberInfo,followOne,followOutOne,getMyUpdates,addLike} from './modules/memberBrief'
import Helmet from 'react-helmet'
import {connect} from 'react-redux'
import {tipShow} from '../../components/Tips/modules/tips'
import ImageBrowser,{imgbrowserShow} from '../../components/ImageBrowser'
import Chat,{chatShow} from '../../components/Chat'
import Share from '../../components/Share'
import {Link} from 'react-router'

import {asyncConnect} from 'redux-async-connect'

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
   
  }
}])

@connect(
  state=>({auth:state.auth}),
{tipShow,imgbrowserShow,chatShow})
export default class MemberBrief extends Component{

  state = {
    specialities:[],
    memberInfo:[],
    pageIndex:1, //默认分页
    myUpdates:[],
    averagenum:10,
    currentPage:1
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentWillMount = ()=>{
      this.getData(this.state.currentPage)
      memberInfo(this.props.params.id).then(({data})=>{
        if (data.status==200) {
              this.setState({
                memberInfo:data.data[0]
              })
              this.refs.headImgUrl.src = `/originImg?from=member&name=${data.data[0].phone}`
          }else{
              this.props.tipShow({type:'error',msg:data.msg})
          }
      })
  }

  showThisImg =(index,works)=>{
    this.props.imgbrowserShow({currentChoose:index,imgs:works})
  }

  showChat =(name,phone)=>{
        if (!this.props.auth.phone) {
            this.props.tipShow({type:'error',msg:'您还未登录,请先登录'})
            return
        }
        if (phone == this.props.auth.phone) return
        this.props.chatShow({chatTo:name,chatFrom:this.props.auth.nickname,sendTo:phone})
    }

  followIt =()=>{
      if (!this.props.auth.phone) {
            this.props.tipShow({type:'error',msg:'您还未登录,请先登录'})
            return
        }
      followOne(this.state.memberInfo.id).then(({data})=>{
        if (data.status == 200) {
            this.state.memberInfo.fans = this.state.memberInfo.fans + 1
            this.state.memberInfo.isFollowed = 1
            this.setState({})
          }else if (data.status==600) {
            this.props.dispatch({type:"AUTHOUT"})
            this.context.router.push('/login')
          }{
            this.props.tipShow({type:'error',msg:data.msg})
          }
      })
  }

  followOut =()=>{
    if (!this.props.auth.phone) {
            this.props.tipShow({type:'error',msg:'您还未登录,请先登录'})
            return
        }
      followOutOne(this.state.memberInfo.id).then(({data})=>{
          if (data.status == 200) {
            this.state.memberInfo.fans = this.state.memberInfo.fans - 1
            this.state.memberInfo.isFollowed = 0
            this.setState({})
          }else if (data.status==600) {
            this.props.dispatch({type:"AUTHOUT"})
            this.context.router.push('/login')
          }{
            this.props.tipShow({type:'error',msg:data.msg})
          }
      })
  }

  checkBasic =(e)=>{
      this.refs.back.style.left = "2px"
      this.setState({
        pageIndex:0
      })
  }

  checkUpdate =(e)=>{
      this.refs.back.style.left = "92px"
      this.setState({
        pageIndex:1
      })
  }

  checkSpeciality =(e)=>{
      this.refs.back.style.left = "182px"
      this.setState({
        pageIndex:2
      })
      if (this.state.specialitiesLoaded) return;
      getSpecialities(this.props.params.id).then(({data})=>{
         if (data.status==200) {
              this.setState({
                specialities:data.data,
                specialitiesLoaded:true
              })
          }else{
              this.props.tipShow({type:'error',msg:data.msg})
          }
      })
  }

    // componentWillMount =()=>{ //正常进入页面可以直接获取到memberId
    //   if (this.props.auth.memberId)this.getData(this.state.currentPage)
    // }

    // componentWillReceiveProps=()=>{ //刷新时获取memberId
    //   if (this.props.auth.memberId)this.getData(this.state.currentPage)
    // }

    getData = (currentPage)=>{
       getMyUpdates(this.props.params.id,`${this.state.averagenum*(currentPage-1)},${this.state.averagenum}`).then(({data})=>{
        if (data.status == 200) {
          if (data.data.length < this.state.averagenum) {
                this.setState({
                    ifFull:true,
                    myUpdates:this.state.myUpdates.concat(data.data)
                })
            }else{
                this.setState({
                    myUpdates:this.state.myUpdates.concat(data.data)
                })
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
    if (this.state.ifFull) {
        this.props.tipShow({type:"error",msg:"亲,没有更多更新了"})
        return
    }
    this.setState({
        currentPage:this.state.currentPage + 1
    })
    this.getData(this.state.currentPage + 1)
  }

  like =(name)=>{
    if (!this.props.auth.memberId) {
        this.props.tipShow({type:"error",msg:"请先登录"})
        return
    }
    return addLike(name)
  }

  

  render(){
    const {sex,nickname,address,phone,brief} = this.state.memberInfo
    return(
      <div className="memberBrief">
      <Helmet title="名片" />
        <div className="memberBriefTop">
          <button className="btn-default" onClick={()=>window.history.go(-1)} href="javascript.void(0)">返回 <i className="fa fa-mail-reply"></i></button>
          <Share />
        </div>
        <div className="memberBriefContent">
            <div>
              <div>
                <img id="memberinfoHeadImg" ref="headImgUrl" />
              </div>
              <div className="follow">
                <span className="lightColor">关注</span>&nbsp;<strong><Link to={`/follows/${this.state.memberInfo.id}`}>{this.state.memberInfo.follows}</Link></strong>
                &nbsp;<span className="lightColor">粉丝</span>&nbsp;<strong><Link to={`/follows/${this.state.memberInfo.id}`}>{this.state.memberInfo.fans}</Link></strong>
                <div>
                {(!this.state.memberInfo.isFollowed && this.props.auth.memberId != this.state.memberInfo.id) && <button className="btn-default" onClick={this.followIt}>+关注</button>}
                {(this.state.memberInfo.isFollowed == 1 && this.props.auth.memberId != this.state.memberInfo.id) && <button className="btn-default" onClick={this.followOut}>取关</button>}
                {this.props.auth.memberId != this.state.memberInfo.id && <button className="btn-success" onClick={()=>this.showChat(nickname,phone)}>私信</button>}
                </div>
              </div>
            </div>

              <div className="nav">
                <div>
                <strong onClick={this.checkBasic}>基本资料</strong>
                <strong onClick={this.checkUpdate}>动态</strong>
                <strong onClick={this.checkSpeciality}>技能</strong>
                <button ref="back"></button>
                </div>
              </div>

              {this.state.pageIndex == 0 && <ul>
                <li><h3><hr /><span>性别</span></h3><p>{sex == 0 ? "男" : "女"}</p></li>
                <li><h3><hr /><span>昵称</span></h3><p>{nickname}</p></li>
                {brief && <li><h3><hr /><span>个人签名</span></h3><p>{brief}</p></li>}
                <li><h3><hr /><span>详细地址</span></h3><p>{address}</p></li>
              </ul>
              }

              {this.state.pageIndex == 1 && <div className="myUpdates">
                {this.state.myUpdates.length == 0 && <p style={{textAlign:"center"}}>暂时没有任何动态哦~</p>}
                {this.state.myUpdates.map((item,index)=>{
                  var date = new Date(item.createAt)
                  var works =[];
                  var imgs = item.works.split(',')
                  var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}`
                  return <div key={index} className="lists">
                      <img width="50" src={`/originImg?from=member&name=${item.phone}`} alt=""/>
                      {item.title && <div className="header"><span className="lightColor smallFont">{time}</span>&nbsp;&nbsp;&nbsp;在<Link to={`/organizationsHome/${item.organizationsId}`}>{item.organizationName}</Link>发布了<Link to={`/article/${item.articleId}`}>{item.title}({item.titleType})</Link></div>}
                      {item.works && <div>
                        <div className="header"><span className="lightColor smallFont">{time}</span>&nbsp;&nbsp;&nbsp;在<Link to={`/works/${item.memberSpecialityId}`}>{item.specialityName}</Link>上传了新照片</div>
                        <div className="photoLists">
                        {imgs.map((item,index)=>{
                          works.push(`/originImg?from=speciality&name=${item}`)
                          return <div key={index} onClick={(e)=>this.props.imgbrowserShow({currentChoose:index,imgs:works,likeFunc:this.like})} style={{backgroundImage:`url(/img?from=speciality&name=${item})`}}></div>
                        })}
                        <Link to={`/works/${item.memberSpecialityId}`}>查看更多...</Link>
                        </div>
                      </div>}
                  </div>
                })}
                {!this.state.ifFull && <p><button className="btn-addMore" onClick={this.addMore}>加载更多...</button></p>}
            </div>
              }

              {this.state.pageIndex == 2 && <div className="specialities">
              {this.state.specialities.length == 0 && <p style={{textAlign:"center"}}>暂时没有专长哦~</p>}
              {this.state.specialities.map((item,index)=>{
                        var linkPhotos = `/works/${item.id}`
                          return <ul key={index}>
                            <li><b>{item.speciality}</b></li>
                            <li><p>简介&nbsp;:&nbsp;</p>{item.brief}</li>
                            <li><p>经验&nbsp;:&nbsp;</p>{item.experience}</li>
                            {item.work && <li><span>作品集&nbsp;:&nbsp;</span><br/>
                              <div>
                             <ul>
                              {item.work.split(',').map((item,index)=>{
                                return <li key={index}><div style={{backgroundImage:`url(/img?name=${item}&from=speciality)`}}></div></li>
                              })}
                              <li><Link to={linkPhotos} >查看更多&gt;</Link></li>
                              </ul>
                              </div>
                            </li>}
                          </ul>
                      })}
                </div>}

            </div>

            <ImageBrowser />
            <Chat />
        </div>
      )
  }
}

