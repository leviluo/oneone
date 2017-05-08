// import { injectReducer } from '../../../../store/reducers'

export default (store) => ({
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const SpecialitiesManage = require('./specialitiesManage').default
            cb(null, SpecialitiesManage)
        })
    },
})