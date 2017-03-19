import React, {Component} from 'react'
import './myAttendTeam.scss'
import { connect } from 'react-redux'
import {Link} from 'react-router'
import {asyncConnect} from 'redux-async-connect'
import { tipShow } from '../../../../components/Tips/modules/tips'
import {getMyOrganization} from './modules'

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
  {tipShow}
)

export default class myAttendTeam extends Component {

    state = {
      getMyOrganization:[]
    }

    static contextTypes = {
      router: React.PropTypes.object.isRequired
    };

    componentWillMount =()=>{
     this.updateDate()
    }

    updateDate = ()=>{
      getMyOrganization().then(({data})=>{
        if (data.status == 200) {
          this.setState({
            getMyOrganization:data.data
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
    <div className="team">
        <div className="attendTeam">
        {this.state.getMyOrganization.length == 0 && <div className="text-center">您还没加入任何社团耶~<Link to="/Organization">去发现一个</Link></div>}
            {this.state.getMyOrganization.map((item,index)=>{
              var headImg = `/originImg?name=${item.head}&from=organizations`
              var date = new Date(item.time)
              var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}`
              var organizationName = `organizationName${item.id}`
              var organizationBrief = `organizationBrief${item.id}`
              var link = `/organizationsHome/${item.id}`
              return <div className="items" key = {index}>
                      {!this.state[item.name] && <div>{item.name}<span><Link to={link} >去社团主页</Link></span></div>}
                      {!this.state[item.name] && <img src={headImg} />}

                      <ul>
                        {!this.state[item.name] && <li><span>所属类别:</span>{item.categoryName}</li>}
                        {!this.state[item.name] && <li><span>创建时间:</span>{time}</li>}
                        {!this.state[item.name] && <li><span>社团简介:</span>{item.brief}</li>}
                        {this.state[item.name] && <li className="editLi">
                          <canvas style={{background:`url(${headImg})`}} width="100" height="100" ></canvas>
                          <div>
                          <button className="btn-default modifyHead">修改社团头像<input onChange={this.modifyHead} type="file" /></button>
                          </div>
                          <p>修改名称</p>
                          <div>
                          <input defaultValue={item.name} ref={organizationName} type="text"/>
                          </div>
                          <p>填写简介</p>
                          <div>
                          <textarea defaultValue={item.brief} ref={organizationBrief} cols="30" rows="10" ></textarea>
                          </div>
                          <div>
                          <button onClick={(e)=>{this.state[item.name] = false;this.setState({})}} className="btn-default">取消</button>
                          <button onClick={(e)=>this.modifyOrganization(e,item.id,item.name)} className="submit btn-success">提交</button>
                          </div>
                        </li>}
                      </ul>
                    </div>
            })}
        </div>
    </div>
    )
  }
}

myAttendTeam.propTypes = {
  auth: React.PropTypes.object
}
