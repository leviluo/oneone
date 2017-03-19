import { injectReducer } from '../../../../store/reducers'

export default (store) => ({
    path:"/memberCenter/basicInfo",
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const basicInfo = require('./basicInfo').default
            var reducer = require('./modules/basicInfo').default
            injectReducer(store, { key: 'myspecialities', reducer })
            reducer = require('../../../../reducers/category').default
            injectReducer(store, { key: 'catelogues', reducer })
            cb(null, basicInfo)
        })
    },
})
