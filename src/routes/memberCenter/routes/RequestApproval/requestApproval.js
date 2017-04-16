import React, {Component} from 'react'
import './requestApproval.scss'
import { connect } from 'react-redux'
import {Link} from 'react-router'
import {asyncConnect} from 'redux-async-connect'
import { tipShow } from '../../../../components/Tips/modules/tips'
import {getrequestData,isApprove} from './modules'
import PageNavBar,{pageNavInit} from '../../../../components/PageNavBar'
// import {countRequest} from '../../containers/modules'

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
  {tipShow,pageNavInit}
)

export default class requestApproval extends Component {

    state = {
      requestData:[],
      averagenum:5,
      request:{}
    }

    static contextTypes = {
      router: React.PropTypes.object.isRequired
    };

    componentWillMount =()=>{
     this.props.pageNavInit(this.requestData)
    }

    requestData = (currentPage)=>{

    if(this.state.request['requestData'])return
    this.state.request['requestData'] = true;

    return getrequestData(this.props.params.id,`${this.state.averagenum*(currentPage-1)},${this.state.averagenum}`).then(({data})=>{
    this.state.request['requestData'] = false;
        if (data.status == 200) {
          this.setState({
            requestData:data.data
          })
          return Math.ceil(data.count/this.state.averagenum)
        }else if (data.status==600) {
          this.props.dispatch({type:"AUTHOUT"})
          this.context.router.push('/login')
        }{
          this.props.tipShow({type:'error',msg:data.msg})
        }
      })
  }

  isApprove =(e,flag,id)=>{
    
    if(this.state.request['isApprove'])return
    this.state.request['isApprove'] = true;

    isApprove(flag,id).then(({data})=>{
    this.state.request['isApprove'] = false;
      if (data.status == 200) {
        // this.props.countRequest()
        this.props.tipShow({type:'success',msg:"操作成功"})
          for (var i = 0; i < this.state.requestData.length; i++) {
            if(this.state.requestData[i].id == id){
              this.state.requestData.splice(i,1)
              this.setState({})
              break
            }
          }

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
    <div className="requestApproval">
    <div>
          <button className="btn-default" onClick={()=>window.history.go(-1)} href="javascript.void(0)">返回 <i className="fa fa-mail-reply"></i></button>
    </div>
    {this.state.requestData.length == 0 && <div className="text-center">您还没有任何申请~</div>}
      <table>
        <tbody>
        { this.state.requestData.length > 0 && <tr className="lightColor">
          <td>请求时间</td>
          <td>请求人</td>
          <td>验证信息</td>
          <td>操作</td>
        </tr>
        }
        {this.state.requestData.map((item,index)=>{
          var link = `/memberBrief/${item.memberId}`
          var date = new Date(item.createdAt)
          var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}`
          return <tr key={index}>
            <td>{time}</td>
            <td><Link to={link}>{item.nickname}</Link></td>
            <td>{item.verified}</td>
            <td><button className="btn-default" onClick={(e)=>this.isApprove(e,0,item.id)} >忽略</button><button onClick={(e)=>this.isApprove(e,1,item.id)}  className="btn-success">通过</button></td>
          </tr>
        })}
        </tbody>
      </table>
      <PageNavBar />
    </div>
    )
  }
}

requestApproval.propTypes = {
  auth: React.PropTypes.object
}
