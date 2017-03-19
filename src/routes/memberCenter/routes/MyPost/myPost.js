import React, {Component} from 'react'
import './myPost.scss'
import { connect } from 'react-redux'
import {Link} from 'react-router'
import {asyncConnect} from 'redux-async-connect'
import { tipShow } from '../../../../components/Tips/modules/tips'
import {getMyPost} from './modules'
import PageNavBar,{pageNavInit} from '../../../../components/PageNavBar'

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

export default class myPost extends Component {

    state = {
      myPostData:[],
      averagenum:5
    }

    static contextTypes = {
      router: React.PropTypes.object.isRequired
    };

    componentWillMount =()=>{
     this.props.pageNavInit(this.getMyPostData)
    }

    getMyPostData = (currentPage)=>{
    return getMyPost(`${this.state.averagenum*(currentPage-1)},${this.state.averagenum}`).then(({data})=>{
        if (data.status == 200) {
          this.setState({
            myPostData:data.data
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

  render () {
    return (
    <div className="myPost">
    {this.state.myPostData.length == 0 && <div className="text-center">您还没有发布过活动,咨询耶~</div>}
      <table>
        <tbody>
        {this.state.myPostData.length > 0 && <tr className="lightColor">
          <td>发布时间</td>
          <td>标题</td>
          <td>回复数</td>
          <td>社团</td>
        </tr>}
        {this.state.myPostData.map((item,index)=>{
          if (item.title.length > 20) {
            item.title = item.title.slice(0,20) + '...'
          };
          var date = new Date(item.updatedAt)
          var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}`
          var linkArticle = `/article/${item.id}`
          var linkOrganization = `/organizationsHome/${item.organizationsId}`
          return <tr key={index}>
          <td className="lightColor">{time}</td>
          <td><Link to={linkArticle}>{item.title}</Link></td>
          <td className="lightColor">{item.count}条回复<br/>{item.noRead > 0 && <Link className="noRead" to={linkArticle}>{item.noRead}条未读</Link>}</td>
          <td>来自<Link to={linkOrganization}>{item.name}</Link></td>
          </tr>
        })}
        </tbody>
      </table>
      <PageNavBar />
    </div>
    )
  }
}

myPost.propTypes = {
  auth: React.PropTypes.object
}
