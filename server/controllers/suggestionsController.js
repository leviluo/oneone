import { sqlStr } from '../dbHelps/mysql'
import {save,find,update,remove,aggregate,findLimit} from '../dbHelps/mongodb'

const Controller = {
    getsuggestions:async function(){

        var limit = this.request.query.limit
        var p = this.request.query.p

        if (!p || !limit) {
            this.body = {status:500,msg:"缺少参数"}
            return
        }
        var result = await findLimit("Suggestion",null,{p:p,limit:parseInt(limit)}) 

        var count = await findLimit("Suggestion")

        // if(updates.ok){
            this.body = {status:200,data:result,count:count.length}
        // }else{
        //     this.body = {status:500,msg:"更新通知状态失败"}
        // }

    }
}
export default Controller;
