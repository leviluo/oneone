import React, {Component} from 'react'
import './index.scss'
import { connect } from 'react-redux'
import {Link} from 'react-router'
import {asyncConnect} from 'redux-async-connect'
import { tipShow } from '../../../../components/Tips/modules/tips'
import {getCatelogues,addNewItem,modifyItem,deleteItem} from './modules'

import Modal,{modalShow,modalHide} from '../../../../components/Modal'
import Confirm,{confirmShow} from '../../../../components/Confirm'

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
  {tipShow,confirmShow,modalShow,modalHide}
)

export default class specialitiesManage extends Component {

  state = {
    isShow:{},
    items:[]
  }

  componentWillMount =()=>{
    getCatelogues().then(({data})=>{
      if (data.status == 200) {
        this.setState({
          items:data.result
        })
      }else{
        this.props.tipShow({type:"error",msg:data.msg})
      }
    })
  }

  itemNameChange=(e)=>{
    this.setState({
      NewItemName:e.target.value
    })
  }

  modifyItem=(item)=>{
    this.setState({
      NewItemName:item.childCatelogue
    })
    var content = <input type="text" defaultValue={item.childCatelogue} onChange={this.itemNameChange}/>

    var modifyItemName = ()=>{
      var childId = item.childCatelogueId
      var itemName = this.state.NewItemName.trim()
      var flag = itemName.inputVerify(20)
      if ( flag != true) {
        this.props.tipShow({type:"error",msg:flag})
        return
      }
      modifyItem({id:childId,itemName:itemName,type:"childCatelogue"}).then(({data})=>{

        if (data.status == 200) {
          item.childCatelogue = itemName
          this.setState({})
          this.props.modalHide()
          this.props.tipShow({type:"success",msg:data.msg})
        }else{
          this.props.tipShow({type:"error",msg:data.msg})
        }
      })
    }

    this.props.modalShow({header:"修改名称",content:content,submit:modifyItemName})
  }

  modifyParentCate=(item)=>{
    this.setState({
      NewItemName:item.parentCatelogue
    })
    var content = <input type="text" defaultValue={item.parentCatelogue} onChange={this.itemNameChange}/>

    var modifyItemName = ()=>{
      var parentId = item.parentCatelogueId
      var itemName = this.state.NewItemName.trim()
      var flag = itemName.inputVerify(20)
      if ( flag != true) {
        this.props.tipShow({type:"error",msg:flag})
        return
      }
      modifyItem({id:parentId,itemName:itemName,type:"parentCatelogue"}).then(({data})=>{
        if (data.status == 200) {
          item.parentCatelogue = itemName
          this.setState({})
          this.props.modalHide()
          this.props.tipShow({type:"success",msg:data.msg})
        }else{
          this.props.tipShow({type:"error",msg:data.msg})
        }
      })
    }

    this.props.modalShow({header:"修改名称",content:content,submit:modifyItemName})
  }


  deleteItem=(item,index)=>{
    var confirmDelete = ()=>{
      var id = item.list[index].childCatelogueId
      if (!id) {
        this.props.tipShow({type:"error",msg:"缺少id"})
        return
      }
      deleteItem(id,"childCatelogue").then(({data})=>{
        if (data.status == 200) {        
          delete item.list[index]
          this.setState({})
          this.props.tipShow({type:"success",msg:data.msg})
        }else{
          this.props.tipShow({type:"error",msg:data.msg})
        }
      })
    }
    this.props.confirmShow({submit:confirmDelete,text:"此操作不可恢复，确定继续吗？"})
  }

