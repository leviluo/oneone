import React, { Component, PropTypes } from 'react'
import './postArticle.scss'
import Helmet from 'react-helmet'
import {connect} from 'react-redux'
import Input from '../../components/Input'
import Radio from '../../components/Radio'
import { tipShow } from '../../components/Tips/modules/tips'
import { findDOMNode } from 'react-dom'
import {submitArticle,getArticle} from './modules'

const colorItems = [
                    "#000000",
                    "#FFFFFF",
                    "#666666",
                    "#F0FFFF",
                    "#808A87",
                    "#CCCCCC",
                    "#808069",
                    "#FAFFF0",
                    "#E6E6E6",
                    "#FAF0E6",
                    "#F5F5F5",
                    "#FFFFCD",
                    "#FCE6C9",
                    "#FFF5EE",
                    "#FF0000",
                    "#FFFF00",
                    "#E3170D",
                    "#FF9912",
                    "#9C661F",
                    "#E3CF57",
                    "#FF7F50",
                    "#FFD700",
                    "#FF6347",
                    "#FF7D40",
                    "#FFC0CB",
                    "#FFE384",
                    "#B0171F",
                    "#FF8000",
                    "#FF00FF",
                    "#ED9121",
                    "#990033",
                    "#8B864E",
                    "#00FF00",
                    "#802A2A",
                    "#00FFFF",
                    "#C76114",
                    "#7FFF00",
                    "#F4A460",
                    "#40E0D0",
                    "#D2B48C",
                    "#082E54",
                    "#BC8F8F",
                    "#228B22",
                    "#A0522D",
                    "#6B8E23",
                    "#0000FF",
                    "#A020F0",
                    "#03A89E",
                    "#DA70D6",
                    "#191970",
                    "#8A2BE2",
                    "#00C78C",
                    "#9933FA"
];

const fontFamilyItems = [
    "Arial","Arial Narrow","Comic Sans MS","Courier New","Courier","Georgia",
    "Helvetica","Impact","Lucida Family","Lucida Sans Unicode",
    "Tahoma","Times New Roman","Trebuchet MS","Verdana",
    "宋体","微软雅黑","黑体","华文细黑","华文仿宋","华文黑体","华文楷体","楷体","方正姚体"
]

const headerItems = [
"P","H1","H2","H3","H4","H5","H6"
]

const fontSizeItems = []

for (var i = 2; i <= 10; i++) {
    fontSizeItems.push(i)
}

@connect(
  state=>({auth:state.auth}),
{tipShow})
export default class PostArticle extends Component{
        state = {
            isColor:false,
            isFontFamily:false,
            isFontSize:false,
            type:0,
            request:{}
        }

        componentDidMount=()=>{

            document.onclick = function(){
                this.closemodal()
            }.bind(this)

            if (this.props.params.type == "edit") {
                // var query = this.props.location.query
                getArticle(this.props.location.query.id).then(({data})=>{
                    var query = data.data
                    this.refs.header.setValue(query.title)

                    var items = []
                    this.initattachedImgs = query.attachedImgs
                    var arr = query.attachedImgs.split(',')
                    for (var i = 0; i < arr.length; i++) {
                        items.push({key:arr[i]})
                    }
                    // console.log(items)
                    this.setState({
                        type:query.type,
                        defaultContent:{__html:query.content},
                        imgs:items
                    })
                })
            }
        }

        componentDidUpdate=()=>{

        }

        componentWillUnmount=()=>{
            document.onclick = null
        }

        search =(lastnode)=>{
            if (lastnode==this.refs.content) {
                return true
            }else if(lastnode==document){
                return false
            }else{
                return this.search(lastnode.parentNode)
            }
        }

        getSelection =()=>{
            let selection = {};
            if(window.getSelection) {
            selection = window.getSelection()
            } else if(document.selection.createRange) {
            selection = document.selection.createRange()
            }
            return selection
        }

        closemodal = ()=>{
            this.setState({
                isColor:false,
                isFontFamily:false,
                isFontSize:false,
            })
        }

            
        setStyle = (e,action,value,changeColor)=>{
            if(e)e.nativeEvent.stopImmediatePropagation();

            let selection = this.getSelection().focusNode

            if (selection) {
                if(!this.search(selection))return
            }else{
                return
            }

            // if (!isIE()) {
                if (action=='formatBlock') {
                    let headers = document.getElementsByName('header')
                    for (var i = 0; i < headers.length; i++) {
                        headers[i].style.color = '#000'
                    }
                    e.target.style.color = 'rgb(24, 116, 205)'
                }
            // };

            this.refs.content.focus();
            document.execCommand(action, false, value);

            if(changeColor)e.target.style.color = e.target.style.color == 'rgb(24, 116, 205)' ? 'rgb(0,0,0)' :'rgb(24, 116, 205)'
            this.closemodal()
        }

