import { sqlStr } from '../dbHelps/mysql'
// import jwt from 'jsonwebtoken'

// export async function isLogin(authorization){
//         // console.log("来验证登录了le")
//             var auth = authorization
//             if (!auth) {
//                 // console.log("尚未登录")
//                 return { status: 600, msg: "尚未登录" }
//             }else{
//                 var result = jwt.decode(auth, "leviluo");
//                 // console.log("开始去数据库验证了")
//                 var veryfied = await sqlStr("select * from member where id = ? and nickname = ?",[result.memberId,result.nickname])
//                 // console.log("数据库验证完毕")
//                 if (veryfied.length > 0) {
//                     return false
//                 }else{
//                     return { status: 600, msg: "尚未登录" }
//                 }
//             }
//         // }
//         return false
// }

export function merge(result,host,merge){  //host标记字段，merge要合并的字段
  var items = []
  go:
    for (var i = 0; i < result.length; i++) {
      for (var j = 0; j < items.length; j++) {
        if(items[j][host] == result[i][host]){
          for (var k = 0; k < merge.length; k++) {
            items[j][merge[k]].push(result[i][merge[k]])
          }
          continue go
        }
    }

    for (var k = 0; k < merge.length; k++) {
    	// if (result[i][merge[k]]) {	
    		result[i][merge[k]] = [result[i][merge[k]]]
    	// }
    }

    items.push(result[i])
  }
  return items
}

export function mergeMulti(result, host, merge) {
    var items = []
    go:
        for (var i = 0; i < result.length; i++) {
            for (var j = 0; j < items.length; j++) {
                if (items[j][host] == result[i][host]) {
                    var ob = {}
                    for (var k = 0; k < merge.length; k++) {
                        // items[j][merge[k]].push(result[i][merge[k]])
                        ob[merge[k]] = result[i][merge[k]]
                    }
                    items[j]['list'].push(ob)
                    for (var k = 0; k < merge.length; k++) {
                        delete items[j][merge[k]]
                    }
                    continue go
                }
            }
            result[i]['list'] = []
              if (result[i][merge[0]]) {
                  var ob = {}
                  for (var k = 0; k < merge.length; k++) {
                      ob[merge[k]] = result[i][merge[k]]
                  }
                  result[i]['list'].push(ob)
              }
            for (var k = 0; k < merge.length; k++) {
                delete result[i][merge[k]]
            }
            items.push(result[i])
        }
    return items
}

export function parseRange(str, size) {
    if (str.indexOf(",") != -1) {
        return;
    }
    if(str.indexOf("=") != -1){
        var pos = str.indexOf("=")
        var str = str.substr(6, str.length)
    }
    var range = str.split("-");
    console.log(range)
    var start = parseInt(range[0], 10)
    var end = parseInt(range[1], 10) || size - 1
    console.log(start)
    console.log(end)

    // Case: -100
    if (isNaN(start)) {
        start = size - end;
        end = size - 1;
        // Case: 100-
    } else if (isNaN(end)) {
        end = size - 1;
    }

    // Invalid
    if (isNaN(start) || isNaN(end) || start > end || end > size) {
        return;
    }
    return {
        start: start,
        end: end
    };
};

