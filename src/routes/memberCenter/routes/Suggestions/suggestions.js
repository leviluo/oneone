import React, {Component} from 'react'
import './index.scss'
import { connect } from 'react-redux'
import {Link} from 'react-router'
import {asyncConnect} from 'redux-async-connect'
import { tipShow } from '../../../../components/Tips/modules/tips'
import {submitText} from './modules'
import {loadingShow,loadingHide} from '../../../../components/Loading'

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
  {tipShow,loadingShow,loadingHide}
)

export default class Suggestions extends Component {



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
    // if (e.keyCode == 13) {
    //   this.sendMsg()
    // }
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

  submit =()=>{

      var html = this.refs.text.innerHTML;
      var contact = this.refs.contact.value.trim();
      if (!contact) {
        this.props.tipShow({type:"error",msg:"请填写您的联系方式"})
        return
      }
      if (contact.length > 40) {
        this.props.tipShow({type:"error",msg:"您的联系方式不超过40个字符"})
        return
      }
      var fd = new FormData(); 
      var file = []
      var content = html.replace(/<img\ssrc="data:image\/(png|jpeg|gif);base64,([0-9a-zA-Z\/\+=]+)">/g,function(_,$1,$2){
        var secret = Math.random() 
        fd.append(secret,this.convertBase64UrlToBlob($2))
        // file.push({key:secret,file:this.convertBase64UrlToBlob($2)})
        return secret
      }.bind(this))
      // console.log(content)
      if (!content || content.length > 3000 ) {
        this.props.tipShow({type:"error",msg:"回复内容在1~3000个字符"})
        return //过滤只有制表符
      }
      // fd.append('file',file)
      fd.append('text',content)
      fd.append('contact',contact)
      // if (this.state.flag['sendMsg']) return
      // this.state.flag['sendMsg'] = true;
      this.props.loadingShow()
      submitText(fd).then(({data}) => {
        this.props.loadingHide()
        if (data.status==200) {
            this.props.tipShow({type:"success",msg:data.msg})
            this.refs.text.innerHTML = ""
            this.refs.contact.value = ""
        }else{
            this.props.tipShow({type:"error",msg:"发送失败"})
        }
      }).then(()=>{
            this.refs.text.value = ''
            this.refs.text.focus()
      })

  }

  render () {
    return (
    <div id="suggestions">
      <h3>非常感谢您的建议与反馈！</h3>
      <div className="contact">
        您的联系方式：<input type="text" ref="contact" placeholder="电话或邮箱" />
      </div>
      <div className="content" contentEditable="true" ref="text" onKeyUp={this.recordPoint} onClick={this.recordPoint} >

      </div>

      <div className="footer">
          <strong><a className="fa fa-image" onClick={()=>{this.refs.imageInput.click()}}></a></strong>
          <input onChange={this.insertImage} ref="imageInput" type="file" style={{display:"none"}}/>
      </div>

      <div>
        <button className="btn btn-success pull-right" onClick={this.submit}>提交</button>
      </div>

    </div>
    )
  }
}

// updates.propTypes = {
//   auth: React.PropTypes.object
// }
