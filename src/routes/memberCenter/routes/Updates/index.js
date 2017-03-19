// import { injectReducer } from '../../../../store/reducers'

export default (store) => ({
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const updates = require('./updates').default
            // var reducer = require('./modules/updates').default
            // injectReducer(store, { key: 'updates', reducer })
            // reducer = require('../../../../reducers/category').default
            // injectReducer(store, { key: 'catelogues', reducer })
            cb(null, updates)
        })
    },
})