import React, { Component, PropTypes } from 'react'
import './share.scss'

export default class Share extends Component{

          showQrcode =(e)=>{
            this.refs.qrcodeSrc.src = `/qrcode?text=${encodeURIComponent(window.location.href)}`
            e.target.childNodes[0].style.display = "block"
          }

          closeQrcode =(e)=>{
            e.target.parentNode.style.display = "none"
            e.stopPropagation()
          }

        render() {
                var shareZone = `http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodeURIComponent(document.location)}&title=${encodeURIComponent(document.title)}`
                var shareWeibo = `http://v.t.sina.com.cn/share/share.php?&appkey=895033136?url=${encodeURIComponent(document.location)}&title=${encodeURIComponent(document.title)}`
                return ( <div className="share">
                       <i className="fa fa-share"></i>&nbsp;分享至:&nbsp;
                        <a title="发送给微信好友">
                        </a>
                        <a href={shareZone} target="_blank" title="分享到QQ空间"></a>
                        <a href={shareWeibo} target="_blank" title="分享到微博"></a>
                        <a onClick={this.showQrcode} title="分享到朋友圈">
                           <div><span onClick={this.closeQrcode}>×</span><img ref="qrcodeSrc" alt="" /><p>扫描即可分享</p></div>
                        </a>
                      </div>
                )
            }
}

