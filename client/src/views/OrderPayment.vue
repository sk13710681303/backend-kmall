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
            <span slot="orderPaymentPage">订单支付页</span>
            <!-- 灵活的运用插槽 end -->
        </nav-bread>
        <!--
            NavBread end
        -->

        <!--
            支付订单 start
        -->
        <div class="orderPaymentCommitSuccess comWidth"  v-if="orderInfo">
            <div class="orderPaymentCommitSuccessOfTop">
                <h1>支付订单</h1>
            </div>
            <div class="orderPaymentCommitSuccessOfCont">
                <h2>订单提交成功</h2>
                <strong>请在<span>24小时内</span>完成支付，超时订单将自动取消。</strong>
                <strong>我们将在您完成支付后的72小时内准时发货</strong>
            </div>
            <div class="orderPaymentCommitSuccessOfBottom clearfix">
                <div class="fr clearfix">
                    <div class="paymentMoney fl">
                        <strong class="fl">应付金额：</strong>
                        <span class="fl">{{ (orderInfo.orderTotal + orderInfo.freight) | currency('¥') }}</span>
                    </div>
                    <div class="paymentBtn fl">
                        <a
                            class="fl"
                            href="javascript:;"
                            @click="payNowHandler(orderInfo.orderId)"
                            v-if="!orderInfo.isPay"
                        >
                            现在支付
                        </a>
                        <span class="alreadyPay" v-else>已支付</span>
                    </div>
                </div>
            </div>
        </div>
        <!--
            支付订单 end
        -->

        <!--
            支付订单信息 start
        -->
        <div class="orderPaymentCommitSuccessInfo comWidth" v-if="orderInfo">
            <div class="orderPaymentOfNumber item-box">
                <h3>订单编号</h3>
                <em>{{ orderInfo.orderId }}</em>
            </div>
            <div class="orderPaymentOfReceiptInformation item-box">
                <h3>收货信息</h3>
                <div class="item clearfix">
                    <em class="fl">姓名：</em>
                    <em class="fl">{{ orderInfo.addressInfo.receiveName }}</em>
                </div>
                <div class="item clearfix">
                    <em class="fl">联系电话：</em>
                    <em class="fl">{{ orderInfo.addressInfo.receivePhone }}</em>
                </div>
                <div class="item clearfix">
                    <em class="fl">详细地址：</em>
                    <em class="fl">{{ orderInfo.addressInfo.receiveProvince }}{{ orderInfo.addressInfo.receiveCity }}{{ orderInfo.addressInfo.receiveCounty }}{{ orderInfo.addressInfo.receiveDetailsAddress }}</em>
                </div>
            </div>
            <div class="orderPaymentOfInvoiceInformation item-box">
                <h3>发票信息</h3>
                <div class="item">
                    <em>发票类型：</em>
                    <em>电子发票</em>
                </div>
                <div class="item">
                    <em>发票抬头：</em>
                    <em>{{ orderInfo.invoiceName }}</em>
                </div>
                <div class="item">
                    <em>发票内容：</em>
                    <em>购买商品明细</em>
                </div>
            </div>
            <div class="orderPaymentOfCommodityInformation">
                <table>
                    <thead>
                    <tr>
                        <th>商品信息</th>
                        <th>单价</th>
                        <th>数量</th>
                        <th>小计</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in orderInfo.goodsList">
                            <td>
                                <p>
                                    {{ item.productSubTitle }} （{{ item.productSpecJson.productShowName }}）
                                </p>
                            </td>
                            <td>
                                {{ item.productPrice | currency('¥') }}
                            </td>
                            <td>
                                {{ item.productNumber }}
                            </td>
                            <td>
                                {{ (item.productPrice * item.productNumber) | currency('¥') }}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="shoppingCountOfPayment clearfix">
                    <div class="fr">
                        <div class="shoppingSum clearfix">
                            <strong class="fl">商品总计：</strong>
                            <em class="fl">{{ orderInfo.orderTotal | currency('¥') }}</em>
                        </div>
                        <div class="shoppingFreight clearfix">
                            <strong class="fl">运费：</strong>
                            <em class="fl">+{{ orderInfo.freight | currency('¥') }}</em>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--
            支付订单信息 end
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
    // 引入金额格式化组件
    import { currency } from './../util/currency';
    export default {
        name: 'OrderPayment',
        mounted () {
            let orderId = this.$route.query.orderId;
            // 如果订单编号不存在或者被人为的串改，那么直接返回或者弹框提醒此订单编号不存在
            if ( !orderId ) {
                return;
            }
            let params = {
                orderId: orderId
            };
            this.$http.get ( '/users/orderDetails', {
                params: params
            }).then ( ( response ) => {
                let res = response.data;
                if ( res.status == "0" ) {
                    this.orderId = orderId;
                    this.orderInfo = res.result.orderInfo;
                }
            });
        },
        data () {
            return {
                // 订单编号
                orderId: '',
                // 订单信息
                orderInfo: ''
            };
        },
        methods: {
            // 现在支付
            payNowHandler ( orderId ) {
                // 调用支付成功接口，改变isPay状态为true即可
                this.$http.get ( '/users/isPaymentSuccess', {
                    params: {
                        orderId: orderId
                    }
                }).then ( ( response ) => {
                    let res = response.data;
                    if ( res.status == "0" ) {
                        alert ( '恭喜，您已成功支付：' + ( this.orderInfo.orderTotal + this.orderInfo.freight ) + '元' );
                        // 支付成功后跳转到我的账户页之我的订单页
                        this.$router.push ({
                            name: 'MyAccount'
                        });
                    }
                });
            }
        },
        // 注册局部组件
        components: {
            // 通用的头部组件
            NavHeader,
            // 通用的面包屑组件
            NavBread,
            // 通用的底部组件
            NavFooter
        }
    };
