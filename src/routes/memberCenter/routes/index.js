// import { injectReducer } from '../../../store/reducers'

export default (store) => ({
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const basicInfo = require('./basicInfo').default
            cb(null, basicInfo)
        })
    },
})
