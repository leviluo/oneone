import React, { Component, PropTypes } from 'react'
import './queryResult.scss'
import Helmet from 'react-helmet'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import Select from '../../components/Select'
import {query} from './modules'
import PageNavBar,{pageNavInit} from '../../components/PageNavBar'
import {tipShow} from '../../components/Tips'

const optionsItems = [{key:1,value:"用户"},{key:2,value:"社团"},{key:3,value:"文章"}]

@connect(
  state=>({
    auth:state.auth,
    pagenavbar:state.pagenavbar
  }),
{pageNavInit,tipShow})
export default class queryResult extends Component{

  state = {
    results:[],
    averagenum:10
  }

  query =()=>{
    console.log("0000")
    var queryStr = this.refs.queryStr.value
    if (queryStr.length < 0 || queryStr.length > 50 || !queryStr) {
      this.props.tipShow({type:'error',msg:"字符数1~50之间"})
      return
    }
    // console.log("1111")
    // this.setState({
    //   type:this.refs.queryType.getValue()
    // })
    console.log(this.refs.queryType.getValue())
    this.props.pageNavInit(this.getData)
  }

  getData = (currentPage)=>{
      var type = this.refs.queryType.getValue()
    return query({type:type,queryStr:this.refs.queryStr.value,limit:`${this.state.averagenum*(currentPage-1)},${this.state.averagenum}`}).then(({data})=>{
      if (data.status == 200) { 
          this.setState({ 
              results:data.data,
              type:type
          }) 
          return Math.ceil(data.count/this.state.averagenum)
        }else{ 
          this.props.tipShow({type:'error',msg:data.msg})
        } 
    })
  }

  componentWillUnmount =()=>{
    this.props.pageNavInit(null)
  }

  render(){
    return(
      <article id="queryResult">
          <Helmet title="搜索结果"/>
          <nav>
          	   <Select optionsItems={optionsItems} ref="queryType" defaultValue="1" /><input ref="queryStr" onKeyUp={(e)=>{if(e.keyCode==13){this.query()}}} type="text"/><button className="btn-default" onClick={this.query}><i className="fa fa-search"></i></button>
          </nav>
          <section>
			       <h3>搜索结果</h3>
             {(this.state.results.length == 0 && this.state.type) && <div style={{textAlign:"center"}}>没有搜到任何结果~</div>}
             {this.state.results.map((item,index)=>{
                if (this.state.type == 1) {
                    return <div className="member" key={index}>
                      <img src={`/originImg?from=member&name=${item.phone}`} alt=""/>
                      <ul>
                          <li><Link to={`/memberBrief/${item.id}`}>{item.nickname}</Link>{item.specialityName.map((itemm,index)=><label key={index}>{!itemm ? '无' : itemm}</label>)}</li>
                          <li>{item.sex == 1 ? "女" : "男"} - {item.location}</li>
                          <li>{item.biref}</li>
                      </ul>
                    </div>
                }else if (this.state.type == 2) {
                    return <div key={index} className="member">
                          <img src={`/originImg?from=organizations&name=${item.head}`} alt=""/>
                        <ul>
                            <li><Link to={`/organizationsHome/${item.id}`}>{item.name}</Link></li>
                            <li>{item.specialityName}</li>
                        </ul>
                    </div>
                }else{
                        var date = new Date(item.createdAt)
                        var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}`
                    return <div key={index} className="article">
                            <img width="50" src={`/originImg?from=member&name=${item.phone}`} alt=""/>
                            {item.title && <div className="header"><span className="lightColor smallFont">{time}</span>&nbsp;&nbsp;&nbsp;<Link to={`/memberBrief/${item.memberId}`}>{item.nickname}</Link>在<Link to={`/organizationsHome/${item.organizationsId}`}>{item.organizationsName}</Link>发布了<Link to={`/article/${item.id}`}>{item.title}({item.titleType})</Link></div>}
                        </div>
                }
             })}
             <PageNavBar />
             <div style={{clear:"both"}}></div>
          </section>
      </article>
      )
  }
}

