import React, {Component} from 'react'
import './photoList.scss'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import {Link} from 'react-router'
import {asyncConnect} from 'redux-async-connect'
import { tipShow } from '../../components/Tips/modules/tips'
import {getworksData,addLike,deletePhoto,getMemberInfo,getMoreLikeMembers} from './modules'
import Confirm,{confirmShow} from '../../components/Confirm'
import Share from '../../components/Share'
import loading from './asset/loading2.gif'
import {loadingShow,loadingHide} from '../../components/Loading'

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    // const promises = [];
    // if (!getState().catelogues.isloaded) {
    //   promises.push(dispatch(fetchCatelogue()));
    // }
    // return Promise.all(promises);
  }
}])

@connect(
  state => ({
    auth:state.auth,
    }),
  {tipShow,confirmShow,loadingShow,loadingHide}
)

export default class photoList extends Component {

    state = {
      worksData:[],
      averagenum:15,
      memberInfo:[],
      page:1,
      likeMembers:[],
      isMemberFull:false
      // request:{}
    }

    static contextTypes = {
      router: React.PropTypes.object.isRequired
    };

    componentWillMount =()=>{
     getMemberInfo(this.props.params.memberSpecialityId).then(({data})=>{
        if (data.status == 200) {
            this.setState({
                memberInfo:data.data[0]
            })
        }else{
          this.props.tipShow({type:'error',msg:data.msg})
        }
     })
    this.worksData(this.props.params.worksId,this.state.averagenum).then((data)=>{
            for (var i = 0; i < data.length; i++) {
              if(data[i].id == this.props.params.worksId){
                // console.log(data)
                  this.setState({
                      currentLargePhoto:i,
                      worksData:data
                  })
                break
              }
            }
        })
    }

    worksData = (worksId,limits,direction)=>{
      // console.log(direction)
      return getworksData(this.props.params.memberSpecialityId,worksId,limits,direction).then(({data})=>{
        if (data.status == 200) {
            return data.data
        }else{
          this.props.tipShow({type:'error',msg:data.msg})
        }
      })
  }

  addLike =(e,id)=>{
    if (!this.props.auth.memberId) {
        this.props.tipShow({type:"error",msg:"请先登录"})
        return
    }
    addLike(id).then(({data})=>{
        if (data.status == 200) {
          if(this.state.worksData[this.state.currentLargePhoto].isLiked){
            this.state.worksData[this.state.currentLargePhoto].isLiked = 0;
            this.state.worksData[this.state.currentLargePhoto].likes = this.state.worksData[this.state.currentLargePhoto].likes - 1;
          }else{
            this.state.worksData[this.state.currentLargePhoto].isLiked = 1;
            this.state.worksData[this.state.currentLargePhoto].likes = this.state.worksData[this.state.currentLargePhoto].likes + 1;
          }
          this.setState({})
        }else if (data.status==600) {
          this.props.dispatch({type:"AUTHOUT"})
          this.context.router.push('/login')
        }{
          this.props.tipShow({type:'error',msg:data.msg})
        }
    })
  }

  deletePhoto =(e,id,name)=>{
    this.setState({
        deleteId:id,
        deleteWork:name
    })
    this.props.confirmShow({submit:this.confirmDelete})
  }

  confirmDelete =()=>{
    // if (this.state.request['confirmDelete']) return
        // this.state.request['confirmDelete'] = true
      this.props.loadingShow()
    deletePhoto(this.state.deleteId,this.state.deleteWork).then(({data})=>{
      this.props.loadingHide()
        // this.state.request['confirmDelete'] = false
        if (data.status == 200) {
          this.state.worksData.splice(this.state.currentLargePhoto,1)
          this.setState({})
        }else if (data.status==600) {
          this.props.dispatch({type:"AUTHOUT"})
          this.context.router.push('/login')
        }{
          this.props.tipShow({type:'error',msg:data.msg})
        }
    })
  }

  pageUp = ()=>{
    if (this.state.currentLargePhoto == 0) {

      if (this.state.isFull) {
        this.props.tipShow({type:"error",msg:"已经是第一张了"})
        return
      }

      this.refs.preImg.src = loading

      this.worksData(this.state.worksData[0].id,`1,1`,1).then((data)=>{
        if (data.length == 0) {
          this.props.tipShow({type:"error",msg:"已经是第一张了"})
          this.setState({
            isFull:true
          })
          this.refs.preImg.src = `/originImg?from=speciality&name=${this.state.worksData[this.state.currentLargePhoto].name}`
          return
        }
        this.state.worksData.pop()
        this.state.worksData.unshift(data[0])
        this.setState({
          isFull:false,
          isMemberFull:false
        })
      });

      return
    }
    this.setState({
      currentLargePhoto: this.state.currentLargePhoto - 1,
      isFull:false
    })
  }

  go =(e,index)=>{
    this.refs.preImg.src = loading
    this.setState({
      currentLargePhoto: index,
       isMemberFull:false
    })
  }



  pageDown = ()=>{
    if (this.state.currentLargePhoto == (this.state.worksData.length -1)) {
      if (this.state.isFull) {
        this.props.tipShow({type:"error",msg:"已经是最后一张了"})
        return
      }
    this.refs.preImg.src = loading
      this.worksData(this.state.worksData[this.state.currentLargePhoto].id,`1,1`).then((data)=>{
        if (data.length == 0) {
          this.props.tipShow({type:"error",msg:"已经是最后一张了"})
          this.setState({
            isFull:true
          })
          this.refs.preImg.src = `/originImg?from=speciality&name=${this.state.worksData[this.state.currentLargePhoto].name}`
          return
        }
        this.state.worksData.shift()
        this.state.worksData.push(data[0])
        this.setState({isFull:false})
      });
      return
    }
    this.setState({
      currentLargePhoto: this.state.currentLargePhoto + 1,
      isFull:false,
      isMemberFull:false
    })
  }

