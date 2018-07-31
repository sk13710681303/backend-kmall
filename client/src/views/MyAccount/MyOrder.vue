<template>
    <!--
        我的订单记录 start
    -->
    <div class="myOrder myOrderRight">
        <div class="myOrderRightOfOrderInfo commonInfo fr">
            <div class="myOrderRightOfOrderInfoByTop clearfix">
                <h1 class="fl">我的订单</h1>
                <div class="fr">
                    <div class="myOrderStatus clearfix">
                        <div class="latelyThreeMonths fl">
                            <div>最近三个月</div>
                            <ul>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ul>
                        </div>
                        <div class="orderStatus fl">
                            <div>全部状态</div>
                            <ul>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="haveAnNoOrder" v-if="myOrderData.length == 0">
                <strong>您的订单空荡荡～～～</strong>
            </div>
            <div
                v-else
                class="myOrderRightOfOrderInfoByCoreCont"
                :key="index"
                v-for="(order, index) in myOrderData"
            >
                <div class="haveAnOrder clearfix">
                    <strong href="javascript:;">2018-04-28</strong>
                    <strong href="javascript:;">订单编号：<span>{{ order.orderId }}</span></strong>
                    <strong href="javascript:;">单价</strong>
                    <strong href="javascript:;">数量</strong>
                    <strong href="javascript:;">商品操作</strong>
                    <strong href="javascript:;">应付总额</strong>
                    <router-link
                        tag="strong"
                        :to="{ name: 'OrderPayment', query: { orderId: order.orderId } }"
                    >
                        查看详情>
                    </router-link>
                </div>
                <div class="haveAnOrderCont clearfix">
                    <div class="haveAnOrderContOfLeft fl">
                        <ul
                            class="clearfix"
                            :key="index"
                            v-for="(item, index) in order.goodsList"
                        >
                            <li>
                                <a
                                    class="fl"
                                    href="javascript:;"
                                    title="商品小图片"
                                >
                                    <img
                                        class="fl"
                                        :src="'/static/images/' + item.productSmallImg"
                                        alt="商品小图片"
                                    />
                                </a>
                            </li>
                            <li>
                                <p class="fl">
                                    {{ item.productSubTitle }}（{{ item.productSpecJson.productShowName }}）
                                </p>
                            </li>
                            <li>
                                {{ item.productPrice | currency('¥') }}
                            </li>
                            <li>
                                {{ item.productNumber }}
                            </li>
                        </ul>
                        <div class="delOperator">
                            <a
                                class="delBtn fl"
                                href="javascript:;"
                                @click="deleteOrderGoodsHandler(order.orderId)"
                            >
                            </a>
                        </div>
                    </div>
                    <div class="haveAnOrderContOfRight fl">
                        <strong class="fl">{{ (order.orderTotal + order.freight) | currency('¥') }}</strong>
                        <div class="orderPayStatus fl">
                            <router-link v-if="!order.isPay" :to="{ name: 'OrderPayment', query: { orderId: order.orderId } }">现在支付</router-link>
                            <span v-else>已支付</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--
        我的订单记录 end
    -->
</template>

<script type="text/ecmascript-6">
    // 引入格式化金额的插件
    import { currency } from './../../util/currency';
    export default {
        name: 'MyOrder',
        mounted () {
            // 调用查询某个用户下的所有订单列表信息
            this.queryAllOrderListData ();
        },
        data () {
            return {
                // 我的订单列表数据
                myOrderData: []
            };
        },
        methods: {
            // 查询某个用户下的所有订单列表信息
            queryAllOrderListData () {
                this.$http.get ( '/users/orderList' )
                    .then ( ( response ) => {
                        let res = response.data;
                        if ( res.status == "0" ) {
                            this.myOrderData = res.result.orderList;
                        }
                    });
            },
            // 删除我的账户页中的我的订单数据
            deleteOrderGoodsHandler ( orderId ) {
                this.$http.post ( '/users/delOrder', {
                    orderId: orderId
                }).then ( ( response ) => {
                    let res = response.data;
                    if ( res.status == "0" ) {
                        console.log ( 'delete success!' );
                        // 重新调用下查询某个用户下的所有订单列表信息
                        this.queryAllOrderListData ();
                    }
                });
            }
        }
    };
</script>

