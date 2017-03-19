// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: '/follows/:memberId',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const follows = require('./follows').default
      // const reducer = require('./modules/register').default
      // injectReducer(store, { key: 'register', reducer })
      cb(null, follows)
    })
  }
})
