import React, { Component, PropTypes } from 'react'
import './organization.scss'
// import {getSpecialities} from './modules/memberBrief'
import Helmet from 'react-helmet'
import {connect} from 'react-redux'
import {tipShow} from '../../components/Tips'
// import ImageBrowser,{imgbrowserShow} from '../../components/ImageBrowser'
import {OrganizationsSortByHot,getUpdates} from './modules'
import {Link} from 'react-router'
import PageNavBar,{pageNavInit} from '../../components/PageNavBar'
import ArticleUpdates from '../../components/ArticleUpdates'

@connect(
  state=>({
    auth:state.auth,
    // mylocation:state.mylocation,
    pagenavbar:state.pagenavbar
  }),
{tipShow,pageNavInit})
export default class MemberBrief extends Component{

  state = {
    organizations:[],
    updates:[],
    averagenum:10
  }

  componentWillMount =()=>{
    OrganizationsSortByHot().then(({data})=>{
      this.setState({
        organizations:data.data
      })
    })
    // if(this.props.mylocation.text[0]){
      this.props.pageNavInit(this.getData)
    // }
  }

  componentWillReceiveProps=(nextProps)=>{ //刷新时获取memberId
      // if ((nextProps.mylocation.text[0] != this.props.mylocation.text[0]) && this.props.mylocation.text[0]) {
      //   this.setState({
      //     updates:[]
      //   })
      // }
      // if(nextProps.mylocation.text[0] && !this.state.isloaded){
      //   this.setState({
      //     isloaded:true
      //   })
      //   this.props.pageNavInit(this.getData)
      // }
  }

  componentWillUnmount =()=>{
    this.props.pageNavInit(null)
  }

  getData = (currentPage)=>{
      return getUpdates(`${this.state.averagenum*(currentPage-1)},${this.state.averagenum}`).then(({data})=>{
        if (data.status == 200) {
                this.setState({
                    updates:data.data
                })
                return Math.ceil(data.count/this.state.averagenum)
            }
        else{
          this.props.tipShow({type:'error',msg:data.msg})
        }
      })
    }


  render(){
    console.log()
      return(
      <div className="organization">
        <Helmet title="社团中心" />
        <div className="organizationTop">
            <div>一一社团</div>
        </div>
        <div className="organizationContent">
            <div className="left">
                  <h3>最新活动</h3>
                  <div className="updates">
                      {this.state.updates.length == 0 && <div style={{textAlign:"center"}}>暂时没有任何动态哦~</div>}
                      {this.state.updates.map((item,index)=>{
                        return <ArticleUpdates key={index} items = {item} />
                      })}
                      <PageNavBar />
                  </div>
            </div>
            <div className="right">
                  <h3>最热社团</h3>
                  <div>
                  {this.state.organizations.map((item,index)=>{
                    var headImg = `/originImg?from=organizations&name=${item.head}`
                    var link = `/organizationsHome/${item.id}`
                    return <Link to={link} key={index}>
                              <img src={headImg} width="50" alt="" />
                              {item.name}
                            </Link>
                  })}
              </div>
            </div>
        </div>
      </div>
      )
  }
}

