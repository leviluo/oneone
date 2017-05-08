import React, { Component, PropTypes } from 'react'
import './login.scss'
import {login} from '../../../reducers/auth'
import {connect} from 'react-redux'
import {tipShow} from '../../../components/Tips/modules/tips'
import Input from '../../../components/Input'
import Helmet from 'react-helmet'
import {Link} from 'react-router'
import Modal,{modalShow} from '../../../components/Modal'

@connect(
  state=>({auth:state.auth}),
{login,tipShow,modalShow})
export default class Login extends Component{

  state = {
    content:<div></div>
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  submit = ()=>{
    var account = this.refs.account.value.trim()
    var password = this.refs.password.value.trim()
    if (!account){
        this.props.tipShow({type:"error",msg:'账号不能为空'})
        return;
    };

    if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,20}$/.test(password)) {
        this.props.tipShow({type:"error",msg:'密码格式不正确'})
        return;
    }

    this.props.login({account:account,password:password,type:1},this.context.router)
  }

  render(){
    return(
      <div className="loginContainer">
        <Helmet title='登录' />
        <h2>登录</h2>
        <hr />
        <div name="content">
        <div>
            <input type="text" ref="account" placeholder="账号"/>
        </div>
        <br />
        <div>
            <input type="password" ref="password" placeholder="密码（6-16位字母数字_,无空格）"/>
        </div>
        <div>
            <button className="btn-primary" type="submit" onClick={this.submit}>提交</button>
        </div>
        </div>
      </div>
      )
  }
}

