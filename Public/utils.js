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

      return ''
}

String.prototype.StringTrim = function(maxLen){
        if (this.length > maxLen) {
          return this.slice(0,maxLen) + '...'
        }
      return this
}
