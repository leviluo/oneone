import React, { Component, PropTypes } from 'react'
import './index.scss'

export default class Textarea extends Component{

        getValue =()=>{
            return this.refs.textarea.value
        }

        setValue=()=>{
            this.refs.myValue.value = this.props.defaultValue
        } 

        shouldComponentUpdate=(nextProps)=>{
            return false
        }

        render() {
                const{defaultValue,header,handleTextarea,rows} = this.props;
                console.log(this.props)
                return ( < div className = "textarea-group">
                    < label > { header }< /label>
                        <textarea defaultValue={this.props.defaultValue} ref="textarea" onChange={this.props.handleTextarea} cols="10" rows={rows}></textarea>
                    < /div >
                )
            }
}

Textarea.PropTypes = {
    header:React.PropTypes.string.isRequired,
    // handleTextarea:React.PropTypes.func.isRequired,
    defaultValue:React.PropTypes.string
}