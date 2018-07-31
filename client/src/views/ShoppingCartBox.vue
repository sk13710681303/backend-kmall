<template>
    <div
        class="shopping-cart fl"
    >
        <div class="shopping-cart-list clearfix">
            <em class="fl"></em>
            <span class="ball-rect fl">购物车</span>
            <em class="fl" :class="{ 'active': cartCount > 0 }">
                {{ cartCount }}
            </em>
        </div>
        <!--
            购物车弹框 start
        -->
        <div class="shoppingCartBox" v-if="shoppingCartShowAndHide">
            <!--
                无商品弹框 start
            -->
            <div class="shoppingCartBoxOfNoShop shoppingCartBoxOfYesOrNoShop" v-if="totalCount<=0">
                <!--
                    小三角形 start
                -->
                <span class="boxTriangle_ico"></span>
                <!--
                    小三角形 end
                 -->
                <span class="shoppingCartBoxOfNoShop_ico"></span>
                <h3 class="shoppingCartBoxOfNoShop_title">购物车为空</h3>
                <p class="shoppingCartBoxOfNoShop_desc">还没选购任何商品，现在前往商城选购吧!</p>
            </div>
            <!--
                无商品弹框 end
            -->
            <!--
                有商品弹框 start
            -->
            <div class="shoppingCartBoxOfYesShop shoppingCartBoxOfYesOrNoShop" v-else>
                <!--
                    小三角形 start
                -->
                <span class="boxTriangle_ico"></span>
                <!--
                    小三角形 end
                 -->
                <ul class="shoppingShowList">
                    <li
                        class="clearfix"
                        v-for="(item, index) in shoppingCartPanelData"
                        @mouseenter="executedShow(item)"
                        @mouseleave="executedHide(item)"
                    >
                        <div class="shoppingPic fl">
                            <a class="fl" href="javascript:;">
                                <img
                                    :src="'/static/images/'+item.productSmallImg"
                                    class="fl"
                                    :title="item.productTitle"
                                    :alt="item.productTitle"
                                />
                            </a>
                        </div>
                        <div class="shoppingDesc fr">
                            <h3>{{ item.productTitle }}</h3>
                            <p>{{ item.productSubTitle }}</p>
                            <span class="shoppingDesc-color">{{ item.productSpecJson.productShowName }}</span>
                            <strong>￥{{ item.productPrice }} x {{ item.count }}</strong>
                        </div>
                        <div class="delBtn">
                            <a
                                href="javascript:;"
                                :class="{ 'hideDelBtn': item.isHide }"
                                @click="delShoppingCartPanelData(item.productSkuId)"
                            >

                            </a>
                        </div>
                    </li>
                </ul>
                <div class="goShoppingCart clearfix">
                    <div class="goShoppingCart-left fl">
                        <strong>共计{{ totalCount }}件商品</strong>
                        <strong>合计：<span>¥{{ totalPrice }}</span></strong>
                    </div>
                    <div class="goShoppingCart-right fr">
                        <router-link :to="{ path: '/myShoppingCart' }">去购物车</router-link>
                    </div>
                </div>
            </div>
            <!--
                有商品弹框 end
            -->
        </div>
        <!--
            购物车弹框 end
        -->
        <!--
            小球 start
        -->
        <!--<transition-->
            <!--name="ball"-->
            <!--@before-enter="beforeEnter"-->
            <!--@enter="enter"-->
            <!--@after-enter="afterEnter"-->
            <!--:css = "true"-->
        <!--&gt;-->
            <!--<div class="addShoppingCartMask" v-show="ball.isShow">-->
                <!--<img class="mask-item" />-->
            <!--</div>-->
        <!--</transition>-->
        <!--
            小球 end
        -->
    </div>
</template>

