'use strict';
/**
 * Created by allen on 18/05/24.
 */
Date.prototype.Format = function ( fmt ) {
    var o = {
        // 月份
        "M+": this.getMonth () + 1,
        // 日
        "d+": this.getDate (),
        // 小时
        "h+": this.getHours (),
        // 分
        "m+": this.getMinutes (),
        // 秒
        "s+": this.getSeconds (),
        // 季度
        "q+": Math.floor ( ( this.getMonth () + 3 ) / 3 ),
        // 毫秒
        "S": this.getMilliseconds ()
    };

    if ( /(y+)/.test ( fmt ) ) {
        fmt = fmt.replace ( RegExp.$1, ( this.getFullYear () + "" ).substr ( 4 - RegExp.$1.length ) );
    }

    for ( var k in o ) {
        if ( new RegExp ( "(" + k + ")" ).test ( fmt ) ) {
            fmt = fmt.replace (
                RegExp.$1, ( RegExp.$1.length == 1 )
                    ? ( o[k])
                    : ( ( "00" + o[k]).substr ( ( "" + o[k]).length ) ) );
        }
    }
    return fmt;
};

module.exports = {};
