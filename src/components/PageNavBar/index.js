import React, { Component, PropTypes } from 'react'
import './pagenavbar.scss'
import {pageNavInitiation} from './modules'
import {connect} from 'react-redux'

@connect(
  state=>({
    pagenavbar:state.pagenavbar
  }),
{})
export default class PageNavBar extends Component {

    state={
        pageNums:0,
        currentPage:1
    }

    componentDidMount = () => {
        //页面切换过来的刷新
        if (document.getElementById('pagenum'+this.state.currentPage)) {   
                this.SetStyle(this.state.currentPage)
        };
    }

    componentWillMount=()=>{
        if (typeof this.props.pagenavbar.update != 'function') return
        this.props.pagenavbar.update(1).then((nums)=>{
            this.setState({
                pageNums:nums,
            })
        })
    }

    componentWillReceiveProps =(nextprops)=>{     //当有多个数据源，更新数据源时，更新
        if (typeof nextprops.pagenavbar.update != 'function') return
            nextprops.pagenavbar.update(1).then((nums)=>{
            this.setState({
                pageNums:nums,
                currentPage:1
            })
        })
    }

    SetStyle = (currentPage)=>{
        for (var i = 0; i < document.getElementsByName('pagenum').length; i++) {
            document.getElementsByName('pagenum')[i].style.background = '#efefef';
            document.getElementsByName('pagenum')[i].style.color = '#ff7f00';
        };
        document.getElementById('pagenum'+currentPage).style.background = '#ff7f00';
        document.getElementById('pagenum'+currentPage).style.color = 'white';
    }

    componentDidUpdate =() =>{
        // 更新视图，或者首次加载页面的更新
        if (document.getElementById('pagenum'+this.state.currentPage)) {   
                this.SetStyle(this.state.currentPage)
        };
    }

    pageup = (e)=>{
        if (this.state.currentPage == 1) {return};
        var currentPage = this.state.currentPage == 1 ? 1 : this.state.currentPage - 1
        this.setState({
            currentPage:currentPage
        })
        this.props.pagenavbar.update(currentPage)
    }

    pagedown = (e,pageNums)=>{
        if (this.state.currentPage == pageNums) {return};
        var currentPage = this.state.currentPage == pageNums ? pageNums : this.state.currentPage + 1
        this.setState({
            currentPage:currentPage
        })
        this.props.pagenavbar.update(currentPage)
    }

    firstpage = () =>{
        if (this.state.currentPage == 1) {return};
        this.setState({
            currentPage:1
        })
        this.props.pagenavbar.update(1)
    }

    lastpage = (e,pageNums) =>{
        if (this.state.currentPage == pageNums) {return};
        this.setState({
            currentPage:pageNums
        })
        this.props.pagenavbar.update(pageNums)
    }

    pagego = (e,currentPage) =>{
        if (this.state.currentPage == currentPage) {return};
        this.setState({
            currentPage:currentPage
        })
        this.props.pagenavbar.update(currentPage)
    }


    render() {
        if (!this.state.pageNums)return <div></div>;

        var items = [];
        let {currentPage} = this.state;
        if (this.state.pageNums) {            
            if (this.state.pageNums > 4){   //非初始化
                if ((currentPage - 1)>=3) {
                    items.push( < li key = { currentPage-7 } > < a >...< /a></li > );
                    items.push( < li key = { currentPage-2 } > < a name="pagenum" id={'pagenum'+(currentPage-2)} onClick={(e)=>this.pagego(e,currentPage-2)}>{currentPage-2}< /a></li > );
                    items.push( < li key = { currentPage-1 } > < a name="pagenum" id={'pagenum'+(currentPage-1)} onClick={(e)=>this.pagego(e,currentPage-1)}>{currentPage-1}< /a></li > );
                } else if ((currentPage - 1)>=2) {
                    items.push( < li key = { currentPage-2 } > < a name="pagenum" id={'pagenum'+(currentPage-2)} onClick={(e)=>this.pagego(e,currentPage-2)}>{currentPage-2}< /a></li > );
                    items.push( < li key = { currentPage-1 } > < a name="pagenum" id={'pagenum'+(currentPage-1)} onClick={(e)=>this.pagego(e,currentPage-1)}>{currentPage-1}< /a></li > );
                } else if ((currentPage - 1)>=1) {
                    items.push( < li key = { currentPage-2 } > < a name="pagenum" id={'pagenum'+(currentPage-1)} onClick={(e)=>this.pagego(e,currentPage-1)}>{currentPage-1}< /a></li > );
                }

                items.push( < li key = { currentPage } > < a name="pagenum" id={'pagenum'+(currentPage)} onClick={(e)=>this.pagego(e,currentPage)}>{currentPage}< /a></li > );

                if ((this.state.pageNums-currentPage)>=3) {
                    items.push( < li key = { currentPage+1 } > < a name="pagenum" id={'pagenum'+(currentPage+1)} onClick={(e)=>this.pagego(e,currentPage+1)}>{currentPage+1}< /a></li > );
                    items.push( < li key = { currentPage+2 } > < a name="pagenum" id={'pagenum'+(currentPage+2)} onClick={(e)=>this.pagego(e,currentPage+2)}>{currentPage+2}< /a></li > );
                    items.push( < li key = { currentPage+7 } > < a >...< /a></li > );
                } else if ((this.state.pageNums-currentPage)>=2) {
                    items.push( < li key = { currentPage+1 } > < a name="pagenum" id={'pagenum'+(currentPage+1)} onClick={(e)=>this.pagego(e,currentPage+1)}>{currentPage+1}< /a></li > );
                    items.push( < li key = { currentPage+2 } > < a name="pagenum" id={'pagenum'+(currentPage+2)} onClick={(e)=>this.pagego(e,currentPage+2)}>{currentPage+2}< /a></li > );
                } else if ((this.state.pageNums-currentPage)>=1) {
                    items.push( < li key = { currentPage+1 } > < a name="pagenum" id={'pagenum'+(currentPage+1)} onClick={(e)=>this.pagego(e,currentPage+1)}>{currentPage+1}< /a></li > );
                };

            } else{
                for (var i = 1; i <= this.state.pageNums; i++) {
                    ((i)=>{
                    items.push( < li key = { i } > < a name="pagenum" id={'pagenum'+(i)} value={i} onClick={(e)=>this.pagego(e,i)}> { i } < /a></li > );
                    })(i)
                };

            }
        };

        return ( < ul className = "pagedown" >
            < li > < button className = "btn-white" onClick={this.firstpage}> 首页 < /button></li >
            < li > < button className = "btn-white" onClick={this.pageup}> 上一页 </button > < /li> 
            { items } 
            < li > < button className = "btn-white" onClick={(e)=>this.pagedown(e,this.state.pageNums)}> 下一页 </button >< /li> 
            < li > < button className = "btn-white" onClick={(e)=>this.lastpage(e,this.state.pageNums)}> 尾页 < /button></li >
            < /ul>
        )
    }
}

PageNavBar.PropTypes = {
    update:React.PropTypes.function,
    // currentPage:React.PropTypes.number
}

export const pageNavInit = pageNavInitiation