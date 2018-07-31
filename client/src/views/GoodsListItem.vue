<template>
    <div>
        <ul class="clearfix" v-if="goodsListItem">
            <li
                v-for="( item, index) in goodsListItem"
                :class="{ 'inActive': index == isShow, 'outActive': index == isHide, 'active': index == productIndex }"
                @mouseenter="executedEnter(index)"
                @mouseleave="executedLeave(index)"
            >
                <div class="showShoppingPic">
                    <a href="javascript:;" :title="item.productName">
                        <img
                            :src="'/static/images/'+item.productSkuInfo[item.productIndex].productBigImg"
                            :alt="item.productTitle"
                            :class="{ 'inActive': index == isShow, 'outActive': index == isHide }"
                        />
                    </a>
                </div>
                <h2
                    :class="{ 'inActive': index == isShow, 'outActive': index == isHide }"
                >
                    {{ item.productName }}（{{ item.productSkuInfo[item.productIndex].productSpecJson.productShowName }}）
                </h2>
                <p
                    :class="{ 'inActive': index == isShow, 'outActive': index == isHide }"
                >
                    {{ item.productTitle }}
                </p>
                <nav class="goodsListOfColor clearfix">
                    <a
                        href="javascript:;"
                        :title="sku.productSpecJson.productShowName"
                        :key="index"
                        v-for="(sku, index) in item.productSkuInfo"
                        :class="{ 'active': index == item.productIndex }"
                        @click="tabIndex(item, index)"
                    >
                        <img
                            :src="'/static/images/'+sku.productSpecJson.productImage"
                            :alt="sku.productSpecJson.productShowName"
                        />
                    </a>
                </nav>
                <div class="goodsListOfBtn">
                    <!-- 若index == isShow，就添加该class -->
                    <div
                        class="goodsListOfBtnA"
                        :class="{ 'showGoodsListOfBtnA': index == isShow }"
                    >
                        <a href="javascript:;" @click="viewShoppingDetails(item.productSkuInfo[item.productIndex].productSkuId)">查看详情</a>
                        <a href="javascript:;" @click="addShoppingCartPanelHandler(item.productSkuInfo[item.productIndex].productSkuId)">加入购物车</a>
                    </div>
                    <!-- 若index == isShow，就添加该class -->
                    <div
                        class="goodsListOfPriceAndSales"
                        :class="{ 'hiddenPriceAndSales': index == isShow }"
                    >
                        <strong>￥{{ item.productPrice }}</strong>
                        <span>月销量{{ item.productMonthlySales }}</span>
                    </div>
                </div>
            </li>
        </ul>

        <!--
            小小游通用的modalPopModal start
        -->
        <common-pop-modal
            ref="mask"
            :md-show="mdShow"
            @on-close="closeModal"
        >
            <h1 slot="modal-title">
                {{ modalHeader }}
            </h1>
            <div slot="modal-message">
                请先登录，否则无法加入到购物车中！
            </div>
            <div slot="modal-btnGroup">
                <a href="javascript:;" @click="closeModal">关闭</a>
            </div>
        </common-pop-modal>
        <!--
            小小游通用的modalPopModal end
        -->

        <!--
            小小游通用的modalPopModal start
        -->
        <common-pop-modal
            :md-show="mdShowCart"
            @on-close="closeModal"
        >
            <h1 slot="modal-title">
                {{ modalCartHeader }}
            </h1>
            <div slot="modal-message">
                登录成功，商品已成功加入购物车！
            </div>
            <div slot="modal-btnGroup">
                <a href="javascript:;" @click="closeModal">继续购物</a>
                <a href="javascript:;" @click="viewShoppingCart">查看购物车</a>
            </div>
        </common-pop-modal>
        <!--
            小小游通用的modalPopModal end
        -->

        <!--
            小小游通用的modalPopModal start
        -->
        <common-pop-modal
            :md-show="mdShowDetails"
            @on-close="closeModal"
        >
            <h1 slot="modal-title">
                {{ modalHeader }}
            </h1>
            <div slot="modal-message">
                请先登录，否则无法查看详情页的商品！
            </div>
            <div slot="modal-btnGroup">
                <a href="javascript:;" @click="closeModal">继续购物</a>
                <a href="javascript:;" @click="viewShoppingCart">查看购物车</a>
            </div>
        </common-pop-modal>
        <!--
            小小游通用的modalPopModal end
        -->
    </div>
</template>

