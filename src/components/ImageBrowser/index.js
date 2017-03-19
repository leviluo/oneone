import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom';
import './ImageBrowser.scss'
import {imgbrowser,ifliked} from './modules'
import {connect} from 'react-redux'
import {tipShow} from '../Tips/modules/tips'
import loading from './asset/loading2.gif'

export const imgbrowserShow = imgbrowser
// export const isLiked = imgLiked

@connect(
  state=>({
    ImageBrowser:state.imageBrowser,
  }),
{tipShow})
export default class ImageBrowser extends Component{

  state = {
    currentChoose:0
  }
 
  componentDidUpdate =()=>{
    if(this.props.ImageBrowser.isShow){
      this.show()
    }
  }

  show =()=>{
      var ele = findDOMNode(this)
      var scrollTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop
      ele.style.height = document.body.clientHeight + 'px';
      ele.style.top = scrollTop + 'px';
      ele.style.display = "block"
      var element = ele.getElementsByClassName('content')[0]
      element.style.top = scrollTop+'px'
      document.body.style.width = parseInt(window.getComputedStyle(document.body,null).width.slice(0,-2)) + 'px'
      document.body.style.overflow = "hidden"
  }

  close=()=>{
    var ele = findDOMNode(this)
    // console.log(ele)
    ele.style.display = "none"
    document.body.style.overflow = "auto"
    document.body.style.width = 'auto'   //在打开modal之后，关闭了modal，得改为自动，网页才会自动调整大小
  }

  componentWillReceiveProps=(nextProps)=>{
    this.setState({
      currentChoose:nextProps.ImageBrowser.currentChoose
    })
    if(nextProps.ImageBrowser.likeFunc)this.update(nextProps.ImageBrowser.imgs[nextProps.ImageBrowser.currentChoose])
    this.refs.src.src = nextProps.ImageBrowser.imgs[nextProps.ImageBrowser.currentChoose]
  }

  shouldComponentUpdate =(nextProps,nextState)=>{
    if(nextProps.ImageBrowser.imgs.length == 0) return false
    return true
  }

  up=()=>{
    if (this.state.currentChoose == 0) {
      this.props.tipShow({type:"error",msg:"已经是第一张了"})
      return
    };
    this.refs.src.src = loading
    this.setState({
      currentChoose:this.state.currentChoose - 1
    })
    this.refs.src.src = this.props.ImageBrowser.imgs[this.state.currentChoose-1]
    if(this.props.ImageBrowser.likeFunc)this.update(this.props.ImageBrowser.imgs[this.state.currentChoose-1])
  }

  next=()=>{
    if (this.state.currentChoose == this.props.ImageBrowser.imgs.length-1) {
      this.props.tipShow({type:"error",msg:"已经是最后一张了"})
      return
    };
    this.refs.src.src = loading
    this.setState({
      currentChoose:this.state.currentChoose + 1
    })
    this.refs.src.src = this.props.ImageBrowser.imgs[this.state.currentChoose+1]
    if(this.props.ImageBrowser.likeFunc)this.update(this.props.ImageBrowser.imgs[this.state.currentChoose+1])
  }

  go =(e,index)=>{
    this.refs.src.src = loading
    this.setState({
      currentChoose:index
    })
    this.refs.src.src = this.props.ImageBrowser.imgs[index]
    if(this.props.ImageBrowser.likeFunc)this.update(this.props.ImageBrowser.imgs[index])
  }

  update =(name)=>{
    // if(this.props.ImageBrowser.likeFunc){
          ifliked(name.match(/[\d]+/)[0]).then(({data})=>{
            if (data.status == 200) {
              this.setState({
                isliked:data.msg
              })
            }else if (data.status==600) {
                // this.props.dispatch({type:"AUTHOUT"})
                // this.context.router.push('/login')
              }else{
                this.props.tipShow({type:'error',msg:data.msg})
              }
               // }
      })
  }

  addLike =()=>{
    this.props.ImageBrowser.likeFunc(this.props.ImageBrowser.imgs[this.state.currentChoose].match(/[\d]+/)[0]).then(({data})=>{
        if (data.status == 200) {
          this.setState({
                isliked:this.state.isliked ? 0 : 1
          })
        }else if (data.status==600) {
          this.props.dispatch({type:"AUTHOUT"})
          this.context.router.push('/login')
        }{
          this.props.tipShow({type:'error',msg:data.msg})
        }
    })
  }

  render(){
    // console.log(this.state)
    return(
        <div className='ImageBrowser'>
          <div className='content'>
            <div className="page">
              <button onClick={this.up} >&lt;</button>
            </div>
            <div>
              <img ref="src" alt=""/>
              <div className="photoLists">
                <div className="pageUp" onClick={this.up} >&lt;</div>
              <button className="close" onClick={this.close} >×</button>
                {this.props.ImageBrowser.imgs.map((item,index)=>{
                  if(index == this.state.currentChoose){
                    var color = "#ff7f00"
                  }else{
                    var color = "#efefef"
                  }
                  var date = new Date(item.createdAt)
                  var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}` 
                  return <div onClick={(e)=>this.go(e,index)} key={index} style={{backgroundImage:`url(${item.replace(/\/originImg\?/,"/img?")})`,border:`2px solid ${color}`}} className="imgShows"></div>
                })}
              {this.props.ImageBrowser.likeFunc && <button className="like" onClick={this.addLike} style={{color:this.state.isliked ? "#ff7f00" : "#fff"}}><i className="fa fa-heart"></i></button>}
                <div className="pageDown" onClick={this.next} >&gt;</div>
              </div>
            </div>
            <div className="page">
              <button onClick={this.next} >&gt;</button>
            </div>
          </div>
        </div>
      )
  }
}

