// import { injectReducer } from '../../../../store/reducers'

export default (store) => ({
    path:"/memberCenter/suggestions",
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const suggestions = require('./suggestions').default
            // var reducer = require('./modules/suggestions').default
            // injectReducer(store, { key: 'suggestions', reducer })
            // reducer = require('../../../../reducers/category').default
            // injectReducer(store, { key: 'catelogues', reducer })
            cb(null, suggestions)
        })
    },
})