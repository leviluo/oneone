// import { injectReducer } from '../../../../store/reducers'

export default (store) => ({
	path:"/memberCenter/myPost",
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const myPost = require('./myPost').default
            // var reducer = require('./modules/myPost').default
            // injectReducer(store, { key: 'myPost', reducer })
            // reducer = require('../../../../reducers/category').default
            // injectReducer(store, { key: 'catelogues', reducer })
            cb(null, myPost)
        })
    },
})