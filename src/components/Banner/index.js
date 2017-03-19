import React, { Component, PropTypes } from 'react'
import './banner.scss'
import { findDOMNode } from 'react-dom';

export default class Header extends Component{
  
  componentWillMount=()=>{

  }

  componentDidMount =()=>{
    this.imgElem = document.getElementsByName('imgs');
    var ele2 = document.getElementsByClassName('banner')[0].getElementsByTagName('ul')[0];
    this.points = ele2.getElementsByTagName('li');
    this.count = this.props.items.length;
    this.len = this.props.items.length;
    this.imgElem[this.count-1].style.display = "block";
    this.imgElem[this.count-2].style.display = "block";
    this.imgElem[this.count-1].setAttribute("class","go")
    this.points[0].style.color = "red"
    this.runBanner()
    setTimeout(()=>{
      ele2.style.left = (window.getComputedStyle(findDOMNode(this),null).width.slice(0,-2) - window.getComputedStyle(ele2,null).width.slice(0,-2))/2 + 'px';
    },1)
  }

  runBanner = ()=>{
    var count = this.count
    this.intrl = setInterval(()=>{
      if (count == 1) {

        this.points[this.len-1].style.color="white"
        this.points[0].style.color="red"

        this.imgElem[0].removeAttribute("class")
        this.imgElem[0].style.display = "none";
        this.imgElem[0].style.zIndex = "0";

        this.imgElem[this.len-1].setAttribute("class","go")
        this.imgElem[this.len-2].style.display = "block";

        count = this.len + 1;
      }else{
        this.points[this.len-count].style.color = "white"
        this.points[this.len-count+1].style.color = "red"

        this.imgElem[count-1].removeAttribute("class")
        this.imgElem[count-1].style.display = "none";

        this.imgElem[count-2].setAttribute("class","go")
        if (count==2) {
          this.imgElem[0].style.zIndex = "3";
          this.imgElem[this.len-1].style.display = "block";
        }else{
          this.imgElem[count-3].style.display = "block";
        }
      }
      count--;
      this.count = count;
    },6000)
  }


  changeBanner =(e,count)=>{
    if ((this.len - this.count) == count) {return}
    clearInterval(this.intrl)
    for (var i = 0; i < this.points.length; i++) {
      this.points[i].style.color="white"
    }

    this.points[count].style.color = "red"

    for (var i = 0; i < this.imgElem.length; i++) {
      this.imgElem[i].removeAttribute("class")
      this.imgElem[i].style.display = "none";
      this.imgElem[i].style.zIndex = "0";
    }
    if (count == (this.len -1)) {
        this.imgElem[0].setAttribute("class","go")
        this.imgElem[0].style.display = "block";
        this.imgElem[0].style.zIndex = "3";
        this.imgElem[this.len -1].style.display = "block";
      }else{
        this.imgElem[this.len - count -1].style.display = "block";
        this.imgElem[this.len - count -1].setAttribute("class","go")
        this.imgElem[this.len - count -2].style.display = "block";
      }
    this.count = this.len - count;
    this.runBanner()
  }

  componentWillUnmount =()=>{
    clearInterval(this.intrl)
  }

  render(){
    return(
        <div>
          <ul className="banner">
          {this.props.items.map((src) =>
            <li key={src} name="imgs" style={{backgroundImage:`url(${src})`}}></li>
            )}
            <ul>
              {this.props.items.map((src,index) =>
                <li key={index} onClick={(e)=>this.changeBanner(e,index)}>●</li>
                )}
            </ul>
          </ul>
        </div>
      )
  }
}
