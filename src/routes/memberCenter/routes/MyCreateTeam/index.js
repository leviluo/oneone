// import { injectReducer } from '../../../../store/reducers'

export default (store) => ({
	path:"/memberCenter/myCreateTeam",
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const myCreateTeam = require('./myCreateTeam').default
            // var reducer = require('./modules/myCreateTeam').default
            // injectReducer(store, { key: 'myCreateTeam', reducer })
            // reducer = require('../../../../reducers/category').default
            // injectReducer(store, { key: 'catelogues', reducer })
            cb(null, myCreateTeam)
        })
    },
})