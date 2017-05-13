import React, {Component} from 'react'
import './updates.scss'
import { connect } from 'react-redux'
import {Link} from 'react-router'
import {asyncConnect} from 'redux-async-connect'
import { tipShow } from '../../../../components/Tips/modules/tips'
import {getupdates,addLike} from './modules'
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

export default class updates extends Component {

    state = {
      updates:[],
      averagenum:5,
      currentPage:1,
      // request:{}
    }

    static contextTypes = {
      router: React.PropTypes.object.isRequired
    };

    componentWillMount =()=>{ //正常进入页面可以直接获取到memberId
      
      if (this.props.auth.memberId)this.getData(this.state.currentPage,this.props.auth.memberId,this.props.params.type)
    }

    componentWillReceiveProps=(nextProps)=>{ //刷新时获取memberId
      this.setState({
        updates:[],
      })
      if (nextProps.auth.memberId)this.getData(this.state.currentPage,nextProps.auth.memberId,nextProps.params.type)
    }

    getData = (currentPage,id,type)=>{

      getupdates(`${this.state.averagenum*(currentPage-1)},${this.state.averagenum}`,id,type).then(({data})=>{

      // this.state.request['getData'] = false;
        if (data.status == 200) {
          if (data.data.length < this.state.averagenum) {
                this.setState({
                    ifFull:true,
                    updates:this.state.updates.concat(data.data)
                })
            }else{
                this.setState({
                    updates:this.state.updates.concat(data.data)
                })
            }
        }else if (data.status==600){
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
    <div id="updates">
        {this.state.updates.length == 0 && <div style={{textAlign:"center"}}>暂时没有任何动态哦~</div>}
        {this.state.updates.map((item,index)=>{
          var time = item.createAt.DateFormat("yyyy-MM-dd hh:mm")
          return <div key={index} className="lists">
              <img width="50" src={`/originImg?from=member&name=${item.memberId}`} alt=""/>
              {item.type == "article" && <div className="header pull-left"><span className="lightColor smallFont">{time}</span>&nbsp;&nbsp;&nbsp;在<Link to={`/organizationsHome/${item.list[0].organizationsId}`}>{item.list[0].organizationsName}</Link>发布了<Link to={`/article/${item.list[0].articleId}`}>{item.list[0].title}({item.list[0].titleType})</Link></div>}
              {item.type == "image" && <div>
                <div className="header">&nbsp;&nbsp;<span className="lightColor smallFont">{time}</span>&nbsp;&nbsp;&nbsp;在<Link to={`/works/${item.list[0].memberSpecialityId}`}>{item.list[0].specialityName}</Link>上传了新照片</div>
                <div className="photoLists">
                {item.list.map((item,index)=>{
                  if (index >= 8) return
                  return <div key={index} onClick={(e)=>this.props.imgbrowserShow({currentChoose:index,imgs:works,likeFunc:this.like})} style={{backgroundImage:`url(/img?from=speciality&name=${item.workName})`}}></div>
                })}
                {item.list.length > 8 && <a style={{backgroundImage:`url(/img?from=speciality&name=${item.list[8].workName})`,cursor:"auto"}}>+{item.list.length - 8}</a>}
                </div>
              </div>}
          </div>
        })}
        {!this.state.ifFull && <p><button className="btn-addMore" onClick={this.addMore}>加载更多...</button></p>}
    </div>
    )
  }
}

updates.propTypes = {
  auth: React.PropTypes.object
}
