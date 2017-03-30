import React, {Component} from 'react'
import Helmet from 'react-helmet'
import './register.scss'
import { connect } from 'react-redux';
import { fetchRegister } from '../modules/register'
import { tipShow } from '../../../components/Tips/modules/tips'
import {login} from '../../../reducers/auth'

@connect(
  state => ({
    register: state.register,
    mylocation: state.mylocation.text
    }),
  {tipShow,login}
)
export default class Register extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  state = {
    sex:0
  }

  sexChange =(e)=>{
    this.setState({
      sex:e.target.value
    })
  }

  submit =()=>{
    var phone = this.refs.phone.value.trim()
    var password = this.refs.password.value.trim()
    var nickname = this.refs.nickname.value.trim()

    var pattern = /^[1][34578][0-9]{9}$/;
    if (!pattern.test(phone)) {
        this.props.tipShow({type:"error",msg:'手机号格式不正确'})
        return;
    };

    pattern = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,20}$/;

    if (!pattern.test(password)){
      this.props.tipShow({type:"error",msg:"密码格式不正确"})
      return
    }

    var flag = nickname.StringFilter(1,20)

    if (flag) {
      this.props.tipShow({type:"error",msg:`昵称${flag}`})
      return
    }

    if (!this.refs.code.value) {
      this.props.tipShow({type:"error",msg:"请填写验证码"})
      return
    }


    let address = this.props.mylocation[0] ? this.props.mylocation[0] :'';
    var me = this
    fetchRegister({
      phone:phone,
      password:password,
      nickname:nickname,
      code:this.refs.code.value,
      sex:this.state.sex,
      location:address
    }).then(({data}) => {
      if (data.status==200) {
          this.props.tipShow({type:"success",msg:"注册成功,3S后自动跳转个人中心"})
          setTimeout(()=>{
            me.props.login({phone:me.refs.phone.value,password:me.refs.password.value},me.context.router)
          },3000)
      }else{
          this.props.tipShow({type:"error",msg:data.msg})
      }
    })

  }

  render () {
    // console.log(this.props) 
    return (
      <div className="registerContainer">
        <Helmet title='注册' />
        <h2>注册</h2>
        <hr />
        <div name="content">
        <div>
            <input type="text" ref="phone" placeholder="手机号"/>
        </div>
        <br />
        <div>
            <input type="password" ref="password" placeholder="密码（6-20位字母数字_,无空格）"/>
        </div>
        <br />
        <div>
            <input type="text" ref="nickname" placeholder="昵称(1~20个字符)"/>
        </div>
        <div className="registerSex">
            性别:
            <input type="radio" onChange={this.sexChange} value="0" defaultChecked name="sex"/>男
            <input type="radio" onChange={this.sexChange} value="1" name="sex"/>女
        </div>
        <br />
        <div>
            <input name="code" type="text" ref="code" placeholder="验证码（6位）"/><button className="btn-primary codebtn">发送</button>
        </div>
        <div>
            <button className="btn-primary" type="submit" onClick={this.submit}>提交</button>
        </div>
        </div>
      </div>
    )
  }
}

Register.propTypes = {
  // zen: React.PropTypes.object.isRequired
}