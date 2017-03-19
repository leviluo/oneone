import React, { Component, PropTypes } from 'react'
import './index.scss'

export default class CustomSelect extends Component{

        state = {
            ifShow:false,
            defaultValue:"请选择"
        }

        checkOne = (value)=>{
            this.setState({
                defaultValue:value,
                ifShow:false
            })
        }

        getValue =()=>{
            return this.state.defaultValue
        }

        ifShow=()=>{
            this.setState({
                ifShow:this.state.ifShow ? false :true
            })
        }

        render() {
                const{items} = this.props;
                return ( <article id="customeselect" >
                          <label type="text" onClick={this.ifShow}>{this.state.defaultValue}</label><b>▼</b>
                          {this.state.ifShow && <ul>
                            {items.map((item,index)=>
                                <li key={index}>
                                        <label className="lightColor">{item.key}</label>
                                    <ul>
                                        {item.list.map((item,index)=><li key={index}><a href="javascript:;" onClick={()=>this.checkOne(item)}>{item}</a></li>)}
                                    </ul>
                                </li>
                                )}
                          </ul>}
                          </article>
                )
            }
}

CustomSelect.PropTypes = {
   
}