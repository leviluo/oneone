// import { injectReducer } from '../../../../store/reducers'

export default (store) => ({
	path:"/memberCenter/myNotice",
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const myNotice = require('./myNotice').default
            // var reducer = require('./modules/myNotice').default
            // injectReducer(store, { key: 'myNotice', reducer })
            // reducer = require('../../../../reducers/category').default
            // injectReducer(store, { key: 'catelogues', reducer })
            cb(null, myNotice)
        })
    },
})