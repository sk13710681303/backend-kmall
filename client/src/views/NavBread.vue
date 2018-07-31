<template>
    <!--
        面包屑导航 start
    -->
    <section class="goodsOfBread comWidth">
        <h1>
            首页 /
            <slot name="goodsListPage"></slot>
            <slot name="goodsDetailsPage"></slot>
            <slot name="myShoppingCart"></slot>
            <slot name="orderConfirmationPage"></slot>
            <slot name="orderPaymentPage"></slot>
            <slot name="myAccountPage"></slot>
        </h1>
    </section>
    <!--
        面包屑导航 end
    -->
</template>

<script type="text/ecmascript-6">
    export default {
        name: 'NavBread'
    };
</script>

<style lang="css" rel="stylesheet/css" scoped>
    /**
        面包屑导航 start
     */
    .goodsOfBread {
        border-radius: 5px;
        height: 50px;
        background-color: #d7e2eb;
        margin-top: 30px;
    }

    .goodsOfBread h1 {
        font-weight: normal!important;
        font-size: 18px!important;
        line-height: 50px!important;
        font-family: ''!important;
        color: #333;
        padding: 0 0 0 20px;
        text-align: left;
    }

    .goodsOfBread span {
        color: #278bdd!important;
    }
    /**
        面包屑导航 end
     */
</style>
