// import { injectReducer } from '../../../../store/reducers'

export default (store) => ({
	path: '/admincenter/suggestions',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const suggestionManage = require('./suggestionManage').default
            cb(null, suggestionManage)
        })
    },
})