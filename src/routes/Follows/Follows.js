import React, {Component} from 'react'
import './follows.scss'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import {Link} from 'react-router'
import {asyncConnect} from 'redux-async-connect'
import { tipShow } from '../../components/Tips/modules/tips'
import {getFollows,getFans,followOne,followOutOne} from './modules'
import Confirm,{confirmShow} from '../../components/Confirm'
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

export default class follows extends Component {

    componentWillMount=()=>{
      this.getFollowData(this.state.currentPage)
      // this.getFans(this.state.currentPage)
    }

    getFollowData =(currentPage)=>{
      // console.log(currentPage)
      getFollows(this.props.params.memberId,`${this.state.averagenum*(currentPage-1)},${this.state.averagenum}`).then(({data})=>{
        if (data.status == 200) {
           if (data.data.length < this.state.averagenum) {
                this.setState({
                    ifFull:true,
                    items:this.state.items.concat(data.data),
                })
            }else{
                this.setState({
                    items:this.state.worksData.concat(data.data)
                })
            }
        }else{
          this.props.tipShow({type:"error",msg:data.msg})
        }

      })
    }

    state = {
      averagenum:20,
      currentPage:1,
      items:[],
      addWho:this.getFollowData,
      // request:{}
    }

    getFanData =(currentPage)=>{
      getFans(this.props.params.memberId,`${this.state.averagenum*(currentPage-1)},${this.state.averagenum}`).then(({data})=>{
        if (data.status == 200) {
          if (data.data.length < this.state.averagenum) {
                this.setState({
                    ifFull:true,
                    items:this.state.items.concat(data.data),
                })
            }else{
                this.setState({
                    items:this.state.worksData.concat(data.data)
                })
            }
        }else{
          this.props.tipShow({type:"error",msg:data.msg})
        }
      })
    }

    checkFollows =(e)=>{
      this.refs.back.style.left = "2px"
      this.setState({
        currentPage:1,
        addWho:this.getFollowData,
        items:[]
      })
      this.getFollowData(1)
    }

    checkFans =(e)=>{
       this.refs.back.style.left = "42px"
       this.setState({
        currentPage:1,
        addWho:this.getFanData,
        items:[]
      })
      this.getFanData(1)
    }

    addMore =()=>{
      if (this.state.ifFull) {
        this.props.tipShow({type:"error",msg:"亲,没有更多了"})
        return
      }
      this.setState({
          currentPage:this.state.currentPage + 1
      })
      // console.log(this.state.addWho)
      this.state.addWho(this.state.currentPage + 1)
    }

    followIt =(e,id)=>{
      
      if (!this.props.auth.phone) {
            this.props.tipShow({type:'error',msg:'您还未登录,请先登录'})
            return
        }
      // if (this.state.request['followIt']) return
        // this.state.request['followIt'] = true
      this.props.loadingShow()
      followOne(id).then(({data})=>{
        this.props.loadingHide()
        // this.state.request['followIt'] = false
        if (data.status == 200) {
            // this.state.memberInfo.fans = this.state.memberInfo.fans + 1
            // this.state.memberInfo.isFollowed = 1
            // this.setState({})
            this.props.tipShow({type:'success',msg:"关注成功"})
          }else if (data.status==600) {
            this.props.dispatch({type:"AUTHOUT"})
            this.context.router.push('/login')
          }{
            this.props.tipShow({type:'error',msg:data.msg})
          }
      })
  }

  followOut =(e,id,index)=>{
    if (!this.props.auth.phone) {
            this.props.tipShow({type:'error',msg:'您还未登录,请先登录'})
            return
        }
      // if (this.state.request['followOut']) return
        // this.state.request['followOut'] = true
        this.props.loadingShow()
      followOutOne(id).then(({data})=>{
        this.props.loadingHide()
        // this.state.request['followOut'] = false
          if (data.status == 200) {
            this.state.items.splice(index,1)
            this.setState({})
          }else if (data.status==600) {
            this.props.dispatch({type:"AUTHOUT"})
            this.context.router.push('/login')
          }{
            this.props.tipShow({type:'error',msg:data.msg})
          }
      })
  }

  render () {
    return (
    <div className="follows">
          <Helmet title="关注列表" />
        <div className="followsTop">
          <button className="btn-default" onClick={()=>window.history.go(-1)} href="javascript.void(0)">返回 <i className="fa fa-mail-reply"></i></button>
        </div>
        <div className="switchBtn">
          <div>
            <strong onClick={this.checkFollows}>关注</strong>
            <button ref="back"></button>
            <strong onClick={this.checkFans}>粉丝</strong>
          </div>
        </div>
        <div className="items">
        {this.state.items.map((item,index)=>{
          return <div key={index}>
            <img src={`/originImg?from=member&name=${item.id}`} alt="头像"/>
            <ul>
              <li><Link to={`/memberBrief/${item.id}`}>{item.nickname}</Link>{(this.state.addWho == this.getFollowData && this.props.auth.memberId == this.props.params.memberId) && <a onClick={(e)=>this.followOut(e,item.id,index)} className="pull-right">取关</a>}{(this.state.addWho == this.getFanData && this.props.auth.memberId == this.props.params.memberId) && <a onClick={(e)=>this.followIt(e,item.id)} className="pull-right">+关注</a>}</li>
              <li><p>{item.brief}</p></li>
            </ul>
          </div>
        })}
        </div>
        {!this.state.ifFull && <p style={{clear:"both",textAlign:"center"}}>
              <button className="btn-addMore" onClick={this.addMore} >加载更多...</button>
        </p>}
    </div>
    )
  }
}

follows.propTypes = {
  auth: React.PropTypes.object
}
