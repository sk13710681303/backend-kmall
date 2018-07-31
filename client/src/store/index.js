'use strict';
/**
 * author: 小小游 ---> allen
 * date: 2018.05.21
 * lastUpdateDate: 2018.05.21
 * description: vuex状态管理
 */
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use ( Vuex );

const store = new Vuex.Store ({
    state: {
        // 购物车商品数量
        cartCount: 0,
        // 登录成功的用户信息
        user: ''
    },
    mutations: {
        // 初始化购物车商品数量
        initCartCount ( state, cartCount ) {
            state.cartCount = cartCount;
        },
        // 更新购物车商品数量
        updateCartCount ( state, cartCount ) {
            state.cartCount += cartCount;
        },
        // 更新用户信息
        updateUserInfo ( state, user ) {
            state.user = user;
        }
    }
});

export default store;
