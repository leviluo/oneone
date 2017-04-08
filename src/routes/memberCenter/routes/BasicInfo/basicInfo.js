import React, {Component} from 'react'
// import Select from '../../../../components/Select'
import Textarea from '../../../../components/Textarea'
import './basicInfo.scss'
import { connect } from 'react-redux'
import { tipShow } from '../../../../components/Tips/modules/tips'
import {modifyBrief,commitHeadImg,getMemberInfo,addSpeciatity,fetchSpeciality,modifyNickname,modifyAddress,modifySpeciality,updateSpeciality,deleteSpeciality,submitPhotos} from './modules/basicInfo'
import Modal,{modalShow,modalHide} from '../../../../components/Modal'
import Confirm,{confirmShow} from '../../../../components/Confirm'
import CustomSelect from '../../../../components/CustomSelect'
import {fetchCatelogue} from '../../../../reducers/category'
import {modifyNickname as modifyname} from '../../../../reducers/auth'
import {asyncConnect} from 'redux-async-connect'
import {Link} from 'react-router'

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    const promises = [];
    // if (!getState().myspecialities.isloaded) {
      promises.push(dispatch(fetchSpeciality()));
    // }
    if (!getState().catelogues.isloaded) {
      promises.push(dispatch(fetchCatelogue()));
    }
    return Promise.all(promises);
  }
}])

@connect(
  state => ({
    auth:state.auth,
    myspecialities:state.myspecialities,
    catelogues:state.catelogues
    }),
  {modalShow,modalHide,tipShow,commitHeadImg,addSpeciatity,modifyname,updateSpeciality,fetchSpeciality,confirmShow}
)

export default class BasicInfo extends Component {

