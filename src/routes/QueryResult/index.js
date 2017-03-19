export default (store) => ({
  path: '/queryresult',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const queryResult = require('./queryResult').default
      // const reducer = require('./modules/register').default
      // injectReducer(store, { key: 'register', reducer })
      cb(null, queryResult)
    })
  }
})