<script type="text/ecmascript-6">
    // 引入通用的modal模态框组件库
    import CommonPopModal from './CommonPopModal';
    export default {
        name: 'GoodsListItem',
        data () {
            return {
                // 商品索引值
                productIndex: 0,
                // 未登录点击查看详情和加入购物车弹框的标题
                modalHeader: '未登录成功的模态框',
                // 登录成功后点击查看购物车弹框的标题
                modalCartHeader: '登录成功的模态框',
                // 不显示未登录点击查看购物车的弹框，默认为false
                mdShow: false,
                // 不显示登录成功后点击查看购物车的弹框，默认为false
                mdShowCart: false,
                // 不显示登录成功后点击查看详情的弹框，默认为false
                mdShowDetails: false,
                // 记录鼠标移入元素的显示
                isShow: null,
                // 记录鼠标移出元素的隐藏
                isHide: null
            };
        },
        // 父组件向子组件传递过来的值，这里接收之前先验证下类型
        props: {
            'goodsListItem': {
                type: Array
            }
        },
        methods: {
            // 选项卡切换的索引值
            tabIndex ( item, index ) {
                item.productIndex = index;
            },
            // 鼠标移入商品的时候，进行一些元素显示的操作
            executedEnter ( index ) {
                this.isShow = index;
                this.isHide = null;
            },
            // 鼠标移出商品的时候，进行一些元素隐藏的操作
            executedLeave ( index ) {
                this.isHide = index;
                this.isShow = null;
            },
            // 关闭通用的弹层方法
            closeModal () {
                this.mdShow = false;
                this.mdShowCart = false;
                this.mdShowDetails = false;
                // 显示滚动条
                this.$refs.mask.showScroll ();
            },
            viewShoppingCart () {
                this.$router.push ({
                    name: 'MyShoppingCart'
                });
                // 显示滚动条
                this.$refs.mask.showScroll ();
            },
            viewShoppingDetails ( productSkuId ) {
                if ( !sessionStorage.getItem ( 'userInfo' ) ) {
                    this.mdShowDetails = true;
                    this.$refs.mask.hideScroll ();
                } else {
                    this.mdShowDetails = false;
                    this.$refs.mask.showScroll ();
                    this.$router.push ({
                        name: 'GoodsDetails',
                        query: {
                            skuId: productSkuId
                        }
                    });
                }
            },
            // 添加商品到购物车面板中
            addShoppingCartPanelHandler ( productSkuId ) {
                this.$http.post ( '/goodsLists/cartList', {
                    productSkuId: productSkuId
                }).then ( ( response ) => {
                    let res = response.data;
                    if ( res.status == "0" ) {
                        console.log ( '恭喜，商品已成功加入购物车！' );
                        this.$store.commit ( 'updateCartCount', 1 );
                    } else {
                        if ( res.status == "10001" ) {
                            this.mdShow = true;
                            // result：true
                            console.log ( this.mdShow );
                        }
                    }
                });
            }
        },
        // 注册局部组件
        components: {
            // 通用的modal模态框组件
            CommonPopModal
        }
    };
</script>