        setColor = (e,action)=>{
            e.nativeEvent.stopImmediatePropagation();
            this.setState({
                colorAction:action,
                isColor:this.state.isColor ? false : true
            })
        }

        setFontfamily = (e)=>{
            e.nativeEvent.stopImmediatePropagation();
            this.setState({
                isFontFamily: this.state.isFontFamily ? false : true
            })
        }

        setFontsize = (e)=>{
            e.nativeEvent.stopImmediatePropagation();
            this.setState({
                isFontSize: this.state.isFontSize ? false : true
            })
        }

        searchStyle =(lastnode,items)=>{
            if (lastnode==this.refs.content) {
                return items
            }else{
                let item = items
                item.push(lastnode.parentNode.tagName)
                return this.searchStyle(lastnode.parentNode,item)
            }
        }

        chooseStyle = (e) =>{

            this.saveRange()

            this.closemodal()

            e.nativeEvent.stopImmediatePropagation();//react阻止冒泡

            let selection = this.getSelection();

            var items = this.searchStyle(selection.focusNode,[]);
            // console.log(items)
            for (var i = 0; i < document.getElementsByName('header').length; i++) {
                document.getElementsByName('header')[i].style.color = '#000'
            }
            for (var i = 0; i < document.getElementsByName('changeColor').length; i++) {
                document.getElementsByName('changeColor')[i].style.color = '#000'
            }
            for (var i = 0; i < items.length; i++) {
                if(items[i] == 'DIV'){
                    document.getElementsByName('header')[0].style.color = 'rgb(24, 116, 205)'
                    continue
                }
                if (items[i] == 'FONT' || items[i] == 'SPAN') {
                    continue
                }
                document.getElementById(items[i]).style.color='rgb(24, 116, 205)'
            }
            if (items.length<1) {
                document.getElementsByName('header')[0].style.color = 'rgb(24, 116, 205)'
            }
        }

        toolTips = (e)=>{
            let element = e.target.getElementsByTagName('span')[0]
            if (!element) {return}
            element.style.display = 'block'
        }

        toolTipsHide = (e)=>{
            let element = e.target.getElementsByTagName('span')[0]
            if (!element) {return}
            element.style.display = 'none'
        }

      static contextTypes = {
        router: React.PropTypes.object.isRequired
      };

      submitArticle =()=>{
          var header = this.refs.header.getValue().trim()
          var type = this.refs.type.getValue()
          var content = this.refs.content.innerHTML

          var flag = header.StringLen(1,50)

          if (flag) {
            this.props.tipShow({type:"error",msg:`标题${flag}`})
            return
          }

        var fd = new FormData(); 

        var file = []
        var content = content.replace(/<img\ssrc="data:image\/(png|jpeg|gif);base64,([0-9a-zA-Z\/\+=]+)">/g,function(_,$1,$2){
          var secret = Math.random() 
          fd.append(secret,this.convertBase64UrlToBlob($2))
          return secret
        }.bind(this))

          if (content.length < 10) {
            this.props.tipShow({type:"error",msg:"内容不能为空或者小于10个字符"})
            return
          }

          if (this.props.params.type=='edit') {
          fd.append("articleId",this.props.params.id)
          }
          // fd.append("attachs",attachs.slice(0,-1))
          fd.append("header",header)
          fd.append("type",type)
          fd.append("text",content)
          fd.append("organizationId",this.props.params.id)

          if (this.state.request['submitArticle']) return
            this.state.request['submitArticle'] = true
          submitArticle(fd).then(({data})=>{
            this.state.request['submitArticle'] = false
            if (data.status == 200) {
                this.props.tipShow({type:"success",msg:"发布成功,2S后跳回上一页"})
                setTimeout(()=>{
                    window.history.go(-1)
                // this.context.router.push(`/organizationsHome/${this.props.params.id}`)
                },2000)
                return
            }else{
                this.props.tipShow({type:"error",msg:data.msg})
                return
            }
          })
      }

