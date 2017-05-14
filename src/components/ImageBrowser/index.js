import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom';
import './ImageBrowser.scss'
import {imgbrowser,ifliked,addLike} from './modules'
import {connect} from 'react-redux'
import {tipShow} from '../Tips/modules/tips'
import loading from './asset/loading2.gif'
import {loadingShow,loadingHide} from '../Loading'

export const imgbrowserShow = imgbrowser
// export const isLiked = imgLiked

@connect(
  state=>({
    ImageBrowser:state.imageBrowser,
  }),
{tipShow,loadingShow,loadingHide})
export default class ImageBrowser extends Component{

  state = {
    currentChoose:0,
    imgUrlType:"",
    imgName:"",
    isFirst:false,
    isEnd:false
    // request:{}
  }
 
  componentDidUpdate =()=>{
    if(this.props.ImageBrowser.isShow){
      // console.log("1111")
      this.show()
    }
  }

  show =()=>{
      // console.log("000")
      var ele = findDOMNode(this)
      var scrollTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop
      ele.style.height = document.body.clientHeight + 'px';
      ele.style.top = scrollTop + 'px';
      ele.style.display = "block"
      var element = ele.getElementsByClassName('content')[0]
      element.style.top = scrollTop+'px'
      document.body.style.width = parseInt(window.getComputedStyle(document.body,null).width.slice(0,-2)) + 'px'
      document.body.style.overflow = "hidden"
      // 定义图片最大尺寸
      var h = window.getComputedStyle(this.refs.photoLists,null).height.slice(0,-2)
      this.refs.bigImage.style.maxHeight = (document.body.clientHeight - 2*h) - 70 + 'px'

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
      currentChoose:nextProps.ImageBrowser.currentChoose,
    })
    if (nextProps.ImageBrowser.currentChoose == 0) {
      this.setState({
        isFirst:true
      })
    };
    if (nextProps.ImageBrowser.currentChoose == this.props.ImageBrowser.imgs.length-1) {
      this.setState({
        isEnd:true
      })
    };
    this.refs.bigImage.src = loading
    this.update(nextProps.ImageBrowser.imgs[nextProps.ImageBrowser.currentChoose])
  }

  shouldComponentUpdate =(nextProps,nextState)=>{
    if(nextProps.ImageBrowser.imgs.length == 0) return false
    return true
  }

  up=()=>{
    if (this.state.currentChoose == 1) {
      this.setState({
        isFirst:true
      })
    };
    if (this.state.isEnd) {
      this.setState({
        isEnd:false
      })
    }
    this.refs.bigImage.src = loading
    this.setState({
      currentChoose:this.state.currentChoose - 1
    })
    this.update(this.props.ImageBrowser.imgs[this.state.currentChoose-1])
  }

  next=()=>{
    if (this.state.currentChoose == this.props.ImageBrowser.imgs.length-2) {
      this.setState({
        isEnd:true
      })
    };
    if (this.state.isFirst) {
      this.setState({
        isFirst:false
      })
    }
    this.refs.bigImage.src = loading
    this.setState({
      currentChoose:this.state.currentChoose + 1
    })
    // this.refs.src.src = this.props.ImageBrowser.imgs[this.state.currentChoose+1]
    this.update(this.props.ImageBrowser.imgs[this.state.currentChoose+1])
  }

  go =(e,index)=>{
    this.refs.bigImage.src = loading
    this.setState({
      currentChoose:index
    })
    // this.refs.src.src = this.props.ImageBrowser.imgs[index]
    this.update(this.props.ImageBrowser.imgs[index])
  }

  update =(item)=>{
      if (item.workName) {
        this.refs.bigImage.src = "/originImg?from=speciality&name=" + item.workName
        var id = item.workId
      }
      // this.props.loadingShow()
      // this.refs.src.src = loading
          ifliked(id).then(({data})=>{
          // this.props.loadingHide()
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
    // if (this.state.request['addLike']) return
    //     this.state.request['addLike'] = true
    addLike(this.props.ImageBrowser.imgs[this.state.currentChoose].match(/[\d]+/)[0]).then(({data})=>{
      // this.state.request['addLike'] = false
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



  //  like =(name)=>{
  //   if (!this.props.auth.memberId) {
  //       this.props.tipShow({type:"error",msg:"请先登录"})
  //       return
  //   }
  //   return addLike(name)
  // }



  render(){
    // console.log(this.state)
    return(
        <div className='ImageBrowser'>
          <div className='content'>
            <div className="page">
              {!this.state.isFirst && <button onClick={this.up} >&lt;</button>}
            </div>
            <div>
              <img ref="bigImage" alt=""/>
              <div ref="photoLists" className="photoLists">
                {!this.state.isFirst && <div className="pageUp" onClick={this.up} >&lt;</div>}
                <a className="close" onClick={this.close} >×</a>
                <div className="imgs">
                {this.props.ImageBrowser.imgs.map((item,index)=>{
                  if(index == this.state.currentChoose){
                      var color = "#ff7f00"
                  }else{
                      var color = "#efefef"
                  }
                  var link = item.workName ? `url(/img?from=speciality&name=${item.workName})`:""
                  return <div onClick={(e)=>this.go(e,index)} key={index} style={{backgroundImage:link,border:`2px solid ${color}`}} className="imgShows"></div>
                })}
                </div>
                <button className="like" onClick={this.addLike} style={{color:this.state.isliked ? "#ff7f00" : "#fff"}}><i className="fa fa-heart"></i></button>
                {!this.state.isEnd && <div className="pageDown" onClick={this.next} >&gt;</div>}
              </div>
            </div>
            <div className="page">
              {!this.state.isEnd && <button onClick={this.next} >&gt;</button>}
            </div>
          </div>
        </div>
      )
  }
}

