import React, {Component} from 'react'
import './myNotice.scss'
import { connect } from 'react-redux'
import {Link} from 'react-router'
import {asyncConnect} from 'redux-async-connect'
import { tipShow } from '../../../../components/Tips/modules/tips'
import {getReplyMe,getApproveMe} from './modules'
import {countNotice} from '../../containers/modules'

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
  {tipShow,countNotice}
)

export default class myNotice extends Component {

    state = {
      myReplyData:[],
      ApproveData:[]
    }

    static contextTypes = {
      router: React.PropTypes.object.isRequired
    };

    componentWillMount =()=>{
     this.updateDate()
     getApproveMe().then(({data})=>{
        if (data.status == 200) {
          this.setState({
            ApproveData:data.data
          })
          
        }else if (data.status==600) {
          this.props.dispatch({type:"AUTHOUT"})
          this.context.router.push('/login')
        }{
          this.props.tipShow({type:'error',msg:data.msg})
        }
      })

    }

    componentWillUnmount =()=>{
      
    }

    updateDate = ()=>{
      getReplyMe().then(({data})=>{
        if (data.status == 200) {
          this.props.countNotice()
          this.setState({
            myReplyData:data.data
          })
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
    <div className="myNotice">
    {(this.state.myReplyData.length == 0 && this.state.ApproveData.length == 0)&& <div className="text-center">没有任何通知耶~</div>}
    <ul>
        {this.state.ApproveData.length > 0 && <li><h4>通过申请</h4></li>}
        {this.state.ApproveData.map((item,index)=>{
          var link = `/organizationsHome/${item.id}`
          return <li key={index}><Link to={link}>{item.name}</Link>已通过您的入社请求</li>
        })}
    </ul>
      <table>
        <tbody>
        {this.state.myReplyData.length > 0 && <tr><td colSpan="3"><h4>回复你的消息</h4></td></tr>}
        {this.state.myReplyData.map((item,index)=>{
          if (item.title.length > 30) {
            item.title = item.title.slice(0,30) + '...'
          };
          var date = new Date(item.createdAt)
          var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}`
          var linkArticle = `/article/${item.articleId}`
          var linkOrganization = `/organizationsHome/${item.organizationsId}`
          var linkMember = `/memberBrief/${item.id}`
          return <tr key={index} style={{background:item.status == 0 ? "#fff4e8" : "#fff"}}>
          <td className="lightColor">{time}</td>
          <td><Link to={linkMember}>{item.nickname}</Link>在<Link to={linkArticle}>{item.title}</Link>中回复了你 <br/><span className="lightBackground">{item.comment}</span></td>
          <td>来自<Link to={linkOrganization}>{item.name}</Link></td>
          </tr>
        })}
        </tbody>
      </table>
    </div>
    )
  }
}

myNotice.propTypes = {
  auth: React.PropTypes.object
}
