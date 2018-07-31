<template>
    <div>
        <!--
            NavHeader start
        -->
        <nav-header></nav-header>
        <!--
            NavHeader start
        -->

        <!--
            NavBread start
        -->
        <nav-bread>
            <!-- 灵活的运用插槽 start -->
            <span slot="myShoppingCart">我的购物车</span>
            <!-- 灵活的运用插槽 end -->
        </nav-bread>
        <!--
            NavBread start
        -->

        <!--
            我的购物车 start
        -->
        <div class="myShoppingCart comWidth" >
            <div class="myShoppingCartOfTop">
                <h1>我的购物车</h1>
            </div>

            <!--
                无商品的购物车 start
            -->
            <div class="myShoppingCartOfNoCont" v-if="totalCount <= 0">
                <a href="javascript:;">
                    <img src="./../../static/images/empty_shoppingCart_ico.png" alt="无商品购物车" title="无商品购物车" />
                </a>
                <strong>您的购物车没有商品</strong>
                <router-link :to="{ path: '/' }">现在选购</router-link>
            </div>
            <!--
                无商品的购物车 end
            -->

            <!--
                有商品的购物车 start
            -->
            <div class="myShoppingCartOfCont" v-else>
                <table id="cartTable">
                    <thead>
                        <tr>
                            <th>商品信息</th>
                            <th>单价</th>
                            <th>数量</th>
                            <th>小计</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in cartListData">
                            <td class="clearfix">
                                <a
                                    class="check fl"
                                    href="javascript:;"
                                    :class="{ 'checkActive': item.isChecked }"
                                    @click="editCart('isChecked', item)"
                                >

                                </a>
                                <a
                                    class="fl"
                                    href="javascript:;"
                                    :title="item.productTitle"
                                >
                                    <img
                                        class="fl"
                                        :src="'/static/images/' + item.productSmallImg"
                                        :alt="item.productTitle"  />
                                </a>
                                <p class="fl">
                                    {{ item.productSubTitle }}（{{ item.productSpecJson.productShowName }}）
                                </p>
                            </td>
                            <td>{{ item.productPrice | currency('¥') }}</td>
                            <td>
                                <a class="reduce" href="javascript:;" @click="editCart('reduce', item)"></a>
                                <em>{{ item.productNumber }}</em>
                                <a class="add" href="javascript:;" @click="editCart('add', item)"></a>
                            </td>
                            <td class="subTotal">{{ (item.productNumber * item.productPrice) | currency('¥') }}</td>
                            <td>
                                <a class="delete" href="javascript:;" @click="delConfirm(item)"></a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="myShoppingCartCount clearfix">
                    <div class="myShoppingCartCountOfLeft fl">
                        <a
                            href="javascript:;"
                            class="check-all fl"
                            :class="{ 'active': checkAllFlag }"
                            @click="toggleCheckAllGoods"
                        >
                            全选
                        </a>
                        <a
                            class="fl"
                            href="javascript:;"
                            @click="delAllConfirm(true)"
                        >
                            删除全部选中的商品
                        </a>
                    </div>
                    <div class="myShoppingCartCountOfRight clearfix fr">
                        <div class="fl">
                            <div class="myShoppingCartCountOfRightByLeft clearfix">
                                <strong class="fl">已选择 <span>{{ checkedAllSumCount }}</span> 件商品</strong>
                                <strong class="fl">应付金额：<span>{{ checkedAllSumPrice | currency('¥') }}</span></strong>
                            </div>
                            <div class="myShoppingCartCountOfRightByCenter clearfix">
                                <em class="fl">共计 <span>{{ totalCount }}</span> 件商品</em>
                                <em class="fl">应付总额不含运费</em>
                            </div>
                        </div>
                        <div class="myShoppingCartCountOfRightByRight fl">
                            <a
                                href="javascript:;"
                                class="fl"
                                :class="{ 'btn-disabled': checkedCount == 0 }"
                                @click="nowSettlement"
                            >
                                现在结算
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <!--
                有商品的购物车 end
            -->
        </div>
        <!--
            我的购物车 end
        -->

        <!--
            小小游通用的modalPopModal start
        -->
        <common-pop-modal
            ref="mask"
            :md-show="mdShowCartList"
            @on-close="closeModal"
        >
            <h1 slot="modal-title">
                {{ modalHeader }}
            </h1>
            <div slot="modal-message">
                您确定删除此商品吗？
            </div>
            <div slot="modal-btnGroup">
                <a href="javascript:;" @click="delCart">确认</a>
                <a href="javascript:;" @click="closeModal">取消</a>
            </div>
        </common-pop-modal>
        <!--
            小小游通用的modalPopModal end
        -->

        <!--
            小小游通用的modalPopModal start
        -->
        <common-pop-modal
            :md-show="mdShowCheckedCartList"
            @on-close="closeModal"
        >
            <h1 slot="modal-title">
                {{ modalHeader }}
            </h1>
            <div slot="modal-message">
                您确定删除选中的商品吗？
            </div>
            <div slot="modal-btnGroup">
                <a href="javascript:;" @click="deleteAllCheckedGoods">确认</a>
                <a href="javascript:;" @click="closeModal">取消</a>
            </div>
        </common-pop-modal>
        <!--
            小小游通用的modalPopModal end
        -->

        <!--
            小小游通用的modalPopModal start
        -->
        <common-pop-modal
            :md-show="mdShowCartListReduceCount"
            @on-close="closeModal"
        >
            <h1 slot="modal-title">
                {{ modalShoppingLimitHeader }}
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
            :md-show="mdShowCartListAddCount"
            @on-close="closeModal"
        >
            <h1 slot="modal-title">
                {{ modalShoppingLimitHeader }}
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
            NavFooter start
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
    // 通用的模态框组件
    import CommonPopModal from './CommonPopModal';
    // 引入局部过滤器
    // import { currency } from './../util/currency';
    export default {
        name: 'MyShoppingCart',
        mounted () {
            // 初始化调用购物车后台返回的接口数据
            this.getCartListData ();
        },
        // 这是一个局部格式化金额的过滤器
        // filters: {
            // currency: currency
        // },
        data () {
            return {
                // 删除的商品
                delItem: '',
                // 某个登录用户下的购物车数据
                cartListData: [],
                // 商品删除确认的模态框标题
                modalHeader: '商品删除确认的模态框',
                // 商品详情页购买数量限制的弹框标题
                modalShoppingLimitHeader: '商品购买数量限制的模态框',
                // 某单商品删除确认的模态框变量，默认为false
                mdShowCartList: false,
                // 选中商品删除确认的模态框变量，默认为false
                mdShowCheckedCartList: false,
                // 我的购物车购买数量到达最低的限制弹框，默认为false
                mdShowCartListReduceCount: false,
                // 我的购物车购买数量到达最高的限制弹框，默认为false
                mdShowCartListAddCount: false,
                // 选中的所有商品
                isAllChecked: false
            };
        },
        computed: {
            // 获取共计添加到购物车的总数量
            totalCount () {
                let count = 0;
                this.cartListData.forEach ( ( item ) => {
                    count += item.productNumber;
                });
                return count;
            },
            // 全选选中状态时时更新
            checkAllFlag () {
                // 当商品选中的数量和数据里cartList里的商品length相等表示全选
                return this.checkedCount == this.cartListData.length;
            },
            // 选中的商品数量
            checkedCount () {
                let i = 0;
                this.cartListData.forEach ( ( item ) => {
                    if ( item.isChecked ) i++;
                });
                return i;
            },
            // 统计选择的总商品价格
            checkedAllSumPrice () {
                let sumPrice = 0;
                this.cartListData.forEach ( ( item ) => {
                    if ( item.isChecked ) {
                        sumPrice += parseFloat ( item.productPrice ) * parseInt ( item.productNumber );
                        return;
                    }
                    console.log ( '看看统计选择的总商品价格是否成功！' );
                });
                return sumPrice;
            },
            // 统计选择的总商品数量
            checkedAllSumCount () {
                let sumCount = 0;
                this.cartListData.forEach ( ( item ) => {
                    // 如果这个商品是选中的，那么就将数量进行累加
                    if ( item.isChecked ) {
                        sumCount += parseInt ( item.productNumber );
                        return;
                    }
                    console.log ( '看看统计选择的总商品数量是否成功！' );
                });
                return sumCount;
            }
        },
        methods: {
            // 根据传过来的商品productSkuId来指定删除某一个商品，确定删除吗？
            delConfirm ( item ) {
                // 将productSkuId全局缓存起来，等下点击确认删除要用到
                this.delItem = item;
                // 显示购物车确认删除弹框
                this.mdShowCartList = true;
                // 隐藏滚动条
                this.$refs.mask.hideScroll ();
            },
            // 根据传过来的商品productSkuId来指定删除某一个商品
            delCart () {
                this.$http.post ( '/users/cart/del', {
                    productSkuId: this.delItem.productSkuId
                }).then ( ( response ) => {
                    let res = response.data;
                    if ( res.status == "0" ) {
                        // 隐藏购物车确认删除弹框
                        this.mdShowCartList = false;
                        // 显示滚动条
                        this.$refs.mask.showScroll ();
                        // 再调一次接口重新拉取数据库最新数据
                        this.getCartListData ();
                        this.$store.commit ( 'updateCartCount', -this.delItem.productNumber );
                    }
                });
            },
            // 编辑购物车中的增减数量和商品选中状态方法
            editCart ( flag, item ) {
                // 点击减少
                if ( flag == "reduce" ) {
                    item.productNumber--;
                    if ( item.productNumber < 1 ) {
                        // alert ( '商品已达最低购买数量，无法继续减少！' );
                        this.mdShowCartListReduceCount = true;
                        // 隐藏滚动条
                        this.$refs.mask.hideScroll ();
                        item.productNumber = 1;
                        return;
                    }
                // 点击添加
                } else if ( flag == "add" ) {
                    item.productNumber++;
                    if ( item.productNumber > item.productLimitNum ) {
                        // alert ( '商品已达最高购买数量，无法继续添加！' );
                        this.mdShowCartListAddCount = true;
                        // 隐藏滚动条
                        this.$refs.mask.hideScroll ();
                        item.productNumber = item.productLimitNum;
                        return;
                    }
                // 点击切换
                } else if ( flag == "isChecked" ) {
                    // 切换单个商品选中状态
                    item.isChecked = !item.isChecked;
                } else {
                    // 显示滚动条
                    this.$refs.mask.showScroll ();
                }
                // 发送ajax请求
                this.$http.post ( '/users/cart/edit', {
                    productSkuId: item.productSkuId,
                    productNumber: item.productNumber,
                    isChecked: item.isChecked
                }).then ( ( response ) => {
                    let res = response.data;
                    if ( res.status == "0" ) {
                        console.log ( 'checkGoods number and checked save success！' );
                        let num = 0;
                        if ( flag == 'reduce' ) {
                            num = -1;
                        } else if ( flag == 'add' ) {
                            num = 1;
                        }
                        this.$store.commit ( 'updateCartCount', num );
                    }
                });
            },
            // 全选功能实现方法
            toggleCheckAllGoods () {
                let flag = !this.checkAllFlag;
                this.cartListData.forEach ( ( item ) => {
                    item.isChecked = flag;
                });
                this.$http.post ( '/users/cart/checkAll', {
                    checkAllFlag: flag
                }).then ( ( response ) => {
                    let res = response.data;
                    if ( res.status == "0" ) {
                        console.log ( 'checkAllStatus save success！' );
                    }
                });
            },
            // 根据传过来的商品是否选中来指定删除，确定删除选中的商品吗？
            delAllConfirm ( flag ) {
                // 将isAllChecked全局缓存起来，等下点击确认删除选中商品要用到
                this.isAllChecked = flag;
                console.log ( this.delItem.productNumber );
                // 显示购物车确认删除弹框
                this.mdShowCheckedCartList = true;
                // 隐藏滚动条
                this.$refs.mask.hideScroll ();
            },
            // 删除所有选中商品
            deleteAllCheckedGoods () {
                let num = 0;
                this.cartListData.map ( ( item ) => {
                    if ( item.isChecked == this.isAllChecked ) {
                        num += item.productNumber;
                    }
                });
                this.$http.post ( '/users/cart/isChecked', {
                    isChecked: this.isAllChecked
                }).then ( ( response ) => {
                    let res = response.data;
                    if ( res.status == "0" ) {
                        // 隐藏选中商品的购物车确认删除弹框
                        this.mdShowCheckedCartList = false;
                        // 显示滚动条
                        this.$refs.mask.showScroll ();
                        // 再调一次接口重新拉取数据库最新数据
                        this.getCartListData ();
                        this.$store.commit ( 'updateCartCount', -num );
                    }
                });
            },
            // 关闭通用的弹层方法
            closeModal () {
                this.mdShow = false;
                this.mdShowCartList = false;
                this.mdShowCheckedCartList = false;
                this.mdShowCartListReduceCount = false;
                this.mdShowCartListAddCount = false;
                // 显示滚动条
                this.$refs.mask.showScroll ();
            },
            // 获取某个用户下的购物车数据
            getCartListData () {
                this.$http.get ( '/users/cartList' )
                    .then ( ( response ) => {
                        let res = response.data;
                        if ( res.status == "0" ) {
                            this.cartListData = res.result;
                        } else {
                            this.cartListData = [];
                        }
                    });
            },
            // 点击现在结算
            nowSettlement () {
                if ( this.checkedCount > 0 ) {
                    this.$router.push ({
                        name: 'OrderConfirmation'
                    });
                }
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
            // 通用的modal模态框组件
            CommonPopModal
        }
    };
</script>

<style lang="css" rel="stylesheet/css" scoped>
    /**
        我的购物车 start
     */
    .myShoppingCart {
        width: 1198px;
        background-color: #eee;
        border: 1px solid #c9c9c9;
        border-radius: 5px;
        margin-top: 30px;
    }

    .myShoppingCartOfTop h1 {
        height: 58px;
        font-weight: bold!important;
        font-size: 18px!important;
        line-height: 59px!important;
        font-family: ''!important;
        color: #444!important;
        background-color: #f7f7f7;
        border-bottom: 1px solid #c9c9c9;
        padding: 0 0 0 30px;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        text-align: left;
    }

    .myShoppingCartOfCont {
        background-color: #fff;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
    }

    .myShoppingCartOfCont thead {
        background-color: #eee;
    }

    .myShoppingCartOfCont th {
        height: 36px;
        font-weight: normal!important;
        font-size: 14px!important;
        line-height: 36px!important;
        font-family: ''!important;
        color: #666!important;
        border-bottom: 1px solid #c9c9c9;
    }

    .myShoppingCartOfCont th:first-of-type {
        width: 680px;
        text-align: left;
        padding: 0 0 0 30px;
    }

    .myShoppingCartOfCont th:nth-of-type(2),
    .myShoppingCartOfCont th:nth-of-type(3),
    .myShoppingCartOfCont th:nth-of-type(4),
    .myShoppingCartOfCont th:nth-of-type(5),
    .myShoppingCartOfCont td:nth-of-type(2),
    .myShoppingCartOfCont td:nth-of-type(3),
    .myShoppingCartOfCont td:nth-of-type(4),
    .myShoppingCartOfCont td:nth-of-type(5) {
        width: 160px;
        text-align: center;
    }

    .myShoppingCartOfCont tbody tr {
        border-bottom: 1px solid #c9c9c9;
    }

    .myShoppingCartOfCont td {
        font-weight: bold!important;
        font-size: 16px!important;
        font-family: ''!important;
        color: #333!important;
        padding: 30px 0;
    }

    .myShoppingCartOfCont td:first-of-type {
        padding-left: 30px;
    }

    .myShoppingCartOfCont td:first-of-type a:first-of-type,
    .myShoppingCartOfCont td:first-of-type a:nth-of-type(2),
    .myShoppingCartOfCont td:last-of-type a {
        display: block;
    }

    .myShoppingCartOfCont td:first-of-type a:first-of-type {
        width: 28px;
        height: 46px;
        background: url(./../assets/images/shoppingCart_setDefault_ico.png) no-repeat left 18px;
        background-size: 28px 28px;
    }

    .myShoppingCartOfCont td:first-of-type a:first-of-type.checkActive {
        background-image: url(./../assets/images/shoppingCart_setDefault_active_ico.png);
    }

    .myShoppingCartOfCont td:first-of-type a:nth-of-type(2) {
        border: 1px solid #c9c9c9;
        padding: 6px 20px;
        margin: 0 24px;
    }

    .myShoppingCartOfCont td:first-of-type a:nth-of-type(2) img {
        width: 24px;
        height: 50px;
    }

    .myShoppingCartOfCont td:first-of-type p {
        width: 485px;
        line-height: 64px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        text-align: left;
    }

    .myShoppingCartOfCont td:nth-of-type(3) a,
    .myShoppingCartOfCont td:nth-of-type(3) em {
        display: inline-block;
    }

    .myShoppingCartOfCont td:nth-of-type(3) a {
        width: 28px;
        height: 28px;
        background: url(./../assets/images/shoppingNumMinus_ico.png) no-repeat;
        background-size: 28px 28px;
    }

    .myShoppingCartOfCont td:nth-of-type(3) a:nth-of-type(2) {
        background-image: url(./../assets/images/shoppingNumPlus_ico.png);
    }

    .myShoppingCartOfCont td:nth-of-type(3) em {
        position: relative;
        top: -6px;
        font-weight: bold!important;
        padding: 0 20px;
    }

    .myShoppingCartOfCont td:last-of-type a {
        width: 28px;
        height: 28px;
        background: url(./../assets/images/shoppingCart_close_ico2.png) no-repeat;
        background-size: 28px 28px;
        margin: 0 auto;
    }

    .myShoppingCartOfCont .myShoppingCartCount {
        background-color: #fff;
        padding: 45px 0;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
    }

    .myShoppingCartCount .myShoppingCartCountOfLeft {
        padding: 14px 0 0 0;
    }

    .myShoppingCartCountOfLeft a:first-of-type {
        width: auto;
        height: 28px;
        background: url(./../assets/images/shoppingCart_setDefault_ico.png) no-repeat 30px center;
        background-size: 28px 28px;
        font-weight: normal!important;
        font-size: 16px!important;
        line-height: 28px!important;
        font-family: ''!important;
        color: #666!important;
        padding: 0 0 0 66px;
    }

    .myShoppingCartCountOfLeft a:first-of-type.active {
        background-image: url(./../assets/images/shoppingCart_setDefault_active_ico.png);
    }

    .myShoppingCartCountOfLeft a:last-of-type {
        font-weight: normal!important;
        font-size: 16px!important;
        line-height: 28px!important;
        font-family: ''!important;
        color: #c9c9c9!important;
        padding: 0 0 0 24px;
    }

    .myShoppingCartCountOfLeft a:last-of-type:hover {
        text-decoration: underline;
    }

    .myShoppingCartCountOfRight div:first-of-type {
        padding: 1px 0 0 0;
    }

    .myShoppingCartCountOfRight .myShoppingCartCountOfRightByLeft strong,
    .myShoppingCartCountOfRight .myShoppingCartCountOfRightByCenter em {
        font-weight: normal!important;
        font-size: 16px!important;
        font-family: ''!important;
        color: #333!important;
    }

    .myShoppingCartCountOfRight .myShoppingCartCountOfRightByLeft strong:first-of-type {
        padding: 0 40px 0 0;
    }

    .myShoppingCartCountOfRight .myShoppingCartCountOfRightByLeft strong:first-of-type span,
    .myShoppingCartCountOfRight .myShoppingCartCountOfRightByCenter em:first-of-type span {
        font-weight: bold!important;
        font-size: 18px!important;
        font-family: ''!important;
    }

    .myShoppingCartCountOfRight .myShoppingCartCountOfRightByLeft strong:nth-of-type(2) span {
        font-size: 18px!important;
        color: #da4d00!important;
    }

    .myShoppingCartCountOfRight .myShoppingCartCountOfRightByCenter {
        padding: 3px 0 0 0;
    }

    .myShoppingCartCountOfRight .myShoppingCartCountOfRightByCenter em {
        color: #999;
    }

    .myShoppingCartCountOfRight .myShoppingCartCountOfRightByCenter em:first-of-type {
        padding: 0 26px 0 14px;
    }

    .myShoppingCartCountOfRight .myShoppingCartCountOfRightByCenter em:nth-of-type(2) {
        padding: 0 0 0 13px;
    }

    .myShoppingCartCountOfRight .myShoppingCartCountOfRightByRight a {
        width: 140px;
        height: 56px;
        background: #278bdd;
        border-radius: 5px;
        font-weight: normal!important;
        font-size: 18px!important;
        line-height: 56px!important;
        font-family: ''!important;
        color: #fff!important;
        text-align: center;
        margin: 0 49px 0 40px;
    }

    .myShoppingCartCountOfRight .myShoppingCartCountOfRightByRight a.btn-disabled {
        color: #fff!important;
        background-color: #d4d4d4!important;
    }
    /**
        我的购物车 end
     */

    /**
        空购物车页 start
     */
    .myShoppingCartOfNoCont {
        background-color: #fff;
        padding: 45px 0;
        text-align: center;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
    }

    .myShoppingCartOfNoCont a,
    .myShoppingCartOfNoCont strong {
        display: block;
    }

    .myShoppingCartOfNoCont a:first-of-type img {
        width: 210px;
        height: 213px;
    }

    .myShoppingCartOfNoCont strong {
        font-weight: bold!important;
        font-size: 18px!important;
        font-family: ''!important;
        color: #999!important;
        padding: 42px 0 26px 0;
    }

    .myShoppingCartOfNoCont a:last-of-type {
        width: 165px;
        height: 49px;
        border: 1px solid #c9c9c9;
        border-radius: 5px;
        background-color: #f7f7f7;
        font-weight: bold!important;
        font-size: 18px!important;
        line-height: 49px!important;
        font-family: ''!important;
        color: #999!important;
        text-align: center;
        margin: 0 auto;
    }
    /**
        空购物车页 end
     */
</style>
