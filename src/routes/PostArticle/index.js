// import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: '/postArticle/:id/:type',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const postArticle = require('./postArticle').default
      // const reducer = require('./modules/register').default
      // injectReducer(store, { key: 'register', reducer })
      cb(null, postArticle)
    })
  }
})
