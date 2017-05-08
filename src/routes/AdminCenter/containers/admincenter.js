import React, {Component} from 'react'
import Helmet from 'react-helmet'
import './index.scss'
import {Link} from 'react-router'
import {isAuth} from '../../../reducers/auth'
import { connect } from 'react-redux'
// import ImageBrowser from '../../../components/ImageBrowser'
// import {countMessage,countNotice,countReply,countRequest} from './modules'
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
  {isAuth,tipShow}
)
export default class memberCenter extends Component {

    static contextTypes = {
      router: React.PropTypes.object.isRequired
    };

    componentWillMount =()=>{

    }

    componentWillMount =()=>{
      // if(!this.props.auth.isAuth)this.props.isAuth(this.context.router) 
    }

    render(){
      return(
          <div className="admincentercontent">
            <Helmet title='管理中心' />
            <div className="memberCenterContentLeft">
            <h3>基本管理</h3>
            <ul>
              <li><Link to="/admincenter" className={this.props.location.pathname == '/admincenter' ? 'active' : ''}>类目管理</Link></li>
            </ul>
            <h3>用户管理</h3>
            <ul>
              <li><Link to="/admincenter/suggestions" className={this.props.location.pathname == '/admincenter/suggestions' ? 'active' : ''}>客户建议</Link></li>
            </ul>
            </div>
            <div className="memberCenterContentRight">
              {this.props.children}
            </div>
          </div>
        )}
  }

