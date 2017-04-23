String.prototype.StringFilter = function(minlen,maxLen){
        if (!this) {
          return "输入不能为空"
        }

        if (this.length > maxLen || this.length < minlen) {
          return `输入请保持在${minlen}~${maxLen}个字符`
        }

        if (this.match(/[\s%--`~!@#$^&*()=|{}':;',\[\].<>/?~！@#￥……&*（）――|{}【】‘；：”“'。，、？]/)) {
          return "输入不能包含特殊字符"
        }

      return false
}

String.prototype.StringLen = function(minlen,maxLen){
        if (!this) {
          return "输入不能为空"
        }

        if (this.length > maxLen || this.length < minlen) {
          return `输入请保持在${minlen}~${maxLen}个字符`
        }

        return false
}

String.prototype.StringTrim = function(maxLen){
        if (this.length > maxLen) {
          return this.slice(0,maxLen) + '...'
        }
      return this
}

String.prototype.DateFormat = function (fmt) { //author: meizz 
    var date = new Date(this)
    var o = {
        "M+": date.getMonth() + 1, //月份 
        "d+": date.getDate(), //日 
        "h+": date.getHours(), //小时 
        "m+": date.getMinutes(), //分 
        "s+": date.getSeconds(), //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

String.prototype.html2Escape = function() {   //普通字符转换成转意符
   return this.replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];});
}

// //去掉html标签
// function removeHtmlTab(tab) {
//  return tab.replace(/<[^<>]+?>/g,'');//删除所有HTML标签
// }

// //转意符换成普通字符
// function escape2Html(str) {
//  var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
//  return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];});
// }

// // &nbsp;转成空格
// function nbsp2Space(str) {
//  var arrEntities = {'nbsp' : ' '};
//  return str.replace(/&(nbsp);/ig, function(all, t){return arrEntities[t]})
// }

// //回车转为br标签
// function return2Br(str) {
//  return str.replace(/\r?\n/g,"<br />");
// }

// //去除开头结尾换行,并将连续3次以上换行转换成2次换行
// function trimBr(str) {
//  str=str.replace(/((\s|&nbsp;)*\r?\n){3,}/g,"\r\n\r\n");//限制最多2次换行
//  str=str.replace(/^((\s|&nbsp;)*\r?\n)+/g,'');//清除开头换行
//  str=str.replace(/((\s|&nbsp;)*\r?\n)+$/g,'');//清除结尾换行
//  return str;
// }

// // 将多个连续空格合并成一个空格
// function mergeSpace(str) {
//  str=str.replace(/(\s|&nbsp;)+/g,' ');
//  return str;
// }