      // base64转为file
    convertBase64UrlToBlob =(data)=>{
        // var data=url.split(',')[1];
        if (!data) {return}

        data=window.atob(data);
        var ia = new Uint8Array(data.length);
        for (var i = 0; i < data.length; i++) {
            ia[i] = data.charCodeAt(i);
        };
        // canvas.toDataURL 返回的默认格式就是 image/png
        var blob=new Blob([ia], {type:"image/png"});

        return blob
    }

    insertImage =(e)=>{
            // 判断文件类型
            var value = e.target.value
            if (!value)return
            var filextension=value.substring(value.lastIndexOf("."),value.length);
            filextension = filextension.toLowerCase();
            if ((filextension!='.jpg')&&(filextension!='.gif')&&(filextension!='.jpeg')&&(filextension!='.png')&&(filextension!='.bmp'))
            {
              this.props.tipShow({type:"error",msg:"文件类型不正确"})
              return;
            }
            var file = e.target.files[0]
            var reader = new FileReader();  

            reader.onload = function(e) {  
                var src = e.target.result;  
                this.insertContent()
                document.execCommand("InsertImage", false, src);
                this.saveRange()
            }.bind(this)

            reader.readAsDataURL(file); 
    }

    recordPoint = (e)=>{
        this.saveRange()
        if (e.keyCode == 13) {  //发送
            for (var i = 0; i < document.getElementsByName('header').length; i++) {
                document.getElementsByName('header')[i].style.color = '#000'
            }
            document.getElementsByName('header')[0].style.color = 'rgb(24, 116, 205)'
        } 
    }

      saveRange = ()=> {
           var selection = window.getSelection ? window.getSelection() : document.selection;
           if (!selection.rangeCount) return;
           var range = selection.createRange ? selection.createRange() : selection.getRangeAt(0);
           window._range = range;
      }

      insertContent = ()=> {
           if(!window._range){
             this.refs.text.focus()
             return
           }
           var selection, range = window._range;
           if (!window.getSelection) {
                range.collapse(false);
                range.select();
           } else {
                selection = window.getSelection ? window.getSelection() : document.selection;
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
           }   
      }

