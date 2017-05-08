import { injectReducer } from '../../store/reducers'
// import basic from './routes/BasicInfo'
// import myCreateTeam from './routes/MyCreateTeam'
// import myAttendTeam from './routes/MyAttendTeam'
// import mymessage from './routes/Mymessage'
// import myPost from './routes/MyPost'
// import myNotice from './routes/MyNotice'
// import requestApproval from './routes/RequestApproval'
import specialitiesManage from './routes/SpecialitiesManage'
import suggestionsManage from './routes/SuggestionsManage'
// import myUpdates from './routes/MyUpdates'


export default (store) => ({
    path: 'admincenter',
    indexRoute: specialitiesManage(store),
    // onEnter:(router,replace)=>{
    //     if(!store.getState().auth.isAuth){
    //         replace('/')
    //     }
    // },
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const admincenter = require('./containers/admincenter').default
            const reducer = require('./containers/modules').default
            injectReducer(store, { key: 'admincenter', reducer })
            cb(null, admincenter)
        })
    },
    childRoutes:[
        suggestionsManage(store)
    ]
})
