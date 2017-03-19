import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: 'login',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const login = require('./containers/login').default
      // const reducer = require('./modules/auth').default
      // injectReducer(store, { key: 'auth', reducer })
      cb(null, login)
    })
  }
})
