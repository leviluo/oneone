import React from 'react'
import Helmet from 'react-helmet'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {fetchCatelogue} from '../../../reducers/category'
import {fetchItems} from '../modules'
import {asyncConnect} from 'redux-async-connect'
import Select from '../../../components/Select'
import PageNavBar,{pageNavInit} from '../../../components/PageNavBar'
import Location from '../../../components/Location'
import {tipShow} from '../../../components/Tips/modules/tips'
import './categories.scss'
import Chat,{chatShow} from '../../../components/Chat'

@asyncConnect([{
  promise: ({store: {dispatch, getState},a}) => {
    const promises = [];

    if (!getState().catelogues.isloaded) {
      promises.push(dispatch(fetchCatelogue()));
    }

    return Promise.all(promises);
  }
}])

@connect(state=>({
    catelogues:state.catelogues,
    mylocation:state.mylocation,
    auth:state.auth
}),{chatShow,tipShow,pageNavInit})
export default class Categories extends React.Component{

    componentWillMount=(nextProps)=>{
        this.props.params.childCatelogue = this.props.params.childCatelogue == 0 ? '' : this.props.params.childCatelogue
        if (this.props.mylocation.isloaded) {  //加载数据
            this.initItems(this.props)
        }
    }

    componentWillUpdate =()=>{
        // console.log("componentWillUpdate")
    }

    componentDidMount=()=>{
        if (this.props.catelogues.isloaded) {  //从首页跳转
            this.setStyle(this.props.params.childCatelogue ? this.props.params.childCatelogue : this.props.params.parentCatelogue);
        }
    }


    initItems =(props)=>{
        let speciality = props.params.childCatelogue ? props.params.childCatelogue :props.params.parentCatelogue
        let address = props.mylocation.text[0];
        if (props.params.childCatelogue) {   //从子条目进入
            this.setState({
                speciality:speciality,
                address:address,
                childCatelogue:props.params.childCatelogue
            })
            this.props.pageNavInit(this.updateSpecialityData)
        }else{                                      //从父条目进入
            this.props.pageNavInit(this.updateParentSpecialityData)                             
            this.setState({
                speciality:speciality,
                address:address,
                childCatelogue:props.params.childCatelogue
            })    
        }
    }

    updateSpecialityData = (currentPage)=>{
        return fetchItems({address:this.state.address,speciality:this.state.speciality,limit:`${this.state.averagenum*(currentPage-1)},${this.state.averagenum}`}).then(({data})=>{
            if (data.status == 200) {
                // console.log(this.isMounted)
                // if (this.isMounted) {
                    this.setState({
                      allItems:data.data
                    })
                // }
               return Math.ceil(data.count/this.state.averagenum)
              }else {
                this.props.tipShow({type:"error",msg:data.msg})
                return
              }
        })
    }

    componentWillUnmount =()=>{
        this.props.pageNavInit(null)
    }

    updateParentSpecialityData = (currentPage)=>{
        return fetchItems({address:this.state.address,parentSpeciality:this.state.speciality,limit:`${this.state.averagenum*(currentPage-1)},${this.state.averagenum}`}).then(({data})=>{
            if (data.status == 200) {
                // console.log(this.isMounted)
                // if (this.isMounted) {
                    this.setState({
                      allItems:data.data
                    })
                // }
                return Math.ceil(data.count/this.state.averagenum)
              }else {
                this.props.tipShow({type:"error",msg:data.msg})
                return
              }
        })
    }

    componentWillReceiveProps =(nextProps)=>{
            if (this.props.catelogues.isloaded) {
                this.setStyle(nextProps.params.childCatelogue?nextProps.params.childCatelogue:nextProps.params.parentCatelogue);   //刷新页面
            }
            if (nextProps.mylocation.isloaded) {  //加载数据
                this.initItems(nextProps)
            }
    }

    state = {
        averagenum:5,
        childCatelogue:'',
        chatTo:'',
        sendTo:'',
        allItems:[]
    }    

    setStyle =(name)=>{
        var ele = document.getElementById('categoryItems').getElementsByTagName('a')
        for (var i = 0; i < ele.length; i++) {
            ele[i].style.color = "#000"
        }
        console.log(name)
        if(document.getElementsByName(name)[0])document.getElementsByName(name)[0].style.color = "#3a5fcd"
    }

    allCategory = (e)=>{
        this.setStyle(this.props.params.parentCatelogue)
        this.setState({
            childCatelogue:'',
            speciality:this.props.params.parentCatelogue
        })
        this.props.pageNavInit(this.updateParentSpecialityData)  
    }

    getoneCategory=(speciality)=>{
        this.setStyle(speciality)
        this.setState({
            childCatelogue:speciality,
            speciality:speciality
        })
        this.props.pageNavInit(this.updateSpecialityData)
    }

    showChat =(name,memberId)=>{
        if (!this.props.auth.memberId) {
            this.props.tipShow({type:'error',msg:'您还未登录,请先登录'})
            return
        }
        if (memberId == this.props.auth.memberId) return
        this.setState({
            chatTo:name,
            sendTo:memberId
        })
        this.props.chatShow({chatTo:name,chatFrom:this.props.auth.nickname,sendTo:memberId})
    }


    render(){   
        const{catelogues,location} = this.props
        return <div className="category">
        <Helmet title={this.props.params.parentCatelogue} />
        <div className="categoryTop">
            <nav><Link to="/">首页</Link> &gt; <a onClick={this.allCategory}>{this.props.params.parentCatelogue}</a>{this.state.childCatelogue && <span> &gt; {this.state.childCatelogue}</span>}</nav>
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>城市:</td>
                            <td><Location /></td>
                        </tr>
                        <tr>
                            <td>类别:</td>
                            <td><ul id="categoryItems"><li><a onClick={this.allCategory} name={this.props.params.parentCatelogue}>全部</a></li>{catelogues.text.map((item,index)=>{
                                if (item.parentCatelogue == this.props.params.parentCatelogue) {
                                    return <div key={index}>{item.childCatelogue.map((item,index)=><li key={index}><a onClick={()=>this.getoneCategory(item)} name={item}>{item}</a></li>
                                    )}</div>
                                }
                            })}</ul></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div className="categoryContent">
            {this.state.allItems.map((item,index)=> {
                let src = `/originImg?from=member&name=${item.memberId}`
                let brief = item.brief.length > 50 ? item.brief.slice(0,50) + '...' : item.brief
                let link = `/memberBrief/${item.memberId}`
                return <div key={index} className="itemContent">
                     <span>{item.memberId != this.props.auth.memberId && <a className="btn-default" onClick={()=>this.showChat(item.nickname,item.memberId)}>私信</a>}&nbsp;&nbsp;<Link className="btn-default" to={link}>查看名片</Link></span>
                    <img src={src} alt=""/>
                    <div><ul><li><Link to={link}>{item.nickname}</Link>(<span className="lightColor">性别:</span>{item.sex==0 && <span>男</span>}{item.sex==1 && <span>女</span>})</li><li><p><span className="lightColor">简介:&nbsp;</span>{brief}</p></li><li><p><span className="lightColor">能力:&nbsp;</span><span className="tag">{item.name}</span></p></li><li>{item.address && <p><span className="lightColor">现居住地:&nbsp;</span>{item.address}</p>}</li></ul></div>
                </div>
            }
            )}
            <PageNavBar />
        </div>
        <Chat />
      </div>
    }
}

