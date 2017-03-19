import CoreLayout from './CoreLayout'
import { injectReducer } from '../../store/reducers'

export default function MyCoreLayout(store){
	//为什么要必须命名为reducer
	var reducer = require('../../components/Tips/modules/tips').default  
	injectReducer(store, { key: 'mytips', reducer })
	reducer = require('../../components/Modal/modules/modal').default  
	injectReducer(store, { key: 'modal', reducer })
	reducer = require('../../components/Confirm/modules').default  
	injectReducer(store, { key: 'confirm', reducer })
	reducer = require('../../components/Location/modules/location').default  
	injectReducer(store, { key: 'mylocation', reducer })
	reducer = require('../../reducers/auth').default  
	injectReducer(store, { key: 'auth', reducer })
	reducer = require('../../components/Chat/modules/chat').default
    injectReducer(store, { key: 'chat', reducer })
	reducer = require('../../components/ImageBrowser/modules').default
    injectReducer(store, { key: 'imageBrowser', reducer })
	reducer = require('../../components/PageNavBar/modules').default
    injectReducer(store, { key: 'pagenavbar', reducer })
	return CoreLayout
}