  getMoreLikeMembers =(e)=>{
    this.isShowOperate(e)
    if(this.state.likeMembers.length == 0 && this.state.page == 1)this.addMore(this.state.page)
  }

  addMore =(p)=>{
    getMoreLikeMembers(this.state.worksData[this.state.currentLargePhoto].id,`${this.state.averagenum*(p-1)},${this.state.averagenum}`).then(data=>{
        if (data.status == 200) {
          if (data.data.length < this.state.averagenum) {
            this.setState({
              isMemberFull:true
            })
          }
          if (p==1) {
            this.setState({
              likeMembers:data.data
            })
          }else{
            this.setState({
              likeMembers:this.state.likeMembers.concat(data.data)
            })
          }
        }else{
          this.props.tipShow({type:"error",msg:data.msg})
        }
    })
    this.setState({
      page:this.state.page + 1
    })
  }

  isShowOperate=(e)=>{
    if (!e.target.getElementsByTagName('ul')[0]) return
    if (e.target.getElementsByTagName('ul')[0].style.display=="block") {
      e.target.getElementsByTagName('ul')[0].style.display="none"
    }else{
      e.target.getElementsByTagName('ul')[0].style.display="block"
    }
  }

  render () {
     if (this.state.worksData.length > 0) {
      var time = this.state.worksData[this.state.currentLargePhoto].createdAt.DateFormat("yyyy-MM-dd hh:mm")
    }
    return (
    <div className="photoList">
    <Helmet title={`${this.state.memberInfo.name}•作品集`} />
    <div>
          <button className="btn-default" onClick={()=>window.history.go(-1)} href="javascript.void(0)">返回 <i className="fa fa-mail-reply"></i></button>
          <Share />
    </div>
    <div className="memberInfo">
        {this.state.memberInfo.memberId && <img src={`/originImg?from=member&name=${this.state.memberInfo.memberId}`} alt="" />}
        <div>
            <span className="lightColor">来自</span>&nbsp;<strong><Link to={`/memberBrief/${this.state.memberInfo.memberId}`}>{this.state.memberInfo.nickname}</Link>•{this.state.memberInfo.name}</strong>&nbsp;<span className="lightColor">的作品集</span> 
        </div>
        {this.state.worksData.length > 0 && <div>
            <span className="lightColor">上传时间:&nbsp;{time}&nbsp;{this.props.auth.memberId == this.state.memberInfo.memberId && <button onClick={this.isShowOperate} className="btn-default operate">▼<ul><li onClick={(e)=>this.deletePhoto(e,this.state.worksData[this.state.currentLargePhoto].id,this.state.worksData[this.state.currentLargePhoto].name)}>删除</li></ul></button>}</span>
            <span className="like"><span onClick={(e)=>this.addLike(e,this.state.worksData[this.state.currentLargePhoto].id)} className={`lightColor ${this.state.worksData[this.state.currentLargePhoto].isLiked ? 'liked' : ''}`}><i className="fa fa-heart"></i>&nbsp;{this.state.worksData[this.state.currentLargePhoto].likes}</span>
            {this.state.worksData[this.state.currentLargePhoto].likeMembers.length == 5 && <button onClick={this.getMoreLikeMembers} className="btn-default operate likeMembers">•••<ul>{this.state.likeMembers.map((item,index)=><li key={index}><Link to={`/memberBrief/${item.memberId}`}><img src={`/originImg?from=member&name=${item.memberId}`} alt="头像" /></Link></li>)}{!this.state.isMemberFull && <div className="loadingmore" onClick={()=>this.addMore(this.state.page)}>加载更多</div>}</ul></button>}
            {this.state.worksData[this.state.currentLargePhoto].likeMembers.reverse().map((item,index)=>{
                return <Link key={index} to={`/memberBrief/${item.memberId}`}><img src={`/originImg?from=member&name=${item.memberId}`} alt="头像" /></Link>
            })}
            </span>
          </div>
        }
    </div>
    {this.state.worksData.length > 0 && <div className="largePhoto">
        <div onClick={this.pageUp}>&lt;</div>
        <img ref="preImg" src={`/originImg?from=speciality&name=${this.state.worksData[this.state.currentLargePhoto].name}`} alt="" />
        <div onClick={this.pageDown}>&gt;</div>
    </div>}
    <div className="photoBoard">
      <div className="pageUp" onClick={this.pageUp} >&lt;</div>
      {this.state.worksData.map((item,index)=>{
        if(index == this.state.currentLargePhoto){
          var color = "#ff7f00"
        }else{
          var color = "#efefef"
        }
        var date = new Date(item.createdAt)
        var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}` 
        return <div onClick={(e)=>this.go(e,index)} key={index} style={{backgroundImage:`url(/img?from=speciality&name=${item.name})`,border:`2px solid ${color}`}} className="imgShows"></div>
      })}
      <div className="pageDown" onClick={this.pageDown} >&gt;</div>
    </div>
    <Confirm />
    </div>
    )
  }
}

photoList.propTypes = {
  auth: React.PropTypes.object
}
