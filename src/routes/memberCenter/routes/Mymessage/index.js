// import { injectReducer } from '../../../../store/reducers'

export default (store) => ({
	path:"/memberCenter/myMessage",
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const myMessage = require('./myMessage').default
            // var reducer = require('./modules').default
            // injectReducer(store, { key: 'myspecialities', reducer })
            // reducer = require('../../../../reducers/category').default
            // injectReducer(store, { key: 'catelogues', reducer })
            // var reducer = require('../../../../components/Chat/modules/chat').default
            // injectReducer(store, { key: 'chat', reducer })
            cb(null, myMessage)
        })
    },
})