<style lang="css" rel="stylesheet/css" scoped>
    /**
       商品列表页展示 start
    */
    .goodsList li {
        float: left;
        width: 262px;
        height: 367px;
        border: 1px solid #999;
        border-radius: 5px;
        text-align: center;
        margin: 0 48px 48px 0;
        cursor: pointer;
    }

    .goodsList li.inActive {
        -webkit-transition: .25s all ease-in;
        -moz-transition: .25s all ease-in;
        -o-transition: .25s all ease-in;
        -ms-transition: .25s all ease-in;
        transition: .25s all ease-in;
        background-color: #3e3e3e;
        border: 1px solid #3e3e3e;
    }

    .goodsList li.outActive {
        -webkit-transition: .25s all ease-out;
        -moz-transition: .25s all ease-out;
        -o-transition: .25s all ease-out;
        -ms-transition: .25s all ease-out;
        transition: .25s all ease-out;
        background-color: transparent;
        border: 1px solid #999;
    }

    .goodsList li:nth-of-type(4n) {
        margin-right: 0;
    }

    .goodsList li .showShoppingPic a {
        display: block;
        padding: 20px 0 0 0;
    }

    .goodsList li .showShoppingPic img {
        width: 126px;
        height: 159px;
    }

    .goodsList li .showShoppingPic img.inActive {
        -webkit-transform: rotate(-360deg) scale(.8);
        -moz-transform: rotate(-360deg) scale(.8);
        -o-transform: rotate(-360deg) scale(.8);
        -ms-transform: rotate(-360deg) scale(.8);
        transform: rotate(-360deg) scale(.8);
        -webkit-transition: .4s all ease-in;
        -moz-transition: .4s all ease-in;
        -o-transition: .4s all ease-in;
        -ms-transition: .4s all ease-in;
        transition: .4s all ease-in;
    }

    .goodsList li .showShoppingPic img.outActive {
        -webkit-transform: rotate(0deg) scale(1);
        -moz-transform: rotate(0deg) scale(1);
        -o-transform: rotate(0deg) scale(1);
        -ms-transform: rotate(0deg) scale(1);
        transform: rotate(0deg) scale(1);
        -webkit-transition: .4s all ease-out;
        -moz-transition: .4s all ease-out;
        -o-transition: .4s all ease-out;
        -ms-transition: .4s all ease-out;
        transition: .4s all ease-out;
    }

    .goodsList li h2 {
        font-weight: normal!important;
        font-size: 16px!important;
        font-family: ''!important;
        color: #333;
        padding: 26px 0 0 0;
    }

    .goodsList li h2.inActive {
        color: #fff;
    }

    .goodsList li h2.outActive {
        color: #333;
    }

    .goodsList li p {
        font-weight: normal!important;
        font-size: 14px!important;
        font-family: ''!important;
        color: #999;
        padding: 6px 0 0 0;
        width: 240px;
        margin: 0 auto;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .goodsList li p.inActive {
        color: #fff;
    }

    .goodsList li p.outActive {
        color: #999;
    }

    .goodsList li .goodsListOfColor {
        padding: 20px 0 0 0;
    }

    .goodsList li .goodsListOfColor a {
        display: inline-block;
        width: 16px;
        height: 16px;
        margin: 0 9px 0 0;
    }

    .goodsList li .goodsListOfColor a:nth-of-type(1).active {
        background: url(./../assets/images/blue_active_ico.png) no-repeat;
    }

    .goodsList li .goodsListOfColor a:nth-of-type(2).active {
        background: url(./../assets/images/black_active_ico.png) no-repeat;
    }

    .goodsList li .goodsListOfColor a:nth-of-type(3).active {
        background: url(./../assets/images/golden_active_ico.png) no-repeat;
    }

    .goodsList li .goodsListOfColor a:nth-of-type(4).active {
        background: url(./../assets/images/pink_active_ico.png) no-repeat;
    }

    .goodsList li .goodsListOfColor a:last-of-type {
        margin-right: 0;
    }

    .goodsList li .goodsListOfBtn {
        margin: 20px 0 0 0;
        position: relative;
    }

    .goodsList li .goodsListOfBtnA {
        visibility: hidden;
    }

    .goodsList li .showGoodsListOfBtnA {
        visibility: visible;
    }

    .goodsList li .goodsListOfBtnA a {
        display: inline-block;
        width: 102px;
        height: 30px;
        border: 1px solid #cfcfcf;
        border-radius: 5px;
        background-color: #fff;
        font-weight: normal!important;
        font-size: 16px!important;
        line-height: 30px!important;
        font-family: ''!important;
        color: #999;
        text-align: center;
        margin: 0 23px 0 0;
    }

    .goodsList li .goodsListOfBtnA a:nth-of-type(2) {
        background-color: #278bdd;
        color: #fff;
        border: 1px solid #278bdd;
    }

    .goodsList li .goodsListOfBtnA a:last-of-type {
        margin-right: 0;
    }

    .goodsList li .goodsListOfPriceAndSales {
        visibility: visible;
    }

    .goodsList li .hiddenPriceAndSales {
        visibility: hidden;
    }

    .goodsListOfPriceAndSales strong,
    .goodsListOfPriceAndSales span {
        width: 102px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .goodsListOfPriceAndSales strong {
        position: absolute;
        left: -11px;
        bottom: -5px;
        font-weight: bold!important;
        font-size: 18px!important;
        font-family: ''!important;
        color: #d71b02;
        z-index: 99;
    }

    .goodsListOfPriceAndSales span {
        position: absolute;
        right: 2px;
        bottom: -4px;
        font-weight: normal!important;
        font-size: 14px!important;
        font-family: ''!important;
        color: #999;
        z-index: 99;
    }
    /**
        商品列表页展示 end
     */
</style>
