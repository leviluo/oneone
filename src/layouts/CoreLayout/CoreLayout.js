import React from 'react'
import Header from '../../components/Header'
import Tip from '../../components/Tips'
import Loading from '../../components/Loading'
import './CoreLayout.scss'
import '../../styles/core.scss'
import ImageBrowser from '../../components/ImageBrowser'

export const CoreLayout = ({ children }) => (
  <div className='container'>
    <Header />
    <Tip />
    <Loading />
    <ImageBrowser />
    <div className='mainContainer'>
      {children}
    </div>
    <footer>
    <p>版权所有-上海一一网络技术有限公司</p>
    </footer>
  </div>
)

CoreLayout.propTypes = {
  children: React.PropTypes.element.isRequired
}

export default CoreLayout
