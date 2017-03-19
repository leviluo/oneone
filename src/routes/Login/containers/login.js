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
    var pattern = /^[1][34578][0-9]{9}$/;

    if (!pattern.test(this.refs.phone.value)) {
        this.props.tipShow({type:"error",msg:'手机号格式不正确'})
        return;
    };

    if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,20}$/.test(this.refs.password.value)) {
        this.props.tipShow({type:"error",msg:'密码格式不正确'})
        return;
    }

    this.props.login({phone:this.refs.phone.value,password:this.refs.password.value},this.context.router)
  }

  submitRepass =()=>{
      alert("提交了")
  }

  phoneChange =(e)=>{
    this.setState({
      phone:e.target.value
    })
  }
  codeChange =(e)=>{
    this.setState({
      code:e.target.value
    })
  }
  passChange =(e)=>{
    this.setState({
      newPass:e.target.value
    })
  }

  rePass =()=>{
    var content = <div><div><input type="text" onClick={this.phoneChange} placeholder="手机号"/></div>
        <div>
          <input type="text" onClick={this.codeChange} placeholder="验证码（6位）" style={{width:"80%"}}/><button className="btn-primary" style={{width:"20%"}}>发送验证码</button>
        </div>
        <div>
          <input type="password" onClick={this.passChange} placeholder="新密码(6-20位字母数字_,无空格)"/>
        </div>
        </div>;
    this.props.modalShow({header:"重置密码",submit:this.submitRepass,content:content})
  }

  render(){
    return(
      <div className="loginContainer">
        <Helmet title='登录' />
        <h2>登录</h2>
        <hr />
        <div name="content">
        <div>
            <input type="text" ref="phone" placeholder="手机号"/>
        </div>
        <br />
        <div>
            <input type="password" ref="password" placeholder="密码（6-16位字母数字_,无空格）"/>
        </div>
        <div>
            <button className="btn-primary" type="submit" onClick={this.submit}>提交</button>
        </div>
        <div className="others">
        <a onClick={this.rePass}>忘记密码？</a><Link to='/register'>还未注册？先注册</Link>
        </div>
        <br />
        <hr style={{border:"1px dashed #ccc"}}/>
          使用其它方式登录
        <br/>
        <br/>
        <div className="otherlogins">
        <button></button>&nbsp;&nbsp;
        <button></button>&nbsp;&nbsp;
        <button></button>
        </div>
        </div>
        <Modal />
      </div>
      )
  }
}