  addNewItem=(index)=>{ //添加子条目
    this.setState({
      NewItemName:'',
    })
    var content = <input type="text" placeholder="1~21个字符" onChange={this.itemNameChange}/>
    var add = ()=>{  //增加子条目
      var itemName = this.state.NewItemName.trim()
      var parentId = this.state.items[index].parentCatelogueId
      var flag = itemName.inputVerify(20)
      if ( flag != true) {
        this.props.tipShow({type:"error",msg:flag})
        return
      }
      addNewItem({parentId:parentId,itemName:itemName,type:"childCatelogue"}).then(({data})=>{
        if (data.status == 200) {
          this.state.items[index].list.push({"childCatelogue":itemName,"childCatelogueId":data.result.insertId})
          this.setState({})
          this.props.modalHide()
          this.props.tipShow({type:"success",msg:data.msg})
        }else{
          this.props.tipShow({type:"error",msg:data.msg})
        }
      })
    }
    this.props.modalShow({header:"添加子项",content:content,submit:add})
  }

  addParentItem=()=>{ //添加主条目
    this.setState({
      NewItemName:'',
    })
    var content = <input type="text" placeholder="1~21个字符" onChange={this.itemNameChange}/>
    var add = ()=>{  
      var itemName = this.state.NewItemName.trim()
      // var parentId = this.state.items[index].parentCatelogueId
      var flag = itemName.inputVerify(20)
      if ( flag != true) {
        this.props.tipShow({type:"error",msg:flag})
        return
      }
      addNewItem({itemName:itemName,type:"parentCatelogue"}).then(({data})=>{
        if (data.status == 200) {
          this.state.items.push({"parentCatelogue":itemName,"parentCatelogueId":data.result.insertId,list:[]})
          this.setState({})
          this.props.modalHide()
          this.props.tipShow({type:"success",msg:data.msg})
        }else{
          this.props.tipShow({type:"error",msg:data.msg})
        }
      })
    }
    this.props.modalShow({header:"添加子项",content:content,submit:add})
  }

  deleteParentCate =(item,index)=>{  //删除主条目

    var deleteParentCate = ()=>{
      deleteItem(item.parentCatelogueId,"parentCatelogue").then(({data})=>{
        if (data.status == 200) {        
          delete this.state.items[index]
          this.setState({})
          this.props.tipShow({type:"success",msg:data.msg})
        }else{
          this.props.tipShow({type:"error",msg:data.msg})
        }
      })
    }

    this.props.confirmShow({submit:deleteParentCate,text:"此操作会永久删除此数据及其下属的子条目，确定继续吗？"})
  }



  render () {
    // const data = [{key:"aaa",values:["a1","a2","a3"]},{key:"bbb",values:["b1","b2","b3"]}]
    return (
    <div id="specialitiesManage">
        <h3>类目管理</h3>
        <ul className="items">
            {this.state.items.map((item,index)=>{
              return <li key={index}><a><b>{item.parentCatelogue}</b>
              <strong className="pull-right" onClick={()=>{this.state.isShow[item.parentCatelogue] = this.state.isShow[item.parentCatelogue] ? false : true;this.setState({})}}>▼</strong><button onClick={()=>this.deleteParentCate(item,index)} className="btn btn-success pull-right">删除</button><button onClick={()=>this.modifyParentCate(item)} className="btn btn-success pull-right">修改</button></a><ul>
              {this.state.isShow[item.parentCatelogue] && <div key={index}>{item.list.map((itemm,indexx)=>{
                return <li key={indexx}>{itemm.childCatelogue}<button className="btn btn-success pull-right" onClick={()=>this.deleteItem(item,indexx)}>删除</button><button className="btn btn-success pull-right" onClick={()=>this.modifyItem(itemm)}>修改</button></li>
              })}<li><button onClick={()=>this.addNewItem(index)} className="btn btn-default pull-right">添加子条目</button></li></div>}</ul></li>
            })}
            <li><button onClick={()=>this.addNewItem(index)} className="btn btn-default" onClick={this.addParentItem}>添加主条目</button></li>
        </ul>
      <Modal />
      <Confirm />
    </div>
    )
  }
}

specialitiesManage.propTypes = {
  auth: React.PropTypes.object
}