        render() {
            return (
                    <div className="postArticle">
                    <div className="postArticleTop">
                        <button className="btn-default" onClick={()=>window.history.go(-1)} href="javascript.void(0)">返回 <i className="fa fa-mail-reply"></i></button>
                    </div>
                      <Helmet title="发布" />
                        <div className="editor">
                        <h3>发布</h3>
                        <div>
                            <Input placeholder="不超过50个字符" type="text" ref="header" header="标题" />
                            <Radio header="类型" defaultValue={this.state.type} ref="type" items={[{key:0,value:"活动"},{key:1,value:"咨询"}]} />
                        </div>
                        <div className="toolBar" >
                            <div>
                                <button onClick={this.setFontfamily} onMouseOut={this.toolTipsHide} onMouseOver={this.toolTips} className='fa fa-font btn-default'><span>字体</span></button>
                                <button onClick={this.setFontsize} onMouseOut={this.toolTipsHide} onMouseOver={this.toolTips} className='fa fa-text-width btn-default'><span>字号</span></button>
                            </div>
                            <div>
                                <button onClick={(e)=>this.setColor(e,"ForeColor",null)} onMouseOut={this.toolTipsHide} onMouseOver={this.toolTips} className='btn-default fa fa-font' style={{color:"red"}}><span>字颜色</span></button>
                                <button onClick={(e)=>this.setColor(e,"BackColor",null)} onMouseOut={this.toolTipsHide} onMouseOver={this.toolTips} className='btn-default'><i className="fa fa-font" id="SPAN" target="backgroundtips" onMouseOut={this.toolTipsHide} onMouseOver={this.toolTips} style={{background:"red",color:'white',padding:'2px'}}><span>背景色</span></i><span>背景色</span></button>
                            </div>
                            <div>
                                <button className='btn-default fa fa-bold' id="B" onMouseOut={this.toolTipsHide} onMouseOver={this.toolTips} name="changeColor" onClick={(e)=>this.setStyle(e,"bold",null,true)}><span>粗体</span></button>
                                <button className='btn-default fa fa-italic' id="I" onMouseOut={this.toolTipsHide} onMouseOver={this.toolTips} name="changeColor" onClick={(e)=>this.setStyle(e,"italic",null,true)}><span>斜体</span></button>
                                <button className='btn-default fa fa-underline' id="U" onMouseOut={this.toolTipsHide} onMouseOver={this.toolTips} name="changeColor" onClick={(e)=>this.setStyle(e,"underline",null,true)}><span>下划线</span></button>
                                <button className='btn-default fa fa-strikethrough' id="STRIKE" onMouseOut={this.toolTipsHide} onMouseOver={this.toolTips} name="changeColor" onClick={(e)=>this.setStyle(e,"strikeThrough",null,true)}><span>删除线</span></button>
                            </div>
                            <div>
                                {headerItems.map((header) =>
                                  <button
                                  onMouseOut={this.toolTipsHide} onMouseOver={this.toolTips}
                                    className="btn-default btn-sm"
                                        key = {header} name="header" id={header}
                                        onClick={(e)=>this.setStyle(e,"formatBlock","<"+header+">",null)}
                                  >{header}<span>{header}标题</span></button>
                                )}
                            </div>
                            <div>
                            <div>
                                <button onMouseOut={this.toolTipsHide} onMouseOver={this.toolTips} onClick={(e)=>this.setStyle(e,"justifyLeft",null)} className='btn-default fa fa-align-left'><span>左对齐</span></button>
                                <button onMouseOut={this.toolTipsHide} onMouseOver={this.toolTips} onClick={(e)=>this.setStyle(e,"justifyCenter",null)} className='btn-default fa fa-align-center'><span>居中</span></button>
                                <button onMouseOut={this.toolTipsHide} onMouseOver={this.toolTips} onClick={(e)=>this.setStyle(e,"justifyRight",null)} className='btn-default fa fa-align-right'><span>右对齐</span></button>
                                <button onMouseOut={this.toolTipsHide} onMouseOver={this.toolTips} onClick={(e)=>this.setStyle(e,"justifyFull",null)} className='btn-default fa fa-align-justify'><span>两边对齐</span></button>
                            </div>
                            <div>
                                <button onMouseOut={this.toolTipsHide} onMouseOver={this.toolTips} className='btn-default fa fa-indent'  onClick={(e)=>this.setStyle(e,"indent",null)}><span>缩进</span></button>
                                <button onMouseOut={this.toolTipsHide} onMouseOver={this.toolTips} className='btn-default fa fa-outdent' onClick={(e)=>this.setStyle(e,"outdent",null)}><span>减少缩进</span></button>
                            </div>
                            <div>
                                <button onMouseOut={this.toolTipsHide} onMouseOver={this.toolTips} className='btn-default fa fa-list-ul' onClick={(e)=>this.setStyle(e,"insertUnorderedList",null)}><span>无序列表</span></button>
                                <button onMouseOut={this.toolTipsHide} onMouseOver={this.toolTips} className='btn-default fa fa-list-ol' onClick={(e)=>this.setStyle(e,"insertOrderedList",null)}><span>有序列表</span></button>
                            </div>
                            <div>
                                <button onMouseOut={this.toolTipsHide} onMouseOver={this.toolTips} className='btn-default fa fa-image' onClick={()=>this.refs.imageInput.click()}><span>图片</span></button>
                            </div>
                            </div>
                            {this.state.isColor && <div className="color">
                                        {colorItems.map((color) =>
                                          <button
                                                key = {color}
                                                style={{background:color}}
                                                onClick={(e)=>this.setStyle(e,this.state.colorAction,color)}
                                          />
                                        )}
                            </div>}
                            {this.state.isFontFamily && <div className="fontFamily">
                                        {fontFamilyItems.map((font) =>
                                          <button
                                                key = {font}
                                                style={{fontFamily:font}}
                                                onClick={(e)=>this.setStyle(e,"FontName",font)}
                                          >{font}</button>
                                        )}
                            </div>}
                            {this.state.isFontSize && <div className="fontsize">
                                        {fontSizeItems.map((font) =>
                                          <button
                                                key = {font}
                                                onClick={(e)=>this.setStyle(e,"fontsize",font)}
                                          >{font}</button>
                                        )}
                            </div>}
                        </div>
                        <div ref="content" className="content" dangerouslySetInnerHTML={this.state.defaultContent} onClick={this.chooseStyle} contentEditable onKeyUp={this.recordPoint}>
                        
                        </div>
                            <div className="addSubmit">
                              <button onClick={this.submitArticle} className="btn-success">提交</button>
                            </div>
                        </div>
                        <input onChange={this.insertImage} ref="imageInput" type="file" style={{display:"none"}}/>
                      </div>
                )
            ;
          }
}

