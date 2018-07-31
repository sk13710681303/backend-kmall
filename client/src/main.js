// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import VueLazyLoad from 'vue-lazyload';
import apiConfig from '../config/api.config';
import Axios from 'axios';
import VueAxios from 'vue-axios';
import infiniteScroll from 'vue-infinite-scroll';
import { currency } from './util/currency';

/** 引入全局重置样式 start */
import './../static/css/reset.css';
/** 引入全局重置样式 end */

/** 引入vuex状态管理 start */
import store from './store';
/** 引入vuex状态管理 end */

/** 引入页面滚动加载ing插件 start */
Vue.use ( infiniteScroll );
/** 引入页面滚动加载ing插件 end */

/** 使用图片懒加载插件 start */
Vue.use ( VueLazyLoad, {
    loading: '/static/images/loading_img/loading-spin.svg',
    try: 3
    // default：1
});
/** 使用图片懒加载插件 end */

/** 使用金额的全局过滤器 start */
Vue.filter ( 'currency', currency );
/** 使用金额的全局过滤器 end */

/** VueAxios Axios配置 start */
Vue.use ( VueAxios, Axios );
Axios.defaults.baseURL = apiConfig.baseUrl;
Axios.defaults.headers.Authorization = window.sessionStorage.getItem ( "token" ) || "";
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
/** VueAxios Axios配置 end */

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue ({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App />'
});
