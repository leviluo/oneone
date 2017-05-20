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