<script type="text/ecmascript-6">
    import { mapState } from 'vuex';
    export default {
        name: 'ShoppingCartBox',
        data () {
            return {
                // 默认不显示，是隐藏的
                isHide: true
            };
        },
        methods: {
            executedShow ( item ) {
                var index = this.shoppingCartPanelData.indexOf ( item );
                this.shoppingCartPanelData[index].isHide = false;
            },
            executedHide ( item ) {
                var index = this.shoppingCartPanelData.indexOf ( item );
                this.shoppingCartPanelData[index].isHide = true;
            },
            delShoppingCartPanelData ( skuId ) {
                this.$store.commit ( 'delShoppingCartPanelData', skuId );
            },
            // 鼠标移入显示购物车
            showShoppingCart () {
                this.$store.commit ( 'showShoppingCart' );
            },
            // 鼠标移出显示购物车
            hideShoppingCart () {
                this.$store.commit ( 'hideShoppingCart' );
            },
            /**
             * 获取到小球要走的位置，也就是通过点击购物车来去做判断的，这个要计算下
             */
            beforeEnter ( el ) {
                // 获取点击购物车按钮的所在位置
                let oRect = this.ball.el.getBoundingClientRect ();
                // 获取顶部购物车的位置
                let oBallRect = document.querySelectorAll ( '.ball-rect' )[0].getBoundingClientRect ();
                // 拿到我们当前的小球
                var oMaskItem = document.querySelectorAll ( '.mask-item' )[0];
                // 计算点击购物车到购物车顶部的距离差值
                /**
                 * (oBallRect.left + 30)是顶部购物车的中心点到左侧的距离
                 * (oRect.left + (oRect.width) / 2)是点击购物车按钮中心点到左侧的距离
                 */
                let x = ( oBallRect.left + 30 ) - ( oRect.left + oRect.width / 2 );
                let y = oRect.top + oRect.height / 2 - oBallRect.top - 55;
                el.style.transform = 'translate3d(0, ' + y + 'px, 0)';
                // 往左往右走
                oMaskItem.style.transform = 'translate3d(-' + x + 'px, 0, 0)';
                oMaskItem.src = this.ball.img;
            },
            enter ( el ) {
                // 拿到我们当前的小球
                var oMaskItem = document.querySelectorAll ( '.mask-item' )[0];
                let a = el.offsetHeight;
                el.a = a;
                el.style.transform = 'translate3d(50px, 3px, 0)';
                oMaskItem.style.transform = 'translate3d(0, 0, 0)';
            },
            afterEnter () {
                this.ball.isShow = false;
            }
        },
        computed: {
            // vuex辅助函数
            ...mapState (['cartCount', 'shoppingCartShowAndHide'])
            // 获取商品列表页数据
            /**shoppingCartPanelData () {
                return this.$store.state.shoppingCartPanelData;
            },
            // 获取点击添加购物车的总价格
            totalPrice () {
                return this.$store.getters.totalPrice;
            },
            // 获取控制购物车显示和隐藏的变量
            shoppingCartShowAndHide () {
                return this.$store.state.shoppingCartShowAndHide;
            },
            // 获取小球
            ball () {
                return this.$store.state.ball;
            }
            // 获取点击添加购物车的总数量
            cartCount () {
                return this.$store.state.cartCount;
            }*/
        }
    };
</script>