  state ={
    content: <div></div>,
    memberInfo: [],
    imgs:[],
    headImg:'',
    request:{}
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentWillMount =()=>{
    getMemberInfo().then(({data}) => {
        if (data.status==200) {
            this.setState({
              memberInfo:data.data[0],
              headImg:"/originImg?from=member&name="+data.data[0].id
            })
        }else if (data.status==600) {
            this.props.dispatch({type:"AUTHOUT"})
            this.context.router.push('/login')
        }{
          this.props.tipShow({type:'error',msg:data.msg})
        }
      })
  }


   modifyHead =(e)=>{
    //判断文件类型
    var value = e.target.value
    var filextension=value.substring(value.lastIndexOf("."),value.length);
    filextension = filextension.toLowerCase();
    if ((filextension!='.jpg')&&(filextension!='.gif')&&(filextension!='.jpeg')&&(filextension!='.png')&&(filextension!='.bmp'))
    {
    this.props.tipShow({type:'error',msg:'文件类型不正确'})
    return;
    }

    if (document.getElementById('editCanvas')) { //清空画布
      document.getElementById('editCanvas').getContext("2d").clearRect(0,0,300,150);  
    }

    var imageUrl = window.URL.createObjectURL(e.target.files[0])
    var content = <div id="headerEdit" onWheel={this.imgZoom} style={{width:"400px",height:'250px',position:'relative',margin:'0 auto',backgroundImage:`url(${imageUrl})`,backgroundPosition:'center',backgroundRepeat:'no-repeat',backgroundSize:'100%'}}>
                <div style={{width:'400px',height:'75px',float:'left',margin:'0',background:'rgba(0,0,0,0.4)'}}></div>
                <div style={{width:'150px',height:'100px',float:'left',margin:'0',background:'rgba(0,0,0,0.4)'}}></div>
                <canvas id="editCanvas" width="100" height="100" style={{width:'100px',height:'100px',float:'left',margin:'0',cursor:'move',border:'1px solid white'}} onMouseDown={this.start} onMouseUp={this.end} onMouseOut={this.end} ></canvas>
                <div style={{width:'150px',height:'100px',float:'left',margin:'0',background:'rgba(0,0,0,0.4)'}}></div>
                <div style={{width:'400px',height:'75px',float:'left',margin:'0',background:'rgba(0,0,0,0.4)'}}></div>
                <img id="editImg" src={imageUrl} alt="" style={{display:'none'}}/>
      </div>

    this.props.modalShow({header:"修改头像",content:content,submit:this.modifyHeadSubmit})
  }

  imgZoom =(e)=>{ //放大缩小图片
    var element = document.getElementById('headerEdit')
    if(parseFloat(element.style.backgroundSize.slice(0,-1))>400){
      element.style.backgroundSize = "400%"
      return
    }
    if(parseFloat(element.style.backgroundSize.slice(0,-1))<25){
      element.style.backgroundSize = "25%"
      return
    }
    if(e.deltaY > 0){
      element.style.backgroundSize = parseFloat(element.style.backgroundSize.slice(0,-1))/1.1+'%'
    }else{
      element.style.backgroundSize = parseFloat(element.style.backgroundSize.slice(0,-1))*1.1+'%'
    }
  }


  modifyHeadSubmit =()=>{ //提交
    this.editInit()
    var element = document.getElementById('headerEdit')
    var image = document.getElementById('editImg')
    var ratio = image.width*100/(400*parseFloat(element.style.backgroundSize.slice(0,-1)))
    var ctx=this.divcenter.getContext("2d");

    var X = (this.divcenter.offsetLeft - (400-image.width/ratio)/2) * ratio;
    var Y = (this.divcenter.offsetTop - (250-image.height/ratio)/2) * ratio;

    ctx.drawImage(image,X,Y,100*ratio,100*ratio,0,0,100,100)

    var url = this.divcenter.toDataURL();

    var fd=new FormData();
    fd.append('file',this.convertBase64UrlToBlob(url));
    // console.log(fd)
    if (this.state.request['modifyHeadSubmit']) return
        this.state.request['modifyHeadSubmit'] = true
    this.props.commitHeadImg(fd).then((data)=>{
        this.state.request['modifyHeadSubmit'] = false
      if (data.status == 200) {
        this.setState({
          headImg:"/originImg?from=member&name="+this.state.memberInfo.id+"&"+Math.random()
        })
      }else{
        this.props.tipShow({
          type:"error",
          msg:data.mag
        })
      }
    })
    this.props.modalHide()
  }
// base64转为file
  convertBase64UrlToBlob =(url)=>{
    var data=url.split(',')[1];
    // console.log(data)
    data=window.atob(data);
    // console.log(data)
    var ia = new Uint8Array(data.length);
    for (var i = 0; i < data.length; i++) {
        ia[i] = data.charCodeAt(i);
    };
    // canvas.toDataURL 返回的默认格式就是 image/png
    var blob=new Blob([ia], {type:"image/png"});

    return blob
  }

  editInit=(e)=>{
    var headerEdit = document.getElementById('headerEdit')
    if(!this.divtop)this.divtop = headerEdit.getElementsByTagName('div')[0]
    if(!this.divcenterLeft)this.divcenterLeft = headerEdit.getElementsByTagName('div')[1]
    if(!this.divcenter)this.divcenter = headerEdit.getElementsByTagName('canvas')[0]
    if(!this.divcenterRight)this.divcenterRight = headerEdit.getElementsByTagName('div')[2]
    if(!this.divottom)this.divottom = headerEdit.getElementsByTagName('div')[3]
  }

  start =(e)=>{ //可移动选区
    this.editInit()
    var startX = e.clientX;
    var startY = e.clientY; 
    document.onmousemove = (e)=>{
         var diffX = e.clientX - startX
         var diffY = e.clientY - startY
         var divtopH = Math.min(150,parseFloat(this.divtop.style.height.slice(0,-2))+ diffY)
         var divleftW = Math.min(300,parseFloat(this.divcenterLeft.style.width.slice(0,-2))+ diffX)
         divleftW = Math.max(0,divleftW)
         if (divleftW == 0) {
          this.divcenterLeft.style.height = 0;
         }else{
          this.divcenterLeft.style.height = '100px';
         }
         this.divtop.style.height = divtopH + 'px';
         this.divcenterLeft.style.width = divleftW + 'px'
         this.divcenterRight.style.width = 300 - divleftW + 'px'
         this.divottom.style.height = (150-divtopH) + 'px';
         startX = e.clientX;
         startY = e.clientY;
    }
  }

  end =(e)=>{
    document.onmousemove = null;
  }

  addSpeciatity=()=>{

    var speciality = this.refs.speciality.getValue().trim()
    var brief = this.refs.brief.value.trim()
    var experience = this.refs.experience.value.trim()

    if (!speciality) {
      this.props.tipShow({type:"error",msg:"选择一个专业"})
      return
    }
    if (!brief || brief.length > 300) {
      this.props.tipShow({type:"error",msg:"简介在1到300个字符之间"})
      return
    }
    if (!experience || experience.length > 300) {
      this.props.tipShow({type:"error",msg:"相关经验在1~300个字符"})
      return
    }
    if(this.state.request['addSpeciatity'])return
    this.state.request['addSpeciatity'] = true;
    this.props.addSpeciatity({speciality:speciality,brief:brief,experience:experience})
    .then(({data}) => {
    this.state.request['addSpeciatity'] = false;
      if (data.status==200) {
          this.setState({showAddSpeciality:false})
          var items = {
            id:data.result.insertId,
            work:null,
            memberId:this.props.auth.memberId,
            speciality:speciality,
            brief:brief,
            experience:experience
          }
          items.memberId = this.props.auth.memberId
          this.props.dispatch({type:"ADD_SPECIALITIES",value:items})
      }else if(data.status==600){
          this.props.dispatch({type:"AUTHOUT"})
          this.context.router.push('/login')
      }
      else{
          this.props.dispatch(tipResult({type:"error",msg:data.msg}))
      }
    })

  }

  showDeleteImg=(e,index)=>{
    e.target.style.filter = "alpha(opacity=0.8)"
    e.target.style.opacity = "80"
    var me = this
    e.target.onclick=function(){
      me.state.imgs.splice(index,1)
      me.setState({})
    }
  }

  modifyDeleteImg=(e)=>{
    e.target.style.filter = "alpha(opacity=0.8)"
    e.target.style.opacity = "80"
    var me = this
    e.target.onclick=function(e){
      e.srcElement.parentNode.parentNode.removeChild(e.srcElement.parentNode)
      for (var i = 0; i < me.state.modifyImgs.length; i++) {
        if(`/img?from=speciality&name=${me.state.modifyImgs[i].key}` == e.target.getAttribute('name')){
          me.state.modifyImgs.splice(i,1)
        }
      }
      me.setState({})
    }
  }

  hideDeleteImg=(e)=>{
    e.target.style.filter = "alpha(opacity=0)"
    e.target.style.opacity = "0"
  }

  addWorks = (e)=>{
      if (this.state.imgs.length > 7) {
        this.props.tipShow({type:'error',msg:'只能添加8张图片'})
        return;
      };
      var value = e.target.value
      var filextension=value.substring(value.lastIndexOf("."),value.length);
      filextension = filextension.toLowerCase();
      if ((filextension!='.jpg')&&(filextension!='.gif')&&(filextension!='.jpeg')&&(filextension!='.png')&&(filextension!='.bmp'))
      {
      this.props.tipShow({type:'error',msg:'文件类型不正确'})
      return;
      }

      // var imageUrl = window.URL.createObjectURL(e.target.files[0])
      this.state.imgs.push(e.target.files[0])
      this.setState({})
  }

  saveNickname =(e)=>{
    var nickname = this.refs.nickname.value.trim()
    var flag = nickname.StringFilter(1,20)
    if (flag) {
      this.props.tipShow({type:'error',msg:`昵称${flag}`})
      return
    }
    if(this.state.request['saveNickname'])return
    this.state.request['saveNickname'] = true;
    modifyNickname({nickname:nickname}).then(({data})=>{
    this.state.request['saveNickname'] = false;
      if (data.status == 200) {
        this.props.modifyname(nickname)
        this.setState({
          showNickname:false
        })
      }else if (data.status==600) {
          this.props.dispatch({type:"AUTHOUT"})
            this.context.router.push('/login')
      }else{
        this.props.tipShow({type:'error',msg:data.msg})
      }
    })
  }

  saveAddress =(e)=>{
    var address = this.refs.address.value.trim()
    var flag = address.StringFilter(1,100)
    if (flag) {
      this.props.tipShow({type:'error',msg:`地址${flag}`})
      return
    }
    if(this.state.request['saveAddress'])return
    this.state.request['saveAddress'] = true;
    modifyAddress({address:address}).then(({data})=>{
    this.state.request['saveAddress'] = false;
      if (data.status == 200) {
            this.state.memberInfo.address = address
            this.setState({
              showAddress:false,
              address:address
            })
      }else if (data.status==600) {
          this.props.dispatch({type:"AUTHOUT"})
            this.context.router.push('/login')
      }else{
        this.props.tipShow({type:'error',msg:data.msg})
      }
    })

  }

  cancelSpeciality =(e,name)=>{
    this.state[name] = false
    this.setState({})
  }

  saveSpeciality=(e,speciality)=>{

    var brief = this.refs[speciality+'brief'].value.trim()
    var experience = this.refs[speciality+'experience'].value.trim()

    if (!speciality) {
      this.props.tipShow({type:"error",msg:"专业不为空"})
      return
    }

    if (!brief || brief.length > 300) {
      this.props.tipShow({type:"error",msg:"简介在1到300个字符之间"})
      return
    }

    if (!experience || experience.length > 300) {
      this.props.tipShow({type:"error",msg:"相关经验在1~300个字符"})
      return
    }
    if(this.state.request['saveSpeciality'])return
    this.state.request['saveSpeciality'] = true;
    modifySpeciality({speciality:speciality,brief:brief,experience:experience}).then(({data})=>{
    this.state.request['saveSpeciality'] = false;
      if (data.status == 200) {
        this.state[speciality] = false
        this.setState({})
        this.props.fetchSpeciality()
      }else if (data.status==600) {
          this.props.dispatch({type:"AUTHOUT"})
            this.context.router.push('/login')
        }{
          this.props.tipShow({type:'error',msg:data.msg})
        }
    })
  }

  confirmDelete =()=>{
    if (!this.state.speciality) {
      this.props.tipShow({type:"error",msg:"专业不为空"})
      return
    }
    if(this.state.request['confirmDelete'])return
    this.state.request['confirmDelete'] = true;
    deleteSpeciality({speciality:this.state.speciality}).then(({data})=>{
    this.state.request['confirmDelete'] = false;
      if (data.status == 200) {
          var data = this.props.myspecialities.text.concat();
          for (var i = data.length - 1; i >= 0; i--) {
            if(data[i].speciality == this.state.speciality){
              data.splice(i,1)
              break;
            }
          };
          this.props.updateSpeciality(data)
          this.state[this.state.speciality] = false
          this.setState({})
      }else if (data.status==600) {
          this.props.dispatch({type:"AUTHOUT"})
            this.context.router.push('/login')
        }{
          this.props.tipShow({type:'error',msg:data.msg})
        }
    })
  }

  deleteSpeciality=(e,speciality)=>{
    this.setState({
      speciality:speciality
    })
    this.props.confirmShow({submit:this.confirmDelete,text:"此操作会删除该条目下的作品集,确定继续吗？"})
  }

  showAddSpeciality=()=>{
    if (this.props.myspecialities.text.length > 4) {
      this.props.tipShow({type:"error",msg:"只能添加5项专业"})
      return
    };
    this.setState({
      showAddSpeciality:true,
    })
  }

  savePhotos =(e,id,name)=>{
    // console.log(this.state.imgs    var fd = new FormData(); 
    for (var i = 0; i < this.state.imgs.length; i++) {
      if(this.state.imgs[i].file){
          fd.append("file", this.state.imgs[i].file)
      }
    }
    fd.append("id", id)

    if(this.state.request['savePhotos'])return
    this.state.request['savePhotos'] = true;

    submitPhotos(fd).then(({data})=>{
    this.state.request['savePhotos'] = false;
      if (data.status == 200) {
          this.props.tipShow({type:'success',msg:"上传成功"})
          this.props.fetchSpeciality()
          this.cancelPhotos(e,name)
        }else if (data.status==600) {
          this.props.dispatch({type:"AUTHOUT"})
          this.context.router.push('/login')
        }{
          this.props.tipShow({type:'error',msg:data.msg})
        }
    })
  }

  cancelPhotos = (e,name)=>{
    this.setState({
      imgs:[],
      addTO:''
    })
    this.refs[`add${name}`].innerHTML = '';
  }

  hideDeleteImg=(e)=>{
          e.target.style.filter = "alpha(opacity=0)"
          e.target.style.opacity = "0"
        }

  showDeleteImg=(e,index)=>{
    e.target.style.filter = "alpha(opacity=0.8)"
    e.target.style.opacity = "80"
    var me = this
    e.target.onclick=function(e){
      e.srcElement.parentNode.parentNode.removeChild(e.srcElement.parentNode)
      for (var i = 0; i < me.state.imgs.length; i++) {
          if(me.state.imgs[i].key == e.target.getAttribute('name')){
              me.state.imgs.splice(i,1)
              break
          }
      }
      me.setState({})
    }
  }

  saveBrief =()=>{
    var brief = this.refs.brief.value.trim()
    var flag = brief.StringFilter(1,100)
    if (flag) {
      this.props.tipShow({type:"error",msg:`简介${flag}`})
      return
    }
    modifyBrief({brief:brief}).then(({data})=>{
      if (data.status == 200) {
        this.state.memberInfo.brief = brief;
        this.setState({
          showBrief:false
        })
      }else{
        this.props.tipShow({type:'error',msg:data.msg})
      }
    })
  }

  addImages = (e,name)=>{
    if (this.state.addTO && (this.state.addTO != name)) {
      this.props.tipShow({type:'error',msg:'上传前请先提交其它已选择的照片'})
      return
    }
          var value = e.target.value
          var filextension=value.substring(value.lastIndexOf("."),value.length);
          filextension = filextension.toLowerCase();
          if ((filextension!='.jpg')&&(filextension!='.gif')&&(filextension!='.jpeg')&&(filextension!='.png')&&(filextension!='.bmp'))
          {
          this.props.tipShow({type:'error',msg:'文件类型不正确'})
          return;
          }

          for (var i = e.target.files.length - 1; i >= 0; i--) {
              var fileUrl = window.URL.createObjectURL(e.target.files[i])
              var div = document.createElement('div')
              div.className = "imgList"
              div.style.backgroundImage = `url(${fileUrl})`

              var divDelete = document.createElement('div')
              divDelete.onmouseout = this.hideDeleteImg
              divDelete.onmouseover = this.showDeleteImg
              divDelete.className = "fa fa-trash"
              var key = Date.parse(new Date())
              divDelete.setAttribute('name',key)

              div.appendChild(divDelete)

              this.refs[`add${name}`].appendChild(div)

              this.state.imgs.push({key:key,file:e.target.files[i]})
          };
          this.setState({addTO:name})
      }

  render () {
    var items = [];
    this.props.catelogues.text.map((item,index)=>{
      items.push({key:item.parentCatelogue,list:item.childCatelogue})
    })
    let nickname = this.props.auth.nickname
    // var headSrc = "/originImg?from=member&name="+this.state.memberInfo.phone
    return (
    <div>
          <div id="basicInfo">
            <div>
              <div>
                <img src={this.state.headImg} />
                <a className="fa fa-image"><input onChange={this.modifyHead} type="file" /></a>
              </div>
              <div className="follow">
                <span className="lightColor">关注</span>&nbsp;<strong><Link to={`/follows/${this.props.auth.memberId}`}>{this.state.memberInfo.follows}</Link></strong>
                &nbsp;<span className="lightColor">粉丝</span>&nbsp;<strong><Link to={`/follows/${this.props.auth.memberId}`}>{this.state.memberInfo.fans}</Link></strong>
              </div>
            </div>
              <ul>
                <li><h3><hr /><span>电话</span></h3><p>{this.state.memberInfo.phone}</p></li>
                <li><h3><hr /><span>性别</span></h3><p>{this.state.memberInfo.sex == 0 ? "男" : "女"}</p></li>
                <li><h3><hr /><span>昵称</span></h3><p>{nickname}</p>{this.state.showNickname && <p><input type="text" ref="nickname" defaultValue={nickname} /> <button className="btn-default" onClick={()=>this.setState({showNickname:false})}>取消</button><button className="btn-success" onClick={this.saveNickname}>保存</button></p>}<a className="btn-normal" onClick={()=>this.setState({showNickname:true})}><i className="fa fa-edit"></i>修改</a></li>
                <li><h3><hr /><span>个人简介</span></h3><p>{this.state.memberInfo.brief ? this.state.memberInfo.brief : "您还没有填写个人简介哦,快点填写一个吧！"}</p>{this.state.showBrief && <p><input type="text" ref="brief" defaultValue={this.state.memberInfo.brief} /> <button className="btn-default" onClick={()=>this.setState({showBrief:false})}>取消</button><button className="btn-success" onClick={this.saveBrief}>保存</button></p>}<a className="btn-normal" onClick={()=>this.setState({showBrief:true})}><i className="fa fa-edit"></i>修改</a></li>
                <li><h3><hr /><span>详细地址</span></h3><p>{this.state.memberInfo.address}</p>{this.state.showAddress && <p><input ref="address" type="text" defaultValue={this.state.memberInfo.address} /> <button className="btn-default" onClick={()=>this.setState({showAddress:false})}>取消</button><button className="btn-success" onClick={this.saveAddress}>保存</button></p>}<a className="btn-normal" onClick={()=>this.setState({showAddress:true})}><i className="fa fa-edit"></i>修改</a></li>
                <li><h3><hr /><span>专长领域</span></h3></li>
                <li>
                  {this.props.myspecialities.text.map((item,index)=>{
                    var brief = `${item.speciality}brief`;
                    var experience = `${item.speciality}experience`;
                    var linkPhotos = `/works/${item.id}`
                    var ref= `add${item.speciality}`
                    return <ul key={index}>
                      <li><b>{item.speciality}</b><a onClick={(e)=>this.deleteSpeciality(e,item.speciality)}><i className="fa fa-trash"></i>删除</a><a onClick={(e)=>{this.state[item.speciality] = true;this.setState({})}}><i className="fa fa-edit"></i>修改</a></li>
                      {!this.state[item.speciality] && <li className="article"><strong>简介</strong><p dangerouslySetInnerHTML={{__html:item.brief}}></p></li>}
                      {!this.state[item.speciality] && <li className="article"><strong>经验</strong><p dangerouslySetInnerHTML={{__html:item.experience}}></p></li>}
                      {!this.state[item.speciality] && <li><strong>作品集</strong><br/><br/>
                        <div>
                        {item.work && <ul>
                          {item.work.split(',').map((item,index)=>{
                            return <li key={index}><div style={{backgroundImage:`url(/img?name=${item}&from=speciality)`}}></div></li>
                          })}
                          <li><Link to={linkPhotos} >查看更多&gt;</Link></li>
                          </ul>
                        }
                          <div className="addDiv">添加+<input type="file" onChange={(e)=>this.addImages(e,item.speciality)} multiple/></div>
                        </div>
                        <div className="preSubmit"><div ref={ref} className="add"></div>
                        {(this.state.imgs.length > 0 && this.state.addTO == item.speciality) && <div className="submit"><button onClick={(e)=>this.cancelPhotos(e,item.speciality)} className="btn-default">取消</button>&nbsp;&nbsp;<button onClick={(e)=>this.savePhotos(e,item.id,item.speciality)} className="btn-success">上传</button></div>}
                        </div>
                        </li>}
                      {this.state[item.speciality] && <li className="editLi">
                        <strong>简介</strong><a className="pull-right" onClick={(e)=>this.saveSpeciality(e,item.speciality)}>保存</a><a className="pull-right" onClick={(e)=>this.cancelSpeciality(e,item.speciality)}>取消</a>
                        <textarea rows="4" ref={brief} defaultValue={item.brief}></textarea>
                        <br/>
                        <br/>
                        <strong>经验</strong><br /><br /><textarea ref={experience} defaultValue={item.experience} rows="10"></textarea>
                      </li>}
                    </ul>
                  }
                    )}
                    <div style={{marginTop:"30px",clear:'both'}} ><button onClick={this.showAddSpeciality} className="btn-success">+添加专长</button>
                    </div>
                </li>
                  {this.state.showAddSpeciality && <div className="addSpeciality">
                  <table>
                      <tbody>
                      <tr>
                      <td><strong>专长</strong></td>
                      <td><CustomSelect ref="speciality" items={items}/></td>
                      </tr>
                      <tr><td><strong>简介</strong></td>
                      <td><textarea  rows="4" ref="brief" /></td>
                      </tr>
                      <tr>
                      <td><strong>经验</strong></td>
                      <td><textarea  rows="4" ref="experience" /></td>
                      </tr>
                      </tbody>
                  </table>
                  <div className="addSubmit text-center">
                      <button onClick={()=>this.setState({showAddSpeciality:false})} className="btn-default">取消</button>&nbsp;&nbsp;&nbsp;
                      <button onClick={this.addSpeciatity} className="btn-success">保存</button>
                    </div>
                  </div>}
              </ul>
          </div>
          <Modal />
          <Confirm />
    </div>
    )
  }
}

BasicInfo.propTypes = {
  auth: React.PropTypes.object
}