</script>

<style lang="css" rel="stylesheet/css" scoped>
    /**
        支付订单 start
     */
    .orderPaymentCommitSuccess {
        width: 1198px;
        border: 1px solid #c9c9c9;
        border-radius: 5px;
        margin-top: 20px;
        background-color: #fff;
    }

    .orderPaymentCommitSuccess .orderPaymentCommitSuccessOfTop {
        height: 60px;
        background-color: #f7f7f7;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        border-bottom: 1px solid #c9c9c9;
    }

    .orderPaymentCommitSuccessOfTop h1 {
        font-weight: bold!important;
        font-size: 18px!important;
        line-height: 61px!important;
        font-family: ''!important;
        color: #444!important;
        padding: 0 0 0 30px;
        text-align: left;
    }

    .orderPaymentCommitSuccess .orderPaymentCommitSuccessOfCont {
        border-bottom: 1px solid #c9c9c9;
        padding: 42px 0 47px 0;
        text-align: center;
    }

    .orderPaymentCommitSuccessOfCont h2 {
        font-weight: normal!important;
        font-size: 36px!important;
        font-family: ''!important;
        color: #000!important;
    }

    .orderPaymentCommitSuccessOfCont strong {
        display: block;
        font-weight: normal!important;
        font-size: 16px!important;
        font-family: ''!important;
        color: #999!important;
    }

    .orderPaymentCommitSuccessOfCont strong:first-of-type {
        padding: 19px 0 24px 0;
    }

    .orderPaymentCommitSuccessOfCont span {
        color: #fc2400!important;
    }

    .orderPaymentCommitSuccessOfBottom {
        padding: 20px 20px 20px 0;
    }

    .orderPaymentCommitSuccessOfBottom .paymentMoney {
        padding: 13px 0 0 0;
    }

    .orderPaymentCommitSuccessOfBottom .paymentMoney strong {
        font-weight: normal!important;
        font-size: 16px!important;
        font-family: ''!important;
        color: #333!important;
        padding: 4px 0 0 0;
    }

    .orderPaymentCommitSuccessOfBottom .paymentMoney span {
        font-weight: normal!important;
        font-size: 22px!important;
        font-family: ''!important;
        color: #da4d00!important;
    }

    .orderPaymentCommitSuccessOfBottom .paymentBtn {
        padding: 0 0 0 40px;
    }

    .orderPaymentCommitSuccessOfBottom .paymentBtn a,
    .orderPaymentCommitSuccessOfBottom .paymentBtn span {
        width: 172px;
        height: 56px;
        border-radius: 5px;
        font-weight: normal!important;
        font-size: 18px!important;
        line-height: 56px!important;
        font-family: ''!important;
        color: #fff!important;
        text-align: center;
    }

    .orderPaymentCommitSuccessOfBottom .paymentBtn a {
        background-color: #278bdd;
    }

    .orderPaymentCommitSuccessOfBottom .paymentBtn span {
        display: inline-block;
        background-color: #c9c9c9;
    }
    /**
        支付订单 end
     */

    /**
        支付订单信息 start
     */
    .orderPaymentCommitSuccessInfo {
        margin-top: 50px;
    }

    .orderPaymentCommitSuccessInfo .item-box {
        border-top: 1px solid #c9c9c9;
        border-bottom: 1px solid #c9c9c9;
        padding: 17px 0 17px 20px;
    }

    .orderPaymentCommitSuccessInfo .item-box:first-of-type {
        border-bottom: 0 none;
        padding-bottom: 16px;
        text-align: left;
    }

    .orderPaymentCommitSuccessInfo .item-box:nth-of-type(3) {
        border-top: 0 none;
    }

    .orderPaymentCommitSuccessInfo .item-box h3,
    .orderPaymentCommitSuccessInfo .item-box em {
        font-weight: normal!important;
        font-size: 16px!important;
        font-family: ''!important;
        color: #333!important;
        text-align: left;
    }

    .orderPaymentCommitSuccessInfo .item-box em {
        color: #999!important;
    }

    .orderPaymentCommitSuccessInfo .item-box:first-of-type h3 {
        padding: 0 0 4px 0;
    }

    .orderPaymentCommitSuccessInfo .item-box:nth-of-type(2) h3,
    .orderPaymentCommitSuccessInfo .item-box:nth-of-type(3) h3 {
        padding: 0 0 16px 0;
    }

    .orderPaymentCommitSuccessInfo .item-box:nth-of-type(2) .item,
    .orderPaymentCommitSuccessInfo .item-box:nth-of-type(3) .item {
        padding: 0 0 4px 0;
        text-align: left;
    }

    .orderPaymentCommitSuccessInfo .item-box:nth-of-type(2) .item:last-of-type,
    .orderPaymentCommitSuccessInfo .item-box:nth-of-type(3) .item:last-of-type {
        padding-bottom: 0;
    }

    .orderPaymentOfCommodityInformation thead {
        font-weight: normal!important;
        font-size: 14px!important;
        line-height: 36px!important;
        font-family: ''!important;
        color: #333!important;
    }

    .orderPaymentOfCommodityInformation tbody {
        font-weight: normal!important;
        font-size: 16px!important;
        line-height: 56px!important;
        font-family: ''!important;
        color: #333!important;
    }

    .orderPaymentOfCommodityInformation tr {
        border-bottom: 1px solid #c9c9c9;
    }

    .orderPaymentOfCommodityInformation th {
        height: 36px;
        text-align: center;
    }

    .orderPaymentOfCommodityInformation td {
        height: 56px;
        text-align: center;
    }

    .orderPaymentOfCommodityInformation th:first-of-type,
    .orderPaymentOfCommodityInformation td:first-of-type {
        width: 720px;
        text-align: left;
        padding: 0 0 0 20px;
    }

    .orderPaymentOfCommodityInformation td:first-of-type p {
        width: 720px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .orderPaymentOfCommodityInformation th:nth-of-type(3),
    .orderPaymentOfCommodityInformation td:nth-of-type(3) {
        width: 152px;
    }

    .orderPaymentOfCommodityInformation th:nth-of-type(2),
    .orderPaymentOfCommodityInformation th:nth-of-type(4),
    .orderPaymentOfCommodityInformation td:nth-of-type(2),
    .orderPaymentOfCommodityInformation td:nth-of-type(4) {
        width: 160px;
    }

    .shoppingCountOfPayment {
        font-weight: normal!important;
        font-size: 16px!important;
        font-family: ''!important;
        padding: 15px 37px 0 0;
    }

    .shoppingCountOfPayment .shoppingSum {
        color: #333!important;
    }

    .shoppingCountOfPayment .shoppingFreight {
        color: #999!important;
        padding: 2px 0 0 0;
    }

    .shoppingCountOfPayment .shoppingFreight strong {
        padding: 0 0 0 32px;
    }

    .shoppingCountOfPayment em {
        padding: 0 0 0 30px;
    }

    .shoppingCountOfPayment .shoppingFreight em {
        padding: 0 0 0 33px;
    }
    /**
        支付订单信息 end
     */
</style>
