import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import { tipShow as tipOpen } from './modules/tips';

import "./Tips.scss"

@connect(
  state => ({
        result:state.mytips.text,
    }),
  {}
)
export default class Tip extends Component {

    componentWillMount = () => {
        // console.log("componentWillMount")
    }
    
    componentDidUpdate = (e) => {
        findDOMNode(this).style.left = ((document.body.clientWidth-window.getComputedStyle(findDOMNode(this),null).width.slice(0,-2)) / 2) + 'px';
        findDOMNode(this).style.top = (document.body.scrollTop + 60) + 'px';
    }

    componentWillUpdate() {

    }

    shouldComponentUpdate(nextProps){
        if(nextProps==this.props)return false
        let that = this;
        if(nextProps.result.msg) {
            if (nextProps.result.type=="success") {
                this.showTip("#44b549")
            }else{
                this.showTip("#FF7F00")
            }
            if(this.setIn)clearInterval(this.setIn)
            this.setIn = setTimeout(()=>{
            that.hideTip();
            }, 2000)
        }else{
            return false
        }
        return true
    }

    componentWillReceiveProps =()=>{
        // console.log("componentWillReceiveProps")
        // console.log(this.props)
    }

    hideTip = () =>{
        findDOMNode(this).style.display = "none";
    }

    showTip = (color)=>{
        findDOMNode(this).style.display = "block";
        this.refs.text.style.background = color;
    }

    static propTypes = {
        result: React.PropTypes.object.isRequired,
    }

    render() {
        return ( 
            < div id = "tips" > <div ref="text"> {this.props.result.msg} </div> </div >
        )
    }
}

export const  tipShow = tipOpen

