// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: '/works/:memberSpecialityId',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const works = require('./works').default
      // const reducer = require('./modules/register').default
      // injectReducer(store, { key: 'register', reducer })
      cb(null, works)
    })
  }
})
