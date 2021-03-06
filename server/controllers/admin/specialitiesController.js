import { sqlStr } from '../../dbHelps/mysql'
import {mergeMulti,merge} from '../utils'

const Controller = {
    getItem: async function(next) {
        // await next
        var result = await sqlStr("select specialities.name as childCatelogue,specialityCategory.name as parentCatelogue,specialityCategory.id as parentCatelogueId,specialities.id as childCatelogueId from specialityCategory left join specialities on specialityCategory.id = specialities.categoryId")
        // console.log(result)
        var items = mergeMulti(result, 'parentCatelogue', ['childCatelogue', 'childCatelogueId'])
        this.body = { status: 200, result: items }
    },
    addNewItem: async function(next) {
        var parentId = this.request.body.parentId
        var itemName = this.request.body.itemName.trim().html2Escape()
        var type = this.request.body.type

        // if (!parentId) {
        //     this.body = { status: 500, msg: "缺少参数" }
        //     return
        // }

        var flag = itemName.StringLen(0,20)
        if (flag) {
            this.body = { status: 500, msg: flag }
            return
        }

        // var isRepeat = await sqlStr("select * from specialities where name = ?", [itemName])
        if (type == "childCatelogue") {
            var isRepeat = await sqlStr("select * from specialities where name = ?", [itemName])
        } else {
            var isRepeat = await sqlStr("select * from specialityCategory where name = ?", [itemName])
        }

        if (isRepeat.length > 0) {
            this.body = { status: 500, msg: "命名重复" }
            return
        }

        
        if (type == "childCatelogue") {
          var result = await sqlStr("insert into specialities set categoryId = ?,name = ?", [parentId, itemName])
        }else{
          var result = await sqlStr("insert into specialityCategory set name = ?", [itemName])
        }

        if (result.affectedRows == 1) {
            this.body = { status: 200, msg: "添加成功", result: { insertId: result.insertId } }
            return
        } else {
            this.body = { status: 500, msg: "操作失败" }
        }

    },
    modifyItem: async function(next) {
        var id = this.request.body.id
        var itemName = this.request.body.itemName.trim().html2Escape()
        var type = this.request.body.type

        if (!id) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        var flag = itemName.StringLen(0,20)
        if (flag) {
            this.body = { status: 500, msg: flag }
            return
        }
        if (type == "childCatelogue") {
            var isRepeat = await sqlStr("select * from specialities where name = ?", [itemName])
        } else {
            var isRepeat = await sqlStr("select * from specialityCategory where name = ?", [itemName])
        }

        if (isRepeat.length > 0) {
            this.body = { status: 500, msg: "命名重复" }
            return
        }

        if (type == "childCatelogue") {
          var result = await sqlStr("update specialities set name = ? where id = ?", [itemName, id])
        }else{
          var result = await sqlStr("update specialityCategory set name = ? where id = ?", [itemName, id])
        }

        if (result.affectedRows == 1) {
            this.body = { status: 200, msg: "修改成功" }
            return
        } else {
            this.body = { status: 500, msg: "操作失败" }
        }
    },
    deleteItem: async function() {
        var id = this.request.query.id
        var type = this.request.query.type
        if (!id || !type) {
            this.body = { status: 500, msg: "缺少参数" }
            return
        }
        if (type == "childCatelogue") {
            var result = await sqlStr("delete s.*,memberSpeciality.*,works.* from specialities as s left join memberSpeciality on memberSpeciality.specialitiesId = s.id left join works on works.memberSpecialityId = memberSpeciality.id where s.id = ?",[id])
        } else {
            var result = await sqlStr("delete specialitycategory.*,specialities.*,memberSpeciality.*,works.* from specialitycategory left join specialities on specialities.categoryId = specialitycategory.id left join memberSpeciality on memberSpeciality.specialitiesId = specialities.id left join works on works.memberSpecialityId = memberSpeciality.id where specialitycategory.id = ?", [id])
        }
        if (result.affectedRows > 0) {
            this.body = { status: 200, msg: "删除成功" }
            return
        } else {
            this.body = { status: 500, msg: "操作失败" }
        }
    }
}
export default Controller;

