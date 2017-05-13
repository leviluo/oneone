import { injectReducer } from '../../store/reducers'
import basic from './routes/BasicInfo'
import myCreateTeam from './routes/MyCreateTeam'
import myAttendTeam from './routes/MyAttendTeam'
import mymessage from './routes/Mymessage'
import myPost from './routes/MyPost'
import myNotice from './routes/MyNotice'
import requestApproval from './routes/RequestApproval'
import updates from './routes/Updates'
import suggestions from './routes/Suggestions'


export default (store) => ({
    path: '/memberCenter/updates/:type',
    indexRoute: updates(store),
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const memberCenter = require('./containers/memberCenter').default
            // const reducer = require('./containers/modules').default
            // injectReducer(store, { key: 'memberCenter', reducer })
            cb(null, memberCenter)
        })
    },
    childRoutes:[
        basic(store),
        myPost(store),
        myAttendTeam(store),
        myCreateTeam(store),
        myNotice(store),
        mymessage(store),
        requestApproval(store),
        suggestions(store),
    ]
})
