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
            <span slot="goodsDetailsPage">商品详情页</span>
            <!-- 灵活的运用插槽 end -->
        </nav-bread>
        <!--
            NavBread end
        -->

        <!--
            商品详情页展示 start
        -->
        <div class="goodsDetails comWidth clearfix" v-if="goodsDetailsDataInfo">
            <div class="goodsDetailsOfLeftArea fl">
                <nav>
                    <a
                        :class="{ 'on': index == imgIndex }"
                        href="javascript:;"
                        :key="index"
                        v-for="(smallImg, index) in goodsDetailsDataInfo.productLittleImg"
                        title="商品展示小图"
                        @click="tabImg(index)"
                    >
                        <img
                            :src="'/static/images/' + smallImg"
                            alt="商品展示小图"
                        />
                    </a>
                </nav>
            </div>
            <div class="goodsDetailsOfCenterArea fl">
                <a
                    :class="{ 'on': index == imgIndex }"
                    href="javascript:;"
                    :key="index"
                    v-for="(largeImg, index) in goodsDetailsDataInfo.productLargeImg"
                    title="商品展示大图"
                >
                    <img
                        :src="'/static/images/' + largeImg"
                        alt="商品展示大图"
                    />
                </a>
            </div>
            <div class="goodsDetailsOfRightArea fr">
                <h2>{{ goodsDetailsDataInfo.productTitle }}（{{ goodsDetailsDataInfo.productSpecJson.productShowName }}）</h2>
                <div class="goodsDetailsOfDescAndPrice clearfix">
                    <p class="fl">{{ goodsDetailsDataInfo.productSubTitle }}</p>
                    <span class="fr">¥{{ goodsDetailsDataInfo.productPrice }}</span>
                </div>
                <div class="goodsDetailsOfColor clearfix">
                    <strong class="fl">颜色</strong>
                    <div class="color clearfix">
                        <!--
                            如果当前颜色值对应的商品颜色id跟我从商品列表页点击过来的商品id值相等，
                            那么加上active状态
                        -->
                        <ul>
                            <li
                                :class="{ 'cur': color.productSkuId == $route.query.skuId }"
                                :key="index"
                                v-for="(color, index) in goodsDetailsDataInfo.productSkuColorList"
                            >
                                <router-link
                                    :title="color.productShowName"
                                    :to="{ name: 'GoodsDetails', query: { skuId: color.productSkuId } }"
                                >
                                    <img
                                        :alt="color.productShowName"
                                        :src="'/static/images/' + color.productImage"
                                    />
                                </router-link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="goodsDetailsOfNum clearfix">
                    <strong class="fl">数量</strong>
                    <div class="num fl clearfix">
                        <em class="fl" @click="subCount"></em>
                        <span class="fl">{{ count }}</span>
                        <em class="fl" @click="addCount"></em>
                    </div>
                </div>
                <div class="goodsDetailsOfBtn clearfix">
                    <a class="fl" href="javascript:;" @click="addShoppingCartPanelHandler">加入购物车</a>
                    <a class="fl" href="javascript:;">现在去购买</a>
                </div>
            </div>
        </div>
        <!--
            商品详情页展示 end
        -->

        <!--
            小小游通用的modalPopModal start
        -->
        <common-pop-modal
            ref="mask"
            :md-show="mdShowDetailsSubCount"
            @on-close="closeModal"
        >
            <h1 slot="modal-title">
                {{ modalHeader }}
            </h1>
            <div slot="modal-message">
                商品已达最低购买数量，无法继续减少！
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
            :md-show="mdShowDetailsAddCount"
            @on-close="closeModal"
        >
            <h1 slot="modal-title">
                {{ modalHeader }}
            </h1>
            <div slot="modal-message">
                商品已达最高购买数量，无法继续添加！
            </div>
            <div slot="modal-btnGroup">
                <a href="javascript:;" @click="closeModal">关闭</a>
            </div>
        </common-pop-modal>
        <!--
            小小游通用的modalPopModal end
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
    // 通用的头部组件
    import NavHeader from './NavHeader';
    // 通用的面包屑组件
    import NavBread from './NavBread';
    // 通用的底部组件
    import NavFooter from './NavFooter';
    // 通用的模态框
    import CommonPopModal from './CommonPopModal';
    export default {
        name: 'GoodsDetails',
        mounted () {
            // 调用商品详情页的接口数据方法
            this.goodsDetailsDatas ();
        },
        data () {
            return {
                // 用户从商品列表页选择某个颜色商品带过来的商品skuId
                skuId: this.$route.query.skuId,
                // 商品详情页数据
                goodsDetailsData: [],
                // 记录商品详情页小缩略图索引值
                imgIndex: 0,
                // 记录商品详情页的数量，默认为1
                count: 1,
                // 商品详情页购买数量到达最低的限制弹框，默认为false
                mdShowDetailsSubCount: false,
                // 商品详情页购买数量到达最高的限制弹框，默认为false
                mdShowDetailsAddCount: false,
                // 商品详情页购买数量限制的弹框标题
                modalHeader: '商品购买数量限制的模态框'
            };
        },
        // 监控skuId的变换来达到切换对应商品的功能
        watch: {
            '$route.query.skuId' () {
                this.skuId = this.$route.query.skuId;
                console.log ( this.skuId );
                this.imgIndex = 0;
            }
        },
        computed: {
            // 筛选商品详情页的数据
            goodsDetailsDataInfo () {
                let goodsDetailsDataInfo = this.goodsDetailsData.filter ( ( sku ) => {
                    return Number ( sku.productSkuId ) === Number ( this.skuId );
                })[0];
                return goodsDetailsDataInfo;
            }
        },
        methods: {
            // 切换小缩略图
            tabImg ( index ) {
                this.imgIndex = index;
            },
            // 这个方法后续要修改的
            addShoppingCartPanelHandler () {
                // 把我们的商品和商品数量传进来之后，在vuex里面进行小更改
                let skuData = { info: this.goodsDetailsDataInfo, count: this.count };
                this.$store.commit ( 'addShoppingCartPanelData', skuData );
            },
            // 点击减号减少商品数量，注意都有相对应的条件限制
            subCount () {
                this.count--;
                if ( this.count < 1 ) {
                    // alert ( '商品已达最低购买数量，无法继续减少！' );
                    this.mdShowDetailsSubCount = true;
                    // 隐藏滚动条
                    this.$refs.mask.hideScroll ();
                    this.count = 1;
                }
            },
            // 点击加号增加商品数量，注意都有相对应的条件限制
            addCount () {
                this.count++;
                if ( this.count > this.goodsDetailsDataInfo.productLimitNum ) {
                    // alert ( '商品已达最高购买数量，无法继续添加！' );
                    this.mdShowDetailsAddCount = true;
                    // 隐藏滚动条
                    this.$refs.mask.hideScroll ();
                    this.count = this.goodsDetailsDataInfo.productLimitNum;
                }
            },
            // 关闭通用的弹层方法
            closeModal () {
                this.mdShow = false;
                this.mdShowDetailsSubCount = false;
                this.mdShowDetailsAddCount = false;
                // 显示滚动条
                this.$refs.mask.showScroll ();
            },
            // 获取商品详情页的接口数据
            goodsDetailsDatas () {
                this.$http.get ( '/goodsLists/details' )
                    .then ( ( response ) => {
                        var res = response.data;
                        if ( res.status == "0" ) {
                            this.goodsDetailsData = res.result.list;
                            this.mdShowDetails = false;
                        } else {
                            if ( res.status == "10001" ) {
                                this.goodsDetailsData = [];
                                this.mdShowDetails = true;
                            }
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
            NavFooter,
            // 通用的模态框
            CommonPopModal
        }
    };
</script>

<style lang="css" rel="stylesheet/css" scoped>
    /**
        商品详情页展示 start
     */
    .goodsDetails {
        width: 938px;
        padding: 30px 130px;
        border: 1px solid #c9c9c9;
        border-radius: 5px;
        background-color: #fff;
        margin-top: 30px;
        margin-bottom: 48px;
    }

    .goodsDetailsOfLeftArea a {
        display: block;
        border-radius: 5px;
        padding: 6px 19px;
        text-align: center;
        margin: 0 0 13px 0;
        border: 3px solid #cdcdcd;
        background-color: #fff;
    }

    .goodsDetailsOfLeftArea a.on {
        border: 3px solid #2f8cda;
    }

    .goodsDetailsOfLeftArea a:last-of-type {
        margin-bottom: 0;
    }

    .goodsDetailsOfLeftArea img {
        width: 16px;
        height: 50px;
    }

    .goodsDetailsOfLeftArea a:nth-of-type(1) img:nth-of-type(1),
    .goodsDetailsOfLeftArea a:nth-of-type(2) img:nth-of-type(1) {
        width: 24px;
    }

    .goodsDetailsOfCenterArea,
    .goodsDetailsOfRightArea {
        margin: 45px 0 0 0;
    }

    .goodsDetailsOfCenterArea a {
        display: none;
        margin: 0 0 0 137px;
    }

    .goodsDetailsOfCenterArea a.on {
        display: block;
    }

    .goodsDetailsOfCenterArea img {
        width: 224px;
        height: 282px;
    }

    .goodsDetailsOfRightArea {
        width: 368px;
    }

    .goodsDetailsOfRightArea h2 {
        font-weight: normal!important;
        font-size: 16px!important;
        font-family: ''!important;
        color: #333!important;
        text-align: left;
    }

    .goodsDetailsOfDescAndPrice {
        border-bottom: 1px solid #c9c9c9;
        height: 51px;
    }

    .goodsDetailsOfDescAndPrice p {
        width: 290px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-weight: normal!important;
        font-size: 14px!important;
        font-family: ''!important;
        color: #999!important;
        padding: 4px 0 0 0;
        text-align: left;
    }

    .goodsDetailsOfDescAndPrice span {
        font-weight: bold!important;
        font-size: 18px!important;
        font-family: ''!important;
        color: #da4d00!important;
    }

    .goodsDetailsOfColor {
        margin: 30px 0 0 0;
    }

    .goodsDetailsOfColor strong {
        font-weight: normal!important;
        font-size: 16px!important;
        line-height: 28px!important;
        font-family: ''!important;
        color: #666!important;
        margin: 0 14px 0 0;
    }

    .goodsDetailsOfColor .color {
        width: 322px;
        height: 28px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .goodsDetailsOfColor .color li {
        float: left;
        width: 26px;
        height: 26px;
        margin: 0 14px 0 0;
    }

    .goodsDetailsOfColor .color li:nth-of-type(1).cur {
        background: url(./../assets/images/blue_active_ico_26x26.png) no-repeat;
    }

    .goodsDetailsOfColor .color li:nth-of-type(2).cur {
        background: url(./../assets/images/black_active_ico_26x26.png) no-repeat;
    }

    .goodsDetailsOfColor .color li:nth-of-type(3).cur {
        background: url(./../assets/images/golden_active_ico_26x26.png) no-repeat;
    }

    .goodsDetailsOfColor .color li:nth-of-type(4).cur {
        background: url(./../assets/images/pink_active_ico_26x26.png) no-repeat;
    }

    .goodsDetailsOfColor .color li:last-of-type {
        margin-right: 0;
    }

    .goodsDetailsOfColor .color img {
        width: 26px;
        height: 26px;
    }

    .goodsDetailsOfNum {
        margin: 30px 0 0 0;
    }

    .goodsDetailsOfNum strong {
        font-weight: normal!important;
        font-size: 16px!important;
        line-height: 28px!important;
        font-family: ''!important;
        color: #666!important;
        margin: 0 14px 0 0;
    }

    .goodsDetailsOfNum .num em {
        width: 28px;
        height: 28px;
        background: url(./../assets/images/shoppingNumMinus_ico.png) no-repeat;
        background-size: 28px 28px;
        cursor: pointer;
    }

    .goodsDetailsOfNum .num em:nth-of-type(2) {
        background: url(./../assets/images/shoppingNumPlus_ico.png) no-repeat;
    }

    .goodsDetailsOfNum .num span {
        font-weight: normal!important;
        font-size: 16px!important;
        line-height: 28px!important;
        font-family: ''!important;
        color: #999!important;
        margin: 0 14px;
    }

    .goodsDetailsOfBtn {
        margin: 30px 0 0 0;
    }

    .goodsDetailsOfBtn a {
        width: 148px;
        height: 52px;
        background-color: #278bdd;
        border-radius: 5px;
        font-weight: normal!important;
        font-size: 16px!important;
        line-height: 52px!important;
        font-family: ''!important;
        color: #fff!important;
        text-align: center;
        margin: 0 72px 0 0;
    }

    .goodsDetailsOfBtn a:nth-of-type(2) {
        width: 146px;
        height: 50px;
        background-color: #fff;
        border: 1px solid #c9c9c9;
        color: #999!important;
    }

    .goodsDetailsOfBtn a:last-of-type {
        margin-right: 0;
    }
    /**
        商品详情页展示 end
     */
</style>
