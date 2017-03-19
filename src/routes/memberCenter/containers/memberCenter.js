import React, {Component} from 'react'
import Helmet from 'react-helmet'
import './membercenter.scss'
import {Link} from 'react-router'
import {isAuth} from '../../../reducers/auth'
import { connect } from 'react-redux'
import ImageBrowser from '../../../components/ImageBrowser'
import {countMessage,countNotice,countReply,countRequest} from './modules'
import { tipShow } from '../../../components/Tips/modules/tips'
// import {asyncConnect} from 'redux-async-connect'

// @asyncConnect([{
//   promise: ({store: {dispatch, getState},a}) => {
//     const promises = [];

//     if (!getState().catelogues.isloaded) {
//       console.log("why")
//       promises.push(dispatch(countMessage()));
//       promises.push(dispatch(countNotice()));
//       promises.push(dispatch(countReply()));
//     }

//     return Promise.all(promises);
//   }
// }])

@connect(
  state => ({
    auth:state.auth,
    status:state.memberCenter
  }),
  {isAuth,tipShow,countMessage,countNotice,countReply,countRequest}
)
export default class memberCenter extends Component {

    static contextTypes = {
      router: React.PropTypes.object.isRequired
    };

    componentWillMount =()=>{
      this.props.countMessage()
      this.props.countNotice()
      this.props.countReply()
      this.props.countRequest()
      if(!this.props.auth.isAuth)this.props.isAuth(this.context.router) 
    }

    render(){
      return(
          <div className="memberCentercontent">
            <Helmet title='个人中心' />
            <div className="memberCenterContentLeft">
            <ul>
              <li><Link to="/memberCenter" className={this.props.location.pathname == '/memberCenter' ? 'active' : ''}>关注动态</Link></li>
              <li><Link to="/memberCenter/myUpdates" className={this.props.location.pathname == '/memberCenter/myUpdates' ? 'active' : ''}>我的动态</Link></li>
            </ul>
            <h4>基本信息</h4>
            <ul>
              <li><Link to="/memberCenter/basicInfo" className={this.props.location.pathname == '/memberCenter/basicInfo' || /\/memberCenter\/photos/.test(this.props.location.pathname) ? 'active' : ''}>我的名片</Link></li>
              <li><Link to="/memberCenter/myMessage" className={this.props.location.pathname == '/memberCenter/myMessage' ? 'active' : ''}>私信{this.props.status.countMessage > 0 && <span className="noRead">{this.props.status.countMessage}</span>}</Link></li>
              <li><Link to="/memberCenter/myNotice" className={this.props.location.pathname == '/memberCenter/myNotice' ? 'active' : ''}>通知{this.props.status.countNotice > 0 && <span className="noRead">{this.props.status.countNotice}</span>}</Link></li>
            </ul>
            <h4>社团</h4>
            <ul>
              <li><Link to="/memberCenter/myCreateTeam" className={this.props.location.pathname == '/memberCenter/myCreateTeam' || /\/memberCenter\/requestApproval/.test(this.props.location.pathname) ? 'active' : ''}>我创建的{this.props.status.countRequest > 0 && <span className="noRead">{this.props.status.countRequest}</span>}</Link></li>
              <li><Link to="/memberCenter/myAttendTeam" className={this.props.location.pathname == '/memberCenter/myAttendTeam' ? 'active' : ''}>我加入的</Link></li>
              <li><Link to="/memberCenter/myPost" className={this.props.location.pathname == '/memberCenter/myPost' ? 'active' : ''}>我发布的{this.props.status.countReply > 0 && <span className="noRead">{this.props.status.countReply}</span>}</Link></li>
            </ul>
            </div>
            <div className="memberCenterContentRight">
              {this.props.children}
            </div>
            <ImageBrowser />
          </div>
        )}
  }

