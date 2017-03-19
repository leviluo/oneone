// import { injectReducer } from '../../../../store/reducers'

export default (store) => ({
    path:"/memberCenter/myUpdates",
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const myUpdates = require('./myUpdates').default
            // var reducer = require('./modules/myUpdates').default
            // injectReducer(store, { key: 'myUpdates', reducer })
            // reducer = require('../../../../reducers/category').default
            // injectReducer(store, { key: 'catelogues', reducer })
            cb(null, myUpdates)
        })
    },
})