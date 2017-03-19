// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: '/article/:id',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const article = require('./article').default
      // const reducer = require('./modules/register').default
      // injectReducer(store, { key: 'register', reducer })
      cb(null, article)
    })
  }
})
