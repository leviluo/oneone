import React, {Component} from 'react'
import Helmet from 'react-helmet'
import './membercenter.scss'
import {Link} from 'react-router'
// import {isAuth} from '../../../reducers/auth'
import { connect } from 'react-redux'
// import ImageBrowser from '../../../components/ImageBrowser'
// import {messages,countNotice,countReply,countRequest} from './modules'
import { tipShow } from '../../../components/Tips/modules/tips'
// import {asyncConnect} from 'redux-async-connect'

// @asyncConnect([{
//   promise: ({store: {dispatch, getState},a}) => {
//     const promises = [];
//     if (!getState().catelogues.isloaded) {
//       console.log("why")
//       promises.push(dispatch(messages()));
//       promises.push(dispatch(countNotice()));
//       promises.push(dispatch(countReply()));
//     }
//     return Promise.all(promises);
//   }
// }])

@connect(
  state => ({
    status:state.message,
  }),
  {tipShow}
  // {tipShow,messages,countNotice,countReply,countRequest}
)
export default class memberCenter extends Component {

    static contextTypes = {
      router: React.PropTypes.object.isRequired
    };

    componentWillMount =()=>{
      // console.log(this.props.status)
      // this.props.messages()
      // this.props.countNotice()
      // this.props.countReply()
      // this.props.countRequest()
      // if(!this.props.auth.isAuth)this.props.isAuth(this.context.router) 
    }

    render(){
      return(
          <div className="memberCentercontent">
            <Helmet title='个人中心' />
            <div className="memberCenterContentLeft">
            <ul>
              <li><Link to="/memberCenter/updates/follow" className={this.props.location.pathname == '/memberCenter/updates/follow' ? 'active' : ''}>关注动态</Link></li>
              <li><Link to="/memberCenter/updates/my" className={this.props.location.pathname == '/memberCenter/updates/my' ? 'active' : ''}>我的动态</Link></li>
              <li><Link to="/memberCenter/basicInfo" className={this.props.location.pathname == '/memberCenter/basicInfo' || /\/memberCenter\/photos/.test(this.props.location.pathname) ? 'active' : ''}>我的名片</Link></li>
            </ul>
            <h4>社团</h4>
            <ul>
              <li><Link to="/memberCenter/myCreateTeam" className={this.props.location.pathname == '/memberCenter/myCreateTeam' || /\/memberCenter\/requestApproval/.test(this.props.location.pathname) ? 'active' : ''}>我创建的</Link></li>
              <li><Link to="/memberCenter/myAttendTeam" className={this.props.location.pathname == '/memberCenter/myAttendTeam' ? 'active' : ''}>我加入的</Link></li>
              <li><Link to="/memberCenter/myPost" className={this.props.location.pathname == '/memberCenter/myPost' ? 'active' : ''}>我发布的</Link></li>
            </ul>
            <h4>其它</h4>
            <ul>
              <li><Link to="/memberCenter/myMessage" className={this.props.location.pathname == '/memberCenter/myMessage' ? 'active' : ''}>消息{this.props.status.messages.length > 0 && <span className="noRead">{this.props.status.messages.length}</span>}</Link></li>
              <li><Link to="/memberCenter/myNotice" className={this.props.location.pathname == '/memberCenter/myNotice' ? 'active' : ''}>通知{this.props.status.notices.length > 0 && <span className="noRead">{this.props.status.notices.length}</span>}</Link></li>
              <li><Link to="/memberCenter/suggestions" className={this.props.location.pathname == '/memberCenter/suggestions' ? 'active' : ''}>建议与意见</Link></li>
            </ul>
            </div>
            <div className="memberCenterContentRight">
              <div>
              {this.props.children}
              </div>
            </div>
          </div>
        )}
  }

