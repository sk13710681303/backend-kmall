<template>
    <!--
        NavFooter start
    -->
    <footer>
        <div class="footer-center comWidth">
            <nav class="clearfix">
                <a href="https://www.taobao.com/" target="_blank">淘宝首页</a>
                <a href="https://www.tmall.com/" target="_blank">天猫商城</a>
                <a href="https://www.mi.com/" target="_blank">小米商城</a>
                <a href="https://www.mogujie.com/" target="_blank">蘑菇街</a>
                <a href="https://www.vip.com/" target="_blank">唯品会</a>
                <a href="https://www.xiaohongshu.com/" target="_blank">小红书</a>
            </nav>
            <p>
                粤ICP备16001447号 2015.kaiyouservices.com 版权所有
            </p>
        </div>
    </footer>
    <!--
        NavFooter end
    -->
</template>

<script type="text/ecmascript-6">
    export default {
        name: 'NavFooter'
    };
</script>

<style lang="css" rel="stylesheet/css" scoped>
    /**
        NavFooter start
    */
    footer {
        width: 100%;
        height: 120px;
        background-color: #000;
        margin: 30px 0 0 0;
    }

    .footer-center nav {
        padding: 36px 0 0 342px;
    }

    .footer-center a {
        float: left;
        font-weight: normal!important;
        font-size: 16px!important;
        font-family: ''!important;
        color: #fff!important;
        padding: 0 15px;

    }
    .footer-center a.active,
    .footer-center a:hover {
        color: #278bdd!important;
    }

    .footer-center p {
        font-weight: normal!important;
        font-size: 14px!important;
        font-family: ''!important;
        color: #fff!important;
        text-align: center;
        padding: 6px 0 0 0;
    }
    /**
        NavFooter end
     */
</style>
