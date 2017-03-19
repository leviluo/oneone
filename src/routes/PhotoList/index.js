// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: '/photoList/:memberSpecialityId/:worksId',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const photoList = require('./photoList').default
      // const reducer = require('./modules/register').default
      // injectReducer(store, { key: 'register', reducer })
      cb(null, photoList)
    })
  }
})
