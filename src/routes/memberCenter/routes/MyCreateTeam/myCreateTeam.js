import React, {Component} from 'react'
import './myCreateTeam.scss'
import { connect } from 'react-redux'
import {Link} from 'react-router'

import { tipShow } from '../../../../components/Tips/modules/tips'
import Select from '../../../../components/Select'
import Confirm,{confirmShow} from '../../../../components/Confirm'
import Modal,{modalShow,modalHide,modalUpdate} from '../../../../components/Modal'
import {addOrganization,getCatelogy,getOrganizationByMe,modifyOrganization,deleteOrganization,getMyOrganization} from './modules'
// import {fetchCatelogue} from '../../../../reducers/category'
import {asyncConnect} from 'redux-async-connect'

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
    // catelogues:state.catelogues
    }),
  {modalShow,modalHide,modalUpdate,tipShow,confirmShow}
)

export default class myCreateTeam extends Component {

    state = {
      hasImg:false,
      items:[],
      OrganizationByMe:[]
    }

    static contextTypes = {
      router: React.PropTypes.object.isRequired
    };

    componentWillMount =()=>{
      getCatelogy().then(({data})=>{
        this.setState({
          items:data.data
        })
      })
     this.updateDate()
    }

    updateDate = ()=>{
      getOrganizationByMe().then(({data})=>{
        if (data.status == 200) {
          this.setState({
            OrganizationByMe:data.data
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
    this.setState({
      canvas:e.target.parentNode.parentNode.parentNode.getElementsByTagName('canvas')[0]
    })
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
    var ctx= this.state.canvas.getContext("2d");

    var X = (this.divcenter.offsetLeft - (400-image.width/ratio)/2) * ratio;
    var Y = (this.divcenter.offsetTop - (250-image.height/ratio)/2) * ratio;

    ctx.drawImage(image,X,Y,100*ratio,100*ratio,0,0,100,100)
    this.setState({
      hasImg:true
    })
    this.props.modalHide()
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

  modifyOrganization =(e,id,oname)=>{

    var name = this.refs['organizationName'+id].value;
    var brief = this.refs['organizationBrief'+id].value;

     if (!name || name.length > 38) {
      this.props.tipShow({type:"error",msg:"名称不为空或者大于30位字符"})
      return
    }

    if (!brief || brief.length > 995) {
      this.props.tipShow({type:"error",msg:"简介不为空或者大于1000位字符"})
      return
    }

    var img = this.state.canvas

    var fd=new FormData();

    if (this.state.hasImg) {
    var data=img.toDataURL();
    data=data.split(',')[1];
    data=window.atob(data);
    var ia = new Uint8Array(data.length);
    for (var i = 0; i < data.length; i++) {
        ia[i] = data.charCodeAt(i);
    };
    var blob=new Blob([ia], {type:"image/png"});
    fd.append('file',blob);
    }

    fd.append('name',name)
    fd.append('brief',brief)
    fd.append('id',id)

    modifyOrganization(fd).then(({data})=>{
      if (data.status == 200) {
        this.state[oname] = false
        this.setState({})
        this.updateDate()
      }else{
        this.props.tipShow({type:"error",msg:data.msg})
        return
      }
    })
  }

  verfied =(name,brief,speciality)=>{

    if (!name || name.length > 38) {
      this.props.tipShow({type:"error",msg:"名称不为空或者大于30位字符"})
      return
    }

    if (!brief || brief.length > 295) {
      this.props.tipShow({type:"error",msg:"简介不为空或者大于300位字符"})
      return
    }

    if (!speciality) {
      this.props.tipShow({type:"error",msg:"选择一个类目"})
      return
    }

    var img = this.state.canvas

    if (!this.state.hasImg) {
      this.props.tipShow({type:"error",msg:"选择一张头像"})
      return
    }
    var data=img.toDataURL();
    data=data.split(',')[1];
    data=window.atob(data);
    var ia = new Uint8Array(data.length);
    for (var i = 0; i < data.length; i++) {
        ia[i] = data.charCodeAt(i);
    };

    var blob=new Blob([ia], {type:"image/png"});
    var fd=new FormData();
    fd.append('file',blob);
    fd.append('name',name)
    fd.append('brief',brief)
    fd.append('categoryId',speciality)
    return fd
  }

  addOrganization =(e)=>{
    var name = this.refs.organizationName.value;
    var brief = this.refs.organizationBrief.value;
    var speciality = this.refs.speciality.getValue();
    var fd = this.verfied(name,brief,speciality)
    addOrganization(fd).then(({data})=>{
      if (data.status == 200) {
        this.setState({
          isShowAdd:false
        })
        this.updateDate()
      }else{
        this.props.tipShow({type:"error",msg:data.msg})
        return
      }
    })
  }

  createNew =()=>{
    if (this.state.OrganizationByMe.length > 4) {
      this.props.tipShow({type:"error",msg:"最多可创建5个社团"})
      return
    }
    this.setState({isShowAdd:this.state.isShowAdd ? false : true})
  }

  confirmDelete =()=>{
    if (!this.state.deleteId) {
      this.props.tipShow({type:"error",msg:"未选中条目"})
      return
    }
    deleteOrganization(this.state.deleteId).then(({data})=>{
      // console.log(data)
      if (data.status == 200) {
          for (var i = this.state.OrganizationByMe.length - 1; i >= 0; i--) {
            if(this.state.OrganizationByMe[i].id == this.state.deleteId){
              this.state.OrganizationByMe.splice(i,1)
              this.setState({})
              break;
            }
          };
      }else if (data.status==600) {
          this.props.dispatch({type:"AUTHOUT"})
          this.context.router.push('/login')
      }{
        this.props.tipShow({type:'error',msg:data.msg})
      }
    })
  }

  deleteOrganization =(e,id)=>{
    this.setState({
      deleteId:id
    })
    this.props.confirmShow({submit:this.confirmDelete})
  }

  render () {
    return (
    <div className="team">
        <div className="createTeam">
            {this.state.OrganizationByMe.length == 0 && <div className="text-center">您还没有创建社团耶~</div>}
            {this.state.OrganizationByMe.map((item,index)=>{
              var headImg = `/originImg?name=${item.head}&from=organizations`
              var date = new Date(item.time)
              var time = `${date.getFullYear()}-${(date.getMonth()+1)< 10 ? '0'+(date.getMonth()+1) :(date.getMonth()+1) }-${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()}`
              var organizationName = `organizationName${item.id}`
              var organizationBrief = `organizationBrief${item.id}`
              var link = `/organizationsHome/${item.id}`
              var linkApproval = `/memberCenter/requestApproval/${item.id}`
              return <div className="items" key = {index}>
                      {!this.state[item.name] && <div>{item.name}<span><Link to={link} >去社团主页</Link><Link to={linkApproval} >{item.requests > 0 && <span className="noRead">{item.requests}</span>}&nbsp;入社申请</Link><a onClick={(e)=>{this.state[item.name] = true;this.setState({})}}><i className="fa fa-edit"></i>修改</a><a onClick={(e)=>this.deleteOrganization(e,item.id)}><i className="fa fa-trash"></i>解散</a></span></div>}
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
            <div className="addBtn">
              <button className="btn-success" onClick={this.createNew}>创建新社团</button>
            </div>
            {this.state.isShowAdd && <ul className="addNew">
              <li>
                <p>&lt;1.选择社团头像</p>
                <div>
                <button className="btn-default modifyHead">选择图片<input onChange={this.modifyHead} type="file" /></button>
                </div>
                <canvas id="showEdit" width="100" height="100" ></canvas>
              </li>
              <li>
                <p>&lt;2.选择类目</p>
                <div>
                    <Select header="选择类目" optionsItems={this.state.items} ref="speciality" />
                </div>
              </li>
              <li>
                <p>&lt;3.名称</p>
                <div>
                <input ref="organizationName" type="text"/>
                </div>
              </li>
              <li>
                <p>&lt;4.填写简介</p>
                <div>
                <textarea ref="organizationBrief" cols="30" rows="10" defaultValue="不超过300个字符"></textarea>
                </div>
              </li>
              <li>
                <p>&lt;5.提交</p>
                <div>
                <button onClick={()=>{this.setState({isShowAdd:false})}} className="btn-default">取消</button>
                <button onClick={this.addOrganization} className="submit btn-success">提交</button>
                </div>
              </li>
            </ul>}
        </div>
        <Modal />
        <Confirm />
    </div>
    )
  }
}

myCreateTeam.propTypes = {
  auth: React.PropTypes.object
}