<style lang="css" rel="stylesheet/css" scoped>
    .shopping-cart {
        width: 132px;
        height: 38px;
        border: 1px solid #bebebe;
        border-radius: 50px;
        cursor: pointer;
        margin: 10px 0 0 0;
    }

    .shopping-cart .shopping-cart-list {
        position: relative;
    }

    /**
        购物车弹框 start
     */
    .shoppingCartBox {
        position: absolute;
        cursor: default;
    }
    /**
        有商品的弹框 start
     */
    .shoppingCartBox .shoppingCartBoxOfYesShop {
        position: absolute;
        left: -160px;
        top: 15px;
        width: 350px;
        height: auto;
        background: #fff;
        border-radius: 5px;
        z-index: 9999;
    }

    .shoppingShowList {
        width: 310px;
        padding: 20px;
        height: 102px;
        overflow: auto;
    }

    .shoppingShowList li {
        width: 294px!important;
        height: auto!important;
        float: none!important;
        border: 0 none!important;
        text-align: left!important;
        position: relative;
    }

    .shoppingShowList li:last-of-type {
        margin-bottom: 0;
    }

    .shoppingPic a {
        border: 1px solid #e5e5e5;
        padding: 10px 12px;
    }

    .shoppingPic img {
        width: 63px;
        height: 80px;
    }

    .shoppingDesc {
        /*padding: 0 0 0 15px;*/
    }

    .shoppingDesc h3 {
        font-weight: normal!important;
        font-size: 14px!important;
        font-family: ''!important;
        color: #333!important;
        padding: 1px 0 0 0!important;
    }

    .shoppingDesc p {
        font-weight: normal!important;
        font-size: 12px!important;
        font-family: ''!important;
        color: #999!important;
        padding: 2px 0 0 0!important;
        width: 190px!important;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .shoppingDesc span,
    .shoppingDesc strong {
        display: block;
    }

    .shoppingDesc strong {
        font-weight: normal!important;
        font-size: 14px!important;
        font-family: ''!important;
        color: #999!important;
        padding: 9px 0 0 0;
    }

    .shoppingDesc .shoppingDesc-color {
        font-weight: normal!important;
        font-size: 14px!important;
        font-family: ''!important;
        color: #666!important;
        padding: 9px 0 0 0;
    }

    .shoppingShowList li .delBtn a {
        position: absolute;
        bottom: 10px;
        right: 10px;
        width: 22px;
        height: 22px;
        background: url(./../assets/images/shoppingCart_close_ico2.png) no-repeat;
        background-size: 22px 22px;
    }

    .shoppingShowList li .delBtn a.showDelBtn {
        display: block;
    }

    .shoppingShowList li .delBtn a.hideDelBtn {
        display: none;
    }

    .goShoppingCart {
        width: 310px;
        height: 45px;
        background-color: #dfdfdf;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        padding: 30px 20px;
    }

    .goShoppingCart-left {
        padding-left: 0;
    }

    .goShoppingCart-left strong {
        display: block;
        font-weight: normal!important;
        font-size: 16px!important;
        font-family: ''!important;
        color: #999!important;
    }

    .goShoppingCart-left strong:nth-of-type(1) {
        margin: 0 0 0 -20px;
    }

    .goShoppingCart-left,
    .goShoppingCart-left strong:nth-of-type(2) {
        position: relative;
        top: -2px;
    }

    .goShoppingCart-left strong:nth-of-type(2) span {
        color: #ed0000!important;
    }

    .goShoppingCart-right a {
        display: inline-block;
        width: 148px;
        height: 45px;
        border-radius: 5px;
        background-color: #278bdd;
        font-weight: normal!important;
        font-size: 16px!important;
        line-height: 45px!important;
        font-family: ''!important;
        color: #fff!important;
        text-align: center;
    }
    /**
        有商品的弹框 end
     */
    /**
        无商品弹框 start
     */
    .shoppingCartBox .shoppingCartBoxOfNoShop {
        position: absolute;
        left: -120px;
        top: 15px;
        width: 310px;
        height: 210px;
        background-color: #fff;
        border-radius: 5px;
        text-align: center;
        z-index: 9999;
    }

    .shoppingCartBoxOfYesOrNoShop .boxTriangle_ico {
        position: absolute;
        right: 55px;
        top: -12px;
        width: 25px;
        height: 12px;
        background: url(./../assets/images/boxTriangle_ico.png) no-repeat;
        background-size: 25px 12px;
    }

    .shoppingCartBoxOfNoShop .shoppingCartBoxOfNoShop_ico {
        display: block;
        width: 84px;
        height: 67px;
        background: url(./../assets/images/shoppingCart_empty_ico.png) no-repeat;
        background-size: 84px 67px;
        margin: 41px 0 0 113px;
    }

    .shoppingCartBoxOfNoShop .shoppingCartBoxOfNoShop_title {
        font-weight: normal!important;
        font-size: 16px!important;
        font-family: ''!important;
        color: #333!important;
        margin: 23px 0 11px 0;
    }

    .shoppingCartBoxOfNoShop .shoppingCartBoxOfNoShop_desc {
        font-weight: normal!important;
        font-size: 14px!important;
        font-family: ''!important;
        color: #999!important;
    }
    /**
        无商品弹框 end
     */
    /**
        购物车弹框 end
     */

    /**
        头部购物车右边样式 start
    */
    .shopping-cart em:nth-of-type(1) {
        width: 29px;
        height: 29px;
        background: url(./../assets/images/shoppingCart_ico.png) no-repeat 12px 12px;
        background-size: 17px 17px;
    }

    .shopping-cart span {
        font-weight: normal!important;
        font-size: 16px!important;
        line-height: 38px!important;
        font-family: ''!important;
        color: #eee!important;
        padding: 0 8px;
    }

    .shopping-cart em:nth-of-type(2),
    .shopping-cart em:nth-of-type(2).active {
        width: 26px;
        height: 26px;
        border-radius: 13px;
        border: 1px solid #bebebe;
        margin: 5px 0 0 0;
        background-color: #fff;
        font-weight: normal!important;
        font-size: 16px!important;
        line-height: 26px!important;
        font-family: ''!important;
        color: #1275c4!important;
        text-align: center;
    }
    /**
        头部购物车右边样式 end
    */
    /**
        小球 start
     */
    .ball-enter-active {
        transition: .5s cubic-bezier( .62, 1.74, 1, 1.07 );
    }

    /** 横向的就走直线就行了 start */
    .ball-enter-active .mask-item {
        transition: .5s cubic-bezier( 0, 0, 1, 1 );
    }
    /** 横向的就走直线就行了 end */
    /**
        小球 end
     */
</style>
