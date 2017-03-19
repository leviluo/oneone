// import HomeView from './components/HomeView'

// // Sync route definition
// export default {
//   component: HomeView
// }

import { injectReducer } from '../../store/reducers'

export default (store) => ({
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const HomeView = require('./components/HomeView').default
      const reducer = require('../../reducers/category').default
      injectReducer(store, { key: 'catelogues', reducer })
      cb(null, HomeView)
    })
  }
})