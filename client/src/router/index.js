import Vue from 'vue';
import Router from 'vue-router';
// import store from './../store';
// 这里引入用来测试遮罩层的路由
import TestMaskLayer from './../components/TestMaskLayer';
// 商品列表页
import GoodsList from './../views/GoodsList';
// 商品详情页
import GoodsDetails from './../views/GoodsDetails';
// 我的购物车
import MyShoppingCart from './../views/MyShoppingCart';
// 订单确认页
import OrderConfirmation from './../views/OrderConfirmation';
// 订单支付页
import OrderPayment from './../views/OrderPayment';
// 我的账户
import MyAccount from './../views/MyAccount';
// 我的订单
import MyOrder from './../views/MyAccount/MyOrder';
// 收获地址
import MyHarvestAddress from './../views/MyAccount/MyHarvestAddress';

// let filters = [];

Vue.use ( Router );

let router = new Router ({
    // 开启路由history模式，默认是hash模式
    mode: 'hash',
    // 滚动行为
    scrollBehavior ( to, from, savePosition ) {
        if ( savePosition ) {
            return savePosition;
        }
        return { x: 0, y: 0 };
    },
    routes: [
        {
            path: '/',
            name: 'GoodsList',
            component: GoodsList
        },
        {
            path: '/goodsDetails',
            name: 'GoodsDetails',
            component: GoodsDetails
            // 设置当前路由需要校验，不需要校验的路由就不用写了；不要问为什么，自己去看官网
            // meta: {
            //     auth: true
            // }
        },
        {
            path: '/myShoppingCart',
            name: 'MyShoppingCart',
            component: MyShoppingCart
        },
        {
            path: '/orderConfirmation',
            name: 'OrderConfirmation',
            component: OrderConfirmation
        },
        {
            path: '/orderPayment',
            name: 'OrderPayment',
            component: OrderPayment
        },
        {
            path: '/myAccount',
            // name: 'MyAccount',
            component: MyAccount,
            children: [
                // 我的订单
                {
                    path: '',
                    name: 'MyAccount',
                    component: MyOrder
                },
                // 收获地址
                {
                    path: 'myHarvestAddress',
                    name: 'MyHarvestAddress',
                    // component: MyHarvestAddress
                    components: {
                        // 默认想渲染哪个组件
                        // default: MyHarvestAddress,
                        // key是keep-alive里面name对应的名字，value是组件名
                        myHarvestAddress: MyHarvestAddress
                    }
                }
            ]
        },
        // 这里用来测试遮罩层的路由
        {
            path: '/testMaskLayer',
            name: 'TestMaskLayer',
            component: TestMaskLayer
        }
    ]
});

// function  checkFilter ( path ) {
//
// }

// router.beforeEach ( ( to, from, next ) => {
//     if ( checkFilter ( to.path ) ) {
//         next();
//     } else {
//         if ( to.matched.some ( m => m.meta.auth ) ) {
//             // 对路由进行验证，用户已经登录
//             if ( store.state.isLogin == '100' ) {
//                 // 正常跳转到你设置好的页面
//                 next ({ path: '/goodsDetails', query: { Rurl: to.fullPath } });
//             } else {
//                 // 未登录则跳转到商品首页，query:{ Rurl: to.fullPath}表示把当前路由信息传递过去方便登录后跳转回来；
//                 console.log ( '您未先登录' );
//                 next ({ path: '/', query: { Rurl: to.fullPath } });
//             }
//         } else {
//             next ();
//         }
//     }
// });

export default router;
