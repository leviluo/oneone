import React from 'react'
import Helmet from 'react-helmet'
import Banner from '../../../components/Banner'
import {Link,History} from 'react-router'
import {connect} from 'react-redux'
import {fetchCatelogue} from '../../../reducers/category'
import {asyncConnect} from 'redux-async-connect'

import { tipShow } from '../../../components/Tips/modules/tips'
import {getupdates,addLike} from '../modules'
import ImageBrowser,{imgbrowserShow} from '../../../components/ImageBrowser'

const imgItems = ["banner1.jpg","banner2.jpg","banner3.jpg","banner4.jpg","banner5.jpg"]
import './HomeView.scss'

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    const promises = [];
    
    if (!getState().catelogues.isloaded) 
    {
      promises.push(dispatch(fetchCatelogue()));
    }

    return Promise.all(promises);
  }
}])

@connect(state=>({
    catelogues:state.catelogues,
    mylocation:state.mylocation
}),{tipShow,imgbrowserShow})
export default class HomeView extends React.Component{

    state = {
      updates:[],
      averagenum:10,
      currentPage:1
    }

    // static contextTypes = {
    //   router: React.PropTypes.object.isRequired
    // };

    componentWillMount =()=>{ //正常进入页面可以直接获取到memberId
      if(this.props.mylocation.text[0]){
        this.getData(this.state.currentPage,this.props.mylocation.text[0])
      }
    }

    componentWillReceiveProps=(nextProps)=>{ //刷新时获取memberId
      if ((nextProps.mylocation.text[0] != this.props.mylocation.text[0]) && this.props.mylocation.text[0]) { //在变换城市时
        this.setState({
          updates:[],
        })
        this.getData(this.state.currentPage,nextProps.mylocation.text[0])
      }
      if(nextProps.mylocation.text[0] && !this.state.isloaded){
        this.setState({
          isloaded:true
        })
        this.getData(this.state.currentPage,nextProps.mylocation.text[0])
      }
    }

    getData = (currentPage,location)=>{
       getupdates(`${this.state.averagenum*(currentPage-1)},${this.state.averagenum}`,window.encodeURIComponent(location)).then(({data})=>{
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
        }else if (data.status==600) {
          this.props.dispatch({type:"AUTHOUT"})
          this.props.router.push('/login')
        }else{
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
        return <div className="home">
        <Helmet title='首页' />
        <div className="homeTop">
        	<div className="categoryContent">
            	<ul>{this.props.catelogues.text.map((item,index)=>{
                return <li key={index}><Link to={`/categories/${item.parentCatelogue}/0`}>{item.parentCatelogue}<span className="fa fa-angle-right"></span></Link><div className="categoryDetails"><ul>{item.childCatelogue.map((itemm,index)=>
                  <li key={index}><Link to={`/categories/${item.parentCatelogue}/${itemm}`}>{itemm}</Link></li>
                  )}</ul></div></li>
              })} 
            	</ul>
            </div>
        	<Banner items={imgItems}/>
        </div>
        <div className="updates">
            {this.state.updates.length == 0 && <div style={{textAlign:"center"}}>暂时没有任何动态哦~</div>}
            {this.state.updates.map((item,index)=>{
              var date = new Date(item.createAt)
              var works =[];
              var imgs = item.works.split(',')
              var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}`
              return <div key={index} className="lists">
                  <img width="50" src={`/originImg?from=member&name=${item.memberId}`} alt=""/>
                  {item.works && <div>
                    <div className="header"><span className="lightColor smallFont">{time}</span>&nbsp;&nbsp;&nbsp;<Link to={`/memberBrief/${item.memberId}`}>{item.nickname}</Link>在<Link to={`/works/${item.memberSpecialityId}`}>{item.specialityName}</Link>上传了新照片</div>
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
        <ImageBrowser />
      </div>
    }
}

