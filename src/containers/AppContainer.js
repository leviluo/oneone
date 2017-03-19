// import React, { PropTypes } from 'react'
// import { Router } from 'react-router'
// import { Provider } from 'react-redux'
// import Helmet from 'react-helmet'
// import defaultLayout from '../../config/layout'
// import clone from 'clone'
import { ReduxAsyncConnect, asyncConnect, reducer as reduxAsyncConnect } from 'redux-async-connect'

// class AppContainer extends React.Component {
//   static propTypes = {
//     layout: PropTypes.object,
//     history: PropTypes.object.isRequired,
//     routes: PropTypes.object.isRequired,
//     routerKey: PropTypes.number,
//     store: PropTypes.object.isRequired
//   }

//   render () {
//     const { layout, history, routes, routerKey, store } = this.props

//     return (
//       <Provider store={store}>
//         <div style={{ height: '100%'}}>
//           <Helmet {...Object.assign(clone(defaultLayout), layout)} />
//           <Router render={(props) => <ReduxAsyncConnect {...props}/>} history={history} children={routes} key={routerKey} />
//         </div>
//       </Provider>
//     )
//   }
// }

// export default AppContainer


import React, { Component, PropTypes } from 'react'
import { browserHistory, Router } from 'react-router'
import { Provider } from 'react-redux'

class AppContainer extends Component {

  shouldComponentUpdate () {
    return false
  }

  render () {
    const { routes, store } = this.props

    return (
      <Provider store={store}>
        <div style={{ height: '100%' }}>
          <Router history={browserHistory} render={(props) => <ReduxAsyncConnect {...props}/>} children={routes} />
        </div>
      </Provider>
    )
  }
}

export default AppContainer
