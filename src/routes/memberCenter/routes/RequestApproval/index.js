// import { injectReducer } from '../../../../store/reducers'

export default (store) => ({
	path:"/memberCenter/requestApproval/:id",
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const requestApproval = require('./requestApproval').default
            // var reducer = require('./modules/requestApproval').default
            // injectReducer(store, { key: 'requestApproval', reducer })
            // reducer = require('../../../../reducers/category').default
            // injectReducer(store, { key: 'catelogues', reducer })
            cb(null, requestApproval)
        })
    },
})