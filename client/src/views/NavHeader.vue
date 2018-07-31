<template>
    <!--
        NavHeader start
    -->
    <header>
        <div class="header-center comWidth clearfix">
            <div class="header-l fl">
                <h1 class="logo fl">
                    <a href="javascript:;">
                        <img src="./../../static/images/logo.png" alt="凯游商城" title="凯游商城" />
                    </a>
                </h1>
            </div>
            <div class="header-c fl">
                <nav class="clearfix">
                    <a class="active" href="https://www.taobao.com/" target="_blank">淘宝首页111</a>
                    <a href="https://www.tmall.com/" target="_blank">天猫商城</a>
                    <a href="https://www.mi.com/" target="_blank">小米商城</a>
                    <a href="https://www.mogujie.com/" target="_blank">蘑菇街</a>
                    <a href="https://www.vip.com/" target="_blank">唯品会</a>
                    <a href="https://www.xiaohongshu.com/" target="_blank">小红书</a>
                </nav>
            </div>
            <div class="header-r fr clearfix">
                <!-- 购车车弹框组件 start -->
                <shopping-cart-box class="fl"></shopping-cart-box>
                <!-- 购车车弹框组件 end -->

                <!-- 注册和登录组件 start -->
                <reg-login class="fl"></reg-login>
                <!-- 注册和登录组件 end -->
            </div>
        </div>
    </header>
    <!--
        NavHeader end
    -->
</template>

<script type="text/ecmascript-6">
    // 引入购物车弹框组件
    import ShoppingCartBox from './ShoppingCartBox';
    // 引入注册和登录成功组件
    import RegLogin from './RegLogin';
    export default {
        name: 'NavHeader',
        data () {
            return {
                // 记录的索引值
                // index: 0
            };
        },
        methods: {
            goodsList () {
                // const { href } = this.$router.resolve ({ 'path': '/' });
                // window.open ( href, '_blank' );
            }
        },
        // 注册组件
        components: {
            ShoppingCartBox,
            RegLogin
        }
    };
</script>

<style lang="css" rel="stylesheet/css" scoped>
    /**
        NavHeader start
    */
    header {
        width: 100%;
        height: 60px;
        background-color: #000;
    }

    header .header-l {
        padding: 12px 0 0 0;
    }

    .header-l a {
        display: block;
    }

    .header-l img {
        width: 132px;
        height: 37px;
    }

    .header-c {
        padding: 0 0 0 116px;
    }

    .header-c a {
        float: left;
        font-weight: normal!important;
        font-size: 16px!important;
        line-height: 60px!important;
        font-family: ''!important;
        color: #eee!important;
        padding: 0 15px;
        text-align: center;
    }

    .header-c a.active,
    .header-c a:hover {
        background-color: #278bdd;
        color: #fff!important;
    }

    .header-c a:last-of-type {
        margin-right: 0;
    }
    /**
        NavHeader end
     */
</style>
