import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: '/categories/:parentCatelogue/:childCatelogue',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const categories = require('./containers/categories').default
      
      // var reducer = require('./modules').default
      // injectReducer(store, { key: 'items', reducer })

      var reducer = require('../../reducers/category').default
      injectReducer(store, { key: 'catelogues', reducer })

      // reducer = require('../../components/Chat/modules/chat').default
      // injectReducer(store, { key: 'chat', reducer })
      
      cb(null, categories)
    })
  }
})
