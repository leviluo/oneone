import React, {Component} from 'react'
import './myNotice.scss'
import { connect } from 'react-redux'
import {Link} from 'react-router'
import {asyncConnect} from 'redux-async-connect'
import { tipShow } from '../../../../components/Tips/modules/tips'
import {fetchNotice} from './modules'
import PageNavBar,{pageNavInit} from '../../../../components/PageNavBar'
// import {countNotice} from '../../containers/modules'

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

export default class myNotice extends Component {

    state = {
      notice:[],
      averagenum:10
    }

    static contextTypes = {
      router: React.PropTypes.object.isRequired
    };

    componentWillMount =()=>{
     // this.updateDate()
     // getApproveMe().then(({data})=>{
     //    if (data.status == 200) {
     //      this.setState({
     //        ApproveData:data.data
     //      })
          
     //    }else if (data.status==600) {
     //      this.props.dispatch({type:"AUTHOUT"})
     //      this.context.router.push('/login')
     //    }{
     //      this.props.tipShow({type:'error',msg:data.msg})
     //    }
     //  })
     this.props.pageNavInit(this.fetchData)
    }

    fetchData =(p)=>{
        return fetchNotice({p:p,limit:this.state.averagenum}).then(data=>{
          if (data.status == 200) {
              this.setState({
                notice:data.data
              })
              return Math.ceil(data.count/this.state.averagenum)
            }else{
              this.props.tipShow({type:"error",msg:data.msg})
            }
        })
    }
    componentWillUnmount =()=>{
      
    }

  render () {
    return (
    <div id="myNotice">
          <ul className="details">
              {this.state.notice.length == 0 && <li className="text-center">没有新的通知~</li>}
              {this.state.notice.map((item,index)=>{
                var date = new Date(item.createdate)
                var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}`
                switch(item.type){
                  case 'focusyou':
                    return <li key={index}><div className="focusyou"><img src={`/originImg?name=${item.memberId}&from=member`} width="30" /><Link to={`/memberBrief/${item.memberId}`}><strong>{item.nickname}</strong></Link><span className="lightColor smallFont pull-right">{time}</span></div><p>关注了你</p></li>
                  case 'attendapprove':
                    return <li key={index}><div className="focusyou"><img src={`/originImg?name=${item.organizationshead}&from=organizations`} width="30" /><Link to={`/organizationsHome/${item.organizationsId}`}><strong>{item.organizationsname}</strong></Link><span className="lightColor smallFont pull-right">{time}</span></div><p>通过了你的入社请求</p></li>
                } 
              })}
          </ul>
          <PageNavBar />
    </div>
    )
  }
}

myNotice.propTypes = {
  auth: React.PropTypes.object
}
