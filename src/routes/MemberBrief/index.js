// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: '/MemberBrief/:id',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const memberbrief = require('./memberBrief').default
      // const reducer = require('./modules/register').default
      // injectReducer(store, { key: 'register', reducer })
      cb(null, memberbrief)
    })
  }
})
