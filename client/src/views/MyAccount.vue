<template>
    <div>
        <!--
            NavHeader start
        -->
        <nav-header></nav-header>
        <!--
            NavHeader end
        -->

        <!--
            NavBread start
        -->
        <nav-bread>
            <!-- 灵活的运用插槽 start -->
            <span slot="myAccountPage">我的账户页</span>
            <!-- 灵活的运用插槽 end -->
        </nav-bread>
        <!--
            NavBread end
        -->

        <!--
            我的账户 start
        -->
        <section class="myOrderRecord clearfix comWidth">
            <div class="myOrderLeftOfUserInfo fl">
                <div class="userHeadImage">
                    <a
                        href="javascript:;"
                        title="可爱的宇宇古"
                    >
                        <img
                            src="/static/images/loginSucc_user_ico.png"
                            alt="可爱的宇宇古"
                        />
                    </a>
                </div>
                <div class="myOrderAndReceivingAddress">
                    <router-link :to="{ name: 'MyAccount' }" exact activeClass="active">我的订单</router-link>
                    <router-link :to="{ name: 'MyHarvestAddress' }" exact activeClass="active">收获地址</router-link>
                </div>
            </div>
            <!--
                默认初始化渲染我的订单组件 start
            -->
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
            <!--
                默认初始化渲染我的订单组件 end
            -->

            <!--
                我的收获地址组件 start
            -->
            <keep-alive>
                <router-view name="myHarvestAddress"></router-view>
            </keep-alive>
            <!--
                我的收获地址组件 end
            -->
        </section>
        <!--
            我的账户 end
        -->

        <!--
            NavFooter start
        -->
        <nav-footer></nav-footer>
        <!--
            NavFooter end
        -->
    </div>
</template>

<script type="text/ecmascript-6">
    // 引入通用的头部组件
    import NavHeader from './NavHeader';
    // 引入通用的面包屑组件
    import NavBread from './NavBread';
    // 引入通用的底部组件
    import NavFooter from './NavFooter';
    export default {
        name: 'MyAccount',
        // 注册局部组件
        components: {
            NavHeader,
            NavBread,
            NavFooter
        }
    };
</script>

<style lang="css" rel="stylesheet/css" scoped>
    /**
        我的账户 start
     */
    .myOrderRecord {
        margin-top: 30px;
    }
    .myOrderLeftOfUserInfo {
        width: 198px;
        height: 278px;
        border-radius: 5px;
        border: 1px solid #c9c9c9;
        background-color: #f1f1f1;
    }

    .myOrderLeftOfUserInfo .userHeadImage {
        padding: 20px;
    }

    .userHeadImage a {
        display: block;
    }

    .userHeadImage img {
        width: 158px;
        height: 158px;
    }

    .myOrderAndReceivingAddress a {
        display: block;
        height: 40px;
        background-color: #fff;
        font-weight: normal!important;
        font-size: 14px!important;
        line-height: 40px!important;
        font-family: ''!important;
        color: #666!important;
        text-align: center;
    }

    .myOrderAndReceivingAddress a:last-of-type {
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
    }

    .myOrderAndReceivingAddress a:hover,
    .myOrderAndReceivingAddress a.active {
        background-color: #278bdd;
        color: #fff!important;
    }
    /**
        我的账户 end
     */
</style>
