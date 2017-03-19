import React, {Component} from 'react'
import './myUpdates.scss'
import { connect } from 'react-redux'
import {Link} from 'react-router'
import {asyncConnect} from 'redux-async-connect'
import { tipShow } from '../../../../components/Tips/modules/tips'
import {getMyUpdates,addLike} from './modules'
import ImageBrowser,{imgbrowserShow} from '../../../../components/ImageBrowser'

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
  {tipShow,imgbrowserShow}
)

export default class myUpdates extends Component {

    state = {
      myUpdates:[],
      averagenum:10,
      currentPage:1
    }

    static contextTypes = {
      router: React.PropTypes.object.isRequired
    };

    componentWillMount =()=>{ //正常进入页面可以直接获取到memberId
      if (this.props.auth.memberId)this.getData(this.state.currentPage)
    }

    componentWillReceiveProps=()=>{ //刷新时获取memberId
      if (this.props.auth.memberId)this.getData(this.state.currentPage)
    }

    getData = (currentPage)=>{
      if (!this.props.auth.memberId) return
       getMyUpdates(this.props.auth.memberId,`${this.state.averagenum*(currentPage-1)},${this.state.averagenum}`).then(({data})=>{
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


  render () {
    return (
    <div className="myUpdates">
        {this.state.myUpdates.length == 0 && <div style={{textAlign:"center"}}>暂时没有任何动态哦~</div>}
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
    )
  }
}

myUpdates.propTypes = {
  auth: React.PropTypes.object
}