<style lang="css" rel="stylesheet/css" scoped>
    .myOrderRightOfOrderInfo {
        width: 978px;
        border: 1px solid #c9c9c9;
        border-radius: 5px;
        background-color: #f7f7f7;
    }

    .myOrderRightOfOrderInfo .myOrderRightOfOrderInfoByTop {
        height: 60px;
        background-color: #f7f7f7;
        border-bottom: 1px solid #c9c9c9;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
    }

    .myOrderRightOfOrderInfoByTop h1 {
        font-weight: bold!important;
        font-size: 18px!important;
        line-height: 61px!important;
        font-family: ''!important;
        color: #444!important;
        padding: 0 0 0 30px;
    }

    .myOrderStatus .latelyThreeMonths div:first-of-type,
    .myOrderStatus .orderStatus div:first-of-type {
        width: 134px;
        height: 38px;
        background: url(./../../assets/images/myOrder_arrowUp_ico.png) no-repeat 102px center;
        font-weight: bold!important;
        font-size: 14px!important;
        line-height: 38px!important;
        font-family: ''!important;
        color: #444!important;
        border: 1px solid #c9c9c9;
        border-radius: 5px;
        margin: 10px 0 0 0;
        cursor: pointer;
        text-align: left;
    }

    .myOrderStatus .latelyThreeMonths div:first-of-type {
        width: 114px;
        padding: 0 0 0 20px;
    }

    .myOrderStatus .orderStatus div:first-of-type {
        width: 101px;
        margin-right: 30px;
        margin-left: 20px;
        padding: 0 0 0 33px;
    }

    /**
        新添加的内容 start
     */
    .myOrderRightOfOrderInfoByCoreCont .haveAnOrder{
        background-color: #eee;
    }

    .haveAnOrder strong {
        height: 36px;
        float: left;
        text-align: center;
        font-weight: normal!important;
        font-size: 16px!important;
        line-height: 36px!important;
        font-family: ''!important;
        color: #666!important;
    }

    .haveAnOrder strong:first-of-type {
        width: 133px;
    }

    .haveAnOrder strong:nth-of-type(2) {
        width: 265px;
    }

    .haveAnOrder strong:nth-of-type(2) span {
        font-weight: bold!important;
        color: #278bdd!important;
    }

    .haveAnOrder strong:nth-of-type(3) {
        width: 110px;
    }

    .haveAnOrder strong:nth-of-type(4) {
        width: 56px;
    }

    .haveAnOrder strong:nth-of-type(5) {
        width: 138px;
    }

    .haveAnOrder strong:nth-of-type(6) {
        width: 142px;
    }

    .haveAnOrder strong:last-of-type {
        width: 134px;
        cursor: pointer;
        font-weight: bold!important;
        color: #278bdd!important;
    }

    .haveAnOrderCont {
        background-color: #fff;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
    }

    .haveAnOrderCont .haveAnOrderContOfLeft {
        width: 702px;
        position: relative;
    }

    .haveAnOrderContOfLeft ul:last-of-type {
        padding-bottom: 20px;
    }

    .haveAnOrderContOfLeft li {
        float: left;
        text-align: center;
        padding: 20px 0 0 0;
        font-weight: bold!important;
        font-size: 16px!important;
        line-height: 64px!important;
        font-family: ''!important;
        color: #333!important;
    }

    .haveAnOrderContOfLeft li:first-of-type {
        width: 133px;
    }

    .haveAnOrderContOfLeft li:first-of-type a {
        display: block;
        padding: 6px 20px;
        border-radius: 3px;
        border: 1px solid #c9c9c9;
        margin: 0 0 0 22px;
    }

    .haveAnOrderContOfLeft li:first-of-type img {
        width: 24px;
        height: 50px;
    }

    .haveAnOrderContOfLeft li:nth-of-type(2) {
        width: 265px;
    }

    .haveAnOrderContOfLeft li:nth-of-type(2) p {
        width: 265px;
        line-height: 20px!important;
        text-align: center;
        padding: 12px 0 0 0;
    }

    .haveAnOrderContOfLeft li:nth-of-type(3) {
        width: 110px;
    }

    .haveAnOrderContOfLeft li:nth-of-type(4) {
        width: 56px;
    }

    .haveAnOrderContOfLeft .delOperator {
        width: 138px;
        position: absolute;
        right: 0;
        top: 19px;
    }

    .haveAnOrderContOfLeft .delBtn {
        width: 26px;
        height: 46px;
        background: url(./../../assets/images/myOrder_del_ico.png) no-repeat center 20px;
        background-size: 26px 26px;
        text-align: center;
        margin: 0 0 0 56px;
    }

    .haveAnOrderContOfRight strong {
        width: 142px;
        font-weight: bold!important;
        font-size: 16px!important;
        line-height: 104px!important;
        font-family: ''!important;
        color: #333!important;
        text-align: center;
    }

    .haveAnOrderContOfRight .orderPayStatus {
        width: 134px;
    }

    .orderPayStatus a,
    .orderPayStatus span {
        display: block;
        width: 82px;
        height: 28px;
        border-radius: 2px;
        background-color: #278bdd;
        font-weight: normal!important;
        font-size: 14px!important;
        line-height: 28px!important;
        font-family: ''!important;
        color: #fff!important;
        text-align: center;
        margin: 38px auto 0;
    }

    .orderPayStatus span {
        background-color: #c9c9c9;
    }

    .haveAnNoOrder {
        padding: 45px 0;
        background-color: #fff;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
    }

    .haveAnNoOrder strong {
        font-weight: bold!important;
        font-size: 18px!important;
        font-family: ''!important;
        color: #666!important;
    }
    /**
        新添加的内容 end
     */
</style>
