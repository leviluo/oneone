import React, {Component} from 'react'
import './index.scss'
import { connect } from 'react-redux'
import {Link} from 'react-router'
import {asyncConnect} from 'redux-async-connect'
import { tipShow } from '../../../../components/Tips/modules/tips'
import {getSuggestions} from './modules'
import PageNavBar,{pageNavInit} from '../../../../components/PageNavBar'

// import Modal,{modalShow,modalHide} from '../../../../components/Modal'
// import Confirm,{confirmShow} from '../../../../components/Confirm'

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
  {pageNavInit,tipShow}
)

export default class suggestionsManage extends Component {

  state = {
    items:[],
    averagePage:5
  }

 static contextTypes = {
      router: React.PropTypes.object.isRequired
    };

  componentWillMount =()=>{
    this.props.pageNavInit(this.initData)
  }

  initData =(p)=>{
    return getSuggestions(this.state.averagePage,p).then(({data})=>{
      if (data.status == 200) { 
        this.setState({
          items:data.data
        })
        return Math.ceil(data.count/this.state.averagePage)
      }else if (data.status==600) {
        this.props.dispatch({type:"AUTHOUT"})
        this.context.router.push('/')
      }else{
        this.props.tipShow({type:'error',msg:data.msg})
      }
    })
  }

  render () {
    // const data = [{key:"aaa",values:["a1","a2","a3"]},{key:"bbb",values:["b1","b2","b3"]}]
    return (
    <div id="suggestionsManage">
        <h3>同志们的建议</h3>
        <ul>
            {this.state.items.map((item,index)=>{
              return <li key={index}>
              {index+1}-联系方式：<span dangerouslySetInnerHTML={{__html:item.contact}}></span>
              <p dangerouslySetInnerHTML={{__html:item.content}}></p>
              </li>
            })}
        </ul>
        <PageNavBar />
    </div>
    )
  }
}
