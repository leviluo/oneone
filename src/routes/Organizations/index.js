// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: '/Organization',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const organization = require('./organization').default
      // const reducer = require('./modules').default
      // injectReducer(store, { key: 'articleUpdates', reducer })
      cb(null, organization)
    })
  }
})
