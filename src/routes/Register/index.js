// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: 'register',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const register = require('./containers/register').default
      // const reducer = require('./modules/register').default
      // injectReducer(store, { key: 'register', reducer })
      cb(null, register)
    })
  }
})
