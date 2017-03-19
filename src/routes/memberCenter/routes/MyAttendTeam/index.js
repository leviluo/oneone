// import { injectReducer } from '../../../../store/reducers'

export default (store) => ({
	path:"/memberCenter/myAttendTeam",
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const myAttendTeam = require('./myAttendTeam').default
            // var reducer = require('./modules/myAttendTeam').default
            // injectReducer(store, { key: 'myAttendTeam', reducer })
            // reducer = require('../../../../reducers/category').default
            // injectReducer(store, { key: 'catelogues', reducer })
            cb(null, myAttendTeam)
        })
    },
})