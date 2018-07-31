'use strict';
/**
 * author: 小小游 ---> allen
 * date: 2017.05.20
 * lastUpdateDate: 2018.05.20
 * description: localStorage本地存储
 */
// 将值存取在localStorage里面
export default {
    save ( key, value ) {
        // value存成一个类似JSON字符串
        window.localStorage.setItem ( key, JSON.stringify ( value ) );
    },
    fetch ( key ) {
        /**
         * 本来取出来是一个类似JSON的字符串，我们通过JSON.parse()方法
         * 转成一个对象，如果取出来是空对象，就给它一个[]
         */
        return JSON.parse ( window.localStorage.getItem ( key ) ) || [];
    }
};
