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
            <span slot="orderConfirmationPage">商品确认页</span>
            <!-- 灵活的运用插槽 end -->
        </nav-bread>
        <!--
            NavBread end
        -->

        <!--
            订单确认页 start
        -->
        <!--
            收货信息 start
        -->
        <section class="receiptInformation commonInformation comWidth">
            <div class="receiptInformationOfTop commonInfoTitle">
                <h2>收货信息</h2>
            </div>
            <div class="receiptInformationOfCont">
                <ul class="clearfix">
                    <li
                        :class="{ 'active': receive.receiveDefaultSelectStatus, 'inActive': receive.receiveDefaultSelectStatus, 'inHover': isShow == index, 'outHover': isHide == index }"
                        :key="index"
                        v-for="(receive, index) in addressInfoListData"
                        @mouseenter="executedShow(index)"
                        @mouseleave="executedHide(index)"
                        @click="setDefaultHandler(receive.receiveId)"
                        v-if="index < limit"
                    >
                        <div class="receiptInformationOfTopInfo clearfix">
                            <strong class="fl">{{ receive.receiveName }}</strong>
                            <a
                                class="deleteAddressBtn fr"
                                @click.stop="deleteAddressConfirm(receive.receiveId)"
                            >
                                删除
                            </a>
                        </div>
                        <span>{{ receive.receivePhone }}</span>
                        <p>
                            <em>{{ receive.receiveProvince }}</em> <em>{{ receive.receiveCity }}</em> <em>{{ receive.receiveCounty }}</em><br />
                            <em>{{ receive.receiveDetailsAddress }}</em>
                        </p>
                        <div class="receiptInformationOfBtn">
                            <a
                                href="javascript:;"
                                class="setDefaultAddressBtn"
                                :class="{ 'active': receive.receiveDefaultSelectStatus }"
                                @click="setDefaultHandler(receive.receiveId)"
                            >
                                设为默认
                            </a>
                            <a
                                class="editAddressBtn"
                                href="javascript:;"
                                @click.stop="editReceiveInfoDataHandler(receive, index)"
                            >
                                编辑
                            </a>
                        </div>
                    </li>
                    <li
                        @mouseenter="addBg"
                        @mouseleave="subBg"
                        @click="addAddressPopHandler"
                    >
                        <em class="addAddressBtn">新增地址</em>
                    </li>
                </ul>
                <a
                    href="javascript:;"
                    class="lookAtMore"
                    :class="{ 'open': limit > 3 }"
                    @click="lookAtMoreHandler"
                >
                    查看更多
                </a>
            </div>
        </section>
        <!--
            收货信息 end
        -->

        <!--
            发票信息 start
        -->
        <section class="invoiceInformation commonInformation comWidth">
            <div class="invoiceInformationOfTop commonInfoTitle">
                <h2>发票信息</h2>
            </div>
            <div class="invoiceInformationOfCont">
                <ul>
                    <li class="clearfix">
                        <strong class="fl">发票类型：</strong>
                        <span class="fl">电子发票</span>
                    </li>
                    <li class="clearfix">
                        <strong class="fl">发票抬头：</strong>
                        <div class="invoicesAreRaised fl">
                            <div class="perAndComp fl">
                                <em
                                    :class="{ 'active': invoiceInfo.isPersonal }"
                                    class="fl"
                                    @click="changedInvoiceStatus(true)"
                                >
                                    个人
                                </em>
                                <em
                                    :class="{ 'active': !invoiceInfo.isPersonal }"
                                    class="fl"
                                    @click="changedInvoiceStatus(false)"
                                >
                                    单位
                                </em>
                            </div>
                            <div
                                class="companyInvoices fl"
                                v-if="!invoiceInfo.isPersonal"
                            >
                                <!--<i v-show="!invoiceInfo.name">请输入公司发票抬头</i>-->
                                <input
                                    type="text"
                                    name="invoicesAreRaisedInfo"
                                    class="fl"
                                    v-model="invoiceInfo.name"
                                    placeholder="请输入公司发票抬头"
                                />
                                <span
                                    v-show="!invoiceInfo.name"
                                    class="fl"
                                >
                                    必填
                                </span>
                            </div>
                        </div>
                    </li>
                    <li class="clearfix">
                        <strong class="fl">发票内容：</strong>
                        <span class="fl">购买商品明细</span>
                    </li>
                </ul>
                <div class="transverseLine"></div>
                <p>
                    电子发票是税务局认可的有效收付款凭证，可作为服务流程。电子发票打印后可以用于企业报销。
                </p>
            </div>
        </section>
        <!--
            发票信息 end
        -->

        <!--
            购物清单 start
        -->
        <section class="shoppingList commonInformation comWidth">
            <div class="shoppingListOfTop commonInfoTitle">
                <h2>购物清单</h2>
            </div>
            <div class="shoppingListOfCont">
                <table>
                    <thead>
                        <tr>
                            <th>商品名称</th>
                            <th>单价</th>
                            <th>数量</th>
                            <th>小计</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            :key="index"
                            v-for="(item, index) in cartListData"
                            v-if="item.isChecked"
                        >
                            <td class="clearfix">
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
                                <p>{{ item.productSubTitle }}（{{ item.productSpecJson.productShowName }}）</p>
                            </td>
                            <td>
                                {{ item.productPrice | currency('¥') }}
                            </td>
                            <td>
                                {{ item.productNumber }}
                            </td>
                            <td>
                                {{ ( item.productPrice * item.productNumber ) | currency('¥') }}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="shoppingCount clearfix">
                    <div class="fr">
                        <div class="shoppingSum clearfix">
                            <strong class="fl">商品总计：</strong>
                            <em class="fl">{{ checkedAllSumPrice | currency('¥') }}</em>
                        </div>
                        <div class="shoppingFreight clearfix">
                            <strong class="fl">运费：</strong>
                            <em class="fl">+{{ checkFreight | currency('¥') }}</em>
                        </div>
                    </div>
                </div>
                <div class="commitShoppingOrder clearfix">
                    <div class="fr">
                        <strong class="fl">应付金额：</strong>
                        <span class="fl">{{ ( checkedAllSumPrice + checkFreight ) | currency('¥') }}</span>
                        <a
                            class="fl"
                            href="javascript:;"
                            @click="submitOrderHandler"
                        >
                            提交订单
                        </a>
                    </div>
                </div>
            </div>
        </section>
        <!--
            购物清单 end
        -->
        <!--
            订单确认页 end
        -->

        <!--
            新增、编辑收获地址 start
        -->
        <common-address-pop
            v-if="controlAddressPopIsShow"
            @closeAddressPop="closeAddressPopHandler"
            @add-data="getAddressInfoData"
            @edit-data="getAddressInfoData"
            :oldReceiveInfoData="oldReceiveInfoData"
            :receiveIndex="receiveIndex"
        >
        </common-address-pop>
        <!--
            新增、编辑收获地址 end
        -->

        <!--
            小小游通用的modalPopModal start
        -->
        <common-pop-modal
            ref="mask1"
            :md-show="mdShowAddress"
            @on-close="closeModal"
        >
            <h1 slot="modal-title">
                {{ modalHeader }}
            </h1>
            <div slot="modal-message">
                您确定删除此地址吗？
            </div>
            <div slot="modal-btnGroup">
                <a href="javascript:;" @click="deleteAddress">确定</a>
                <a href="javascript:;" @click="closeModal">取消</a>
            </div>
        </common-pop-modal>
        <!--
            小小游通用的modalPopModal end
        -->

        <!--
            遮罩层 start
        -->
        <mask-layer ref="mask"></mask-layer>
        <!--
            遮罩层 end
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
    // 引入头部通用组件
    import NavHeader from './NavHeader';
    // 引入面包屑通用组件
    import NavBread from './NavBread';
    // 引入底部通用组件
    import NavFooter from './NavFooter';
    // 引入通用的新增和编辑弹框组件
    import CommonAddressPop from './CommonAddressPop';
    // 引入通用的modal模态框组件
    import CommonPopModal from './CommonPopModal';
    // 引入通用的遮罩层组件
    import MaskLayer from './MaskLayer';
    export default {
        name: 'OrderConfirmation',
        mounted () {
            // 初始化获取地址信息的方法
            this.getAddressInfoData ();
            // 初始化获取购物车列表数据的方法
            this.getCartListData ();
        },
        data () {
            return {
                // 默认只显示前三条地址数据
                limit: 3,
                // 旧的地址数据
                oldReceiveInfoData: null,
                // 每个地址对应的索引值，初始化为0
                receiveIndex: 0,
                // 获取的地址信息列表数据
                addressInfoListData: [],
                // 是否显示
                isShow: null,
                // 是否隐藏
                isHide: null,
                // 控制地址弹层是否显示
                controlAddressPopIsShow: false,
                // 全局缓存要删除的地址Id
                receiveId: '',
                // 地址删除确认的模态框标题
                modalHeader: '地址删除确认的模态框',
                // 某个地址删除确认的模态框变量，默认为false
                mdShowAddress: false,
                // 购物车列表数据
                cartListData: [],
                // 选中的所有商品总价格
                checkedAllSumPrice: 0,
                // 商品运费，默认运费为12元
                checkFreight: 12,
                // 发票信息
                invoiceInfo: {
                    // 是否是个人，默认是个人
                    isPersonal: true,
                    // 发票抬头名字，默认是空的
                    name: ''
                }
            };
        },
        methods: {
            setDefaultHandler ( receiveId ) {
                this.$http.post ( '/users/setDefaultAddress', {
                    receiveId: receiveId
                }).then ( ( response ) => {
                    let res = response.data;
                    if ( res.status == "0" ) {
                        this.addressInfoListData.forEach ( item => {
                            if ( item.receiveId === receiveId ) {
                                item.receiveDefaultSelectStatus = true;
                            } else {
                                item.receiveDefaultSelectStatus = false;
                            }
                        });
                        console.log ( 'setDefaultAddress success！' );
                        // 重新拉取一次地址列表的数据
                        // this.getAddressInfoData ();
                    }
                });
            },
            // 鼠标移入，添加背景色#f2f2f2
            executedShow ( index ) {
                this.isShow = index;
                this.isHide = null;
            },
            // 鼠标移出，去除背景色#f2f2f2
            executedHide ( index ) {
                this.isHide = index;
                this.isShow = null;
            },
            // 最后一个li的控制，添加背景色#f2f2f2
            addBg ( ev ) {
                var oEvent = ev || window.event;
                ev.target.style.backgroundColor = '#f2f2f2';
            },
            // 最后一个li的控制，去除背景色#f2f2f2
            subBg ( ev ) {
                var oEvent = ev || window.event;
                ev.target.style.backgroundColor = '#fff';
            },
            // 显示遮罩层，隐藏滚动条
            showMask () {
                this.$refs.mask.showMaskLayer ();
            },
            // 隐藏遮罩层，显示滚动条
            hideMask () {
                this.$refs.mask.hideMaskLayer ();
            },
            // 点击添加新地址按钮，显示弹窗和遮罩层，隐藏滚动条
            addAddressPopHandler () {
                // 新增之前先将旧数据清空
                this.oldReceiveInfoData = null;
                this.receiveIndex = 0;
                // 弹层显示
                this.controlAddressPopIsShow = true;
                // 遮罩层显示
                this.showMask ();
            },
            // 编辑收获地址信息数据
            editReceiveInfoDataHandler ( data, index ) {
                // 数据回传过来
                this.oldReceiveInfoData = data;
                this.receiveIndex = index;
                // 弹层显示
                this.controlAddressPopIsShow = true;
                // 遮罩层显示
                this.showMask ();
            },
            // 点击关闭按钮，隐藏弹窗和遮罩层，显示滚动条
            closeAddressPopHandler () {
                this.controlAddressPopIsShow = false;
                // 遮罩层隐藏
                this.hideMask ();
                this.addressInfoListData.forEach ( ( receive, index ) => {
                    if ( receive.receiveDefaultSelectStatus ) {
                        this.receiveIndex = index;
                    }
                });
            },
            // 点击个人和单位的发票切换
            changedInvoiceStatus ( flag ) {
                this.invoiceInfo.isPersonal = flag;
            },
            // 获取后台接口的地址列表数据
            getAddressInfoData () {
                this.$http.get ( '/users/getAddressInfoList' )
                    .then ( ( response ) => {
                        let res = response.data;
                        if ( res.status == "0" ) {
                            if ( this.limit == this.addressInfoListData.length ) {
                                this.limit = res.result.length;
                            }
                            let addressList = [];
                            res.result.forEach ( item => {
                                if ( item.receiveDefaultSelectStatus ) {
                                    addressList.unshift ( item );
                                } else {
                                    addressList.push ( item );
                                }
                            });
                            this.addressInfoListData = addressList;
                        }
                    });
            },
            // 查看更多地址
            lookAtMoreHandler () {
                if ( this.limit == 3 ) {
                    this.limit = this.addressInfoListData.length;
                } else {
                    this.limit = 3;
                }
            },
            // 根据传过来的地址receiveId来指定删除某一个地址，确定删除吗？
            deleteAddressConfirm ( receiveId ) {
                // 将receiveId全局缓存起来，等下点击确认删除要用到
                this.receiveId = receiveId;
                // 显示地址确认删除弹框
                this.mdShowAddress = true;
                // 隐藏滚动条
                this.$refs.mask1.hideScroll ();
            },
            // 根据传过来的地址receiveId来指定删除某一个地址
            deleteAddress () {
                // 显示遮罩层
                this.$http.post ( '/users/address/del', {
                    receiveId: this.receiveId
                }).then ( ( response ) => {
                    let res = response.data;
                    if ( res.status == "0" ) {
                        // 隐藏地址确认删除弹框
                        this.mdShowAddress = false;
                        // 显示遮罩层
                        this.$refs.mask1.showScroll ();
                        // 再调一次接口重新拉取数据库最新数据
                        this.getAddressInfoData ();
                    }
                });
            },
            // 获取购物车列表数据
            getCartListData () {
                this.$http.get ( '/users/cartList' )
                    .then ( ( response ) => {
                        let res = response.data;
                        if ( res.status == "0" ) {
                            this.cartListData = res.result;
                            this.cartListData.forEach ( ( item ) => {
                                if ( item.isChecked ) {
                                    this.checkedAllSumPrice += parseFloat ( item.productPrice * item.productNumber );
                                    if ( this.checkedAllSumPrice > 500 ) {
                                        this.checkFreight = 0;
                                    }
                                }
                            });
                        }
                    });
            },
            // 关闭通用的弹层方法
            closeModal () {
                this.mdShow = false;
                this.mdShowAddress = false;
                this.$refs.mask1.showScroll ();
            },
            // 点击提交订单操作
            submitOrderHandler () {
                // 如果是公司的发票并且没有填写名称，直接返回，懒得墨迹
                if ( !this.invoiceInfo.isPersonal && !this.invoiceInfo.name ) return;
                // 如果是个人的发票，写个人。公司的它填什么就是什么
                if ( this.invoiceInfo.isPersonal ) {
                    this.invoiceInfo.name = '个人';
                }

                this.addressInfoListData.forEach ( ( receive, index ) => {
                    if ( receive.receiveDefaultSelectStatus ) {
                        this.receiveIndex = index;
                    }
                });

                // 获取当前选中的这条地址信息
                let receiveInfoData = this.addressInfoListData[this.receiveIndex];
                // console.log ( `receiveInfoData: ${receiveInfoData.receiveId}` );

                /**
                 * 点击跳转到订单支付页，我们肯定要知道是哪个订单，用户购买了
                 * 哪些选中的商品随机生成一个订单号传递到我们的订单支付页
                 */
                this.$http.post ( '/users/submitOrder', {
                    checkedAllSumPrice: this.checkedAllSumPrice,
                    checkFreight: this.checkFreight,
                    invoiceName: this.invoiceInfo.name,
                    receiveInfoData: receiveInfoData
                }).then ( ( response ) => {
                    let res = response.data;
                    if ( res.status == "0" ) {
                        this.$router.push ({
                            name: 'OrderPayment',
                            query: {
                                orderId: res.result.orderId
                            }
                        });
                    }
                });
            }
        },
        // 注册局部组件
        components: {
            // 头部通用组件
            NavHeader,
            // 面包屑通用组件
            NavBread,
            // 底部通用组件
            NavFooter,
            // 通用的新增和编辑地址弹框子组件
            CommonAddressPop,
            // 通用的modal模态框组件
            CommonPopModal,
            // 通用的遮罩层组件
            MaskLayer
        }
    };
</script>

<style lang="css" rel="stylesheet/css" scoped>
    /**
        订单确认页 start
     */
    /**
        收获信息 start
    */
    .commonInformation {
        width: 1198px;
        border: 1px solid #c9c9c9;
        border-radius: 5px;
        margin-top: 20px;
    }

    .commonInfoTitle {
        height: 60px;
        border-bottom: 1px solid #c9c9c9;
        background-color: #f7f7f7;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
    }

    .commonInfoTitle h2 {
        font-weight: bold!important;
        font-size: 18px!important;
        line-height: 60px!important;
        font-family: ''!important;
        color: #444!important;
        padding: 0 0 0 30px;
        text-align: left;
    }

    .receiptInformationOfCont {
        background-color: #fff;
        padding: 30px 20px 10px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
    }

    .receiptInformationOfCont .lookAtMore {
        display: block;
        width: auto;
        height: 20px;
        font-weight: normal!important;
        font-size: 14px!important;
        font-family: ''!important;
        color: #999!important;
        background: url(./../assets/images/hide_ico.png) no-repeat 605px 7px;
        background-size: 20px 20px;
        padding: 7px 0 17px 0;
    }

    .receiptInformationOfCont .lookAtMore.open {
        background-image: url(./../assets/images/show_ico.png);
    }

    .receiptInformationOfCont li {
        float: left;
        width: 257px;
        height: 154px;
        background-color: #fff;
        border: 1px solid #c9c9c9;
        border-radius: 5px;
        margin: 0 20px 20px 0;
        padding: 0 0 0 15px;
        cursor: pointer;
        position: relative;
    }

    .receiptInformationOfCont li.inActive {
        border: 1px solid #278bdd;
    }

    .receiptInformationOfCont li.inHover {
        background-color: #f2f2f2;
    }

    .receiptInformationOfCont li.outHover {
        background-color: #fff;
    }

    .receiptInformationOfCont li.hideDefaultBtn {
        border: 1px solid #c9c9c9;
    }

    .receiptInformationOfCont li.active .receiptInformationOfBtn a:nth-of-type(1) {
         background-image: url(./../assets/images/setDefault_active_ico.png);
         color: #278bdd!important;
    }

    .receiptInformationOfCont li.hideDefaultBtn .receiptInformationOfBtn a:nth-of-type(1) {
        background-image: url(./../assets/images/setDefault_ico.png);
        color: #c9c9c9!important;
    }

    .receiptInformationOfCont li:last-of-type {
        display: block;
        font-weight: normal!important;
        font-size: 14px!important;
        line-height: 154px!important;
        font-family: ''!important;
        color: #999!important;
        background: url(./../assets/images/addressPlus_ico.png) no-repeat 75px 65px;
        background-size: 24px 24px;
        width: 164px;
        height: 154px;
        padding: 0 0 0 110px;
        text-align: left;
    }

    .receiptInformationOfCont li:nth-of-type(4n) {
        margin-right: 0;
    }

    .receiptInformationOfCont li .receiptInformationOfTopInfo strong {
        font-weight: normal!important;
        font-size: 16px!important;
        font-family: ''!important;
        color: #666!important;
        padding: 9px 0 0 0;
    }

    .receiptInformationOfCont li .receiptInformationOfTopInfo .deleteAddressBtn {
        position: absolute;
        right: 15px;
        top: 12px;
        width: auto;
        height: 16px;
        background: url(./../assets/images/del_ico.png) no-repeat left 2px;
        background-size: 14px 14px;
        font-weight: normal!important;
        font-size: 14px!important;
        font-family: ''!important;
        color: #c9c9c9!important;
        cursor: pointer;
        padding: 0 0 0 20px;
        z-index: 999;
    }

    .receiptInformationOfCont li .receiptInformationOfTopInfo .deleteAddressBtn:hover {
        background-image: url(./../assets/images/del_active_ico.png);
        color: #278bdd!important;
    }

    .receiptInformationOfCont li span {
        display: block;
        font-weight: normal!important;
        font-size: 14px!important;
        font-family: ''!important;
        color: #999!important;
        padding: 11px 0 0 0;
        text-align: left;
    }

    .receiptInformationOfCont li p {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        width: 202px;
        height: 48px;
        font-weight: normal!important;
        font-size: 14px!important;
        line-height: 24px!important;
        font-family: ''!important;
        color: #999!important;
        padding: 11px 0 0 0;
        text-align: left;
    }

    .receiptInformationOfCont li .receiptInformationOfBtn {
        padding: 5px 0 0 0;
    }

    .receiptInformationOfCont li .receiptInformationOfBtn a {
        position: absolute;
        bottom: 12px;
        width: auto;
        height: 16px;
        background: url(./../assets/images/setDefault_ico.png) no-repeat left 2px;
        background-size: 14px 14px;
        font-weight: normal!important;
        font-size: 14px!important;
        font-family: ''!important;
        color: #c9c9c9!important;
        padding: 0 0 0 20px;
        z-index: 999;
        text-align: left;
    }

    .receiptInformationOfCont li .receiptInformationOfBtn a:nth-of-type(1).active,
    .receiptInformationOfCont li .receiptInformationOfBtn a:nth-of-type(1):hover {
        background-image: url(./../assets/images/setDefault_active_ico.png);
        color: #278bdd!important;
    }

    .receiptInformationOfCont li .receiptInformationOfBtn a:nth-of-type(1) {
        left: 15px;
        background-image: url(./../assets/images/setDefault_ico.png);
    }

    .receiptInformationOfCont li .receiptInformationOfBtn a:nth-of-type(2) {
        right: 15px;
        background-image: url(./../assets/images/edit_ico.png);
    }

    .receiptInformationOfCont li .receiptInformationOfBtn a:nth-of-type(2):hover {
        background-image: url(./../assets/images/edit_active_ico.png);
        color: #278bdd!important;
    }
    /**
        收获信息 end
    */
    /**
        订单确认页 end
     */

    /**
        发票信息 start
     */
    .invoiceInformationOfTop {
        border-bottom: 1px solid #c9c9c9;
    }

    .invoiceInformationOfCont {
        background-color: #fff;
        padding: 27px 28px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
    }

    .invoiceInformationOfCont li {
        font-weight: normal!important;
        font-size: 16px!important;
        font-family: ''!important;
        color: #444!important;
    }

    .invoiceInformationOfCont li .invoicesAreRaised em {
        width: auto;
        height: 20px;
        background: url(./../assets/images/invoice_ico.png) no-repeat left top;
        background-size: 20px 20px;
        padding: 0 19px 0 28px;
        color: #666!important;
        cursor: pointer;
    }

    .invoiceInformationOfCont li .invoicesAreRaised em:last-of-type {
        padding-right: 0;
    }

    .invoiceInformationOfCont li .invoicesAreRaised em.active {
        background-image: url(./../assets/images/invoice_active_ico.png);
    }

    .invoiceInformationOfCont li:nth-of-type(2) {
        padding: 10px 0 0 0;
    }
    .invoiceInformationOfCont li .perAndComp,
    .invoiceInformationOfCont li:nth-of-type(2) strong {
        height: 40px;
        margin: 10px 0 0 0;
    }

    .invoiceInformationOfCont li .companyInvoices {
        position: relative;
    }

    .invoiceInformationOfCont li .companyInvoices input {
        width: 298px;
        height: 38px;
        border: 1px solid #c9c9c9;
        border-radius: 2px;
        background-color: #fff;
        font-weight: normal!important;
        font-size: 14px!important;
        line-height: 38px!important;
        font-family: ''!important;
        color: #333!important;
        margin: 0 0 0 10px;
        padding: 0 0 0 10px;
    }

    .invoiceInformationOfCont li .companyInvoices span {
        position: absolute;
        right: 11px;
        top: 8px;
        width: 46px;
        height: 24px;
        font-weight: normal!important;
        font-size: 14px!important;
        line-height: 24px!important;
        font-family: ''!important;
        color: #fff!important;
        background-color: #ff1e41;
        text-align: center;
        border-radius: 1px;
    }

    .invoiceInformationOfCont .transverseLine {
        width: 100%;
        height: 1px;
        background-color: #dedede;
        margin: 24px 0;
        overflow: hidden;
        font-size: 0;
    }

    .invoiceInformationOfCont p {
        font-weight: normal!important;
        font-size: 14px!important;
        font-family: ''!important;
        color: #666!important;
        text-align: left;
    }
    /**
        发票信息 end
     */

    /**
        购物清单 start
     */
    .shoppingList {
        border: 1px solid #c9c9c9;
    }

    .shoppingListOfCont thead {
        display: inline-block;
        width: 1140px;
        height: 40px;
        font-weight: normal!important;
        font-size: 14px!important;
        line-height: 40px!important;
        font-family: ''!important;
        color: #666!important;
        background-color: #eee;
        border-bottom: 1px solid #c9c9c9;
        padding: 0 28px 0 30px;
    }

    .shoppingListOfCont thead th:nth-of-type(1) {
        width: 711px;
        text-align: left;
    }

    .shoppingListOfCont thead th:nth-of-type(3) {
        width: 152px;
    }

    .shoppingListOfCont thead th:nth-of-type(2),
    .shoppingListOfCont thead th:nth-of-type(4) {
        width: 153px;
    }

    .shoppingListOfCont tbody {
        display: inline-block;
        width: 1198px;
        background-color: #fff;
    }

    .shoppingListOfCont tbody tr {
        display: inline-block;
        padding: 18px 30px;
        border-bottom: 1px solid #c9c9c9;
    }

    .shoppingListOfCont tbody td {
        text-align: center;
    }

    .shoppingListOfCont tbody td:nth-of-type(1) {
        width: 711px;
    }

    .shoppingListOfCont tbody td:nth-of-type(1) a {
        float: left;
        border: 1px solid #c9c9c9;
        padding: 6px 18px;
    }

    .shoppingListOfCont tbody td:nth-of-type(1) img {
        float: left;
        width: 24px;
        height: 50px;
    }

    .shoppingListOfCont tbody td:nth-of-type(1) p {
        float: left;
        width: 609px;
        padding: 0 0 0 30px;
        font-weight: bold!important;
        font-size: 16px!important;
        line-height: 64px!important;
        font-family: ''!important;
        color: #333!important;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        text-align: left;
    }

    .shoppingListOfCont tbody td:nth-of-type(3) {
        width: 152px;
    }

    .shoppingListOfCont tbody td:nth-of-type(2),
    .shoppingListOfCont tbody td:nth-of-type(4) {
        width: 160px;
    }

    .shoppingCount,
    .commitShoppingOrder {
        height: 110px;
        background-color: #fff;
    }

    .shoppingCount {
        height: 82px;
        border-bottom: 1px solid #c9c9c9;
        padding: 28px 70px 0 0;
    }

    .shoppingCount .shoppingSum strong,
    .shoppingCount .shoppingSum em {
        font-weight: normal!important;
        font-size: 16px!important;
        font-family: ''!important;
        color: #333!important;
    }

    .shoppingCount .shoppingSum strong {
        padding: 0 105px 0 0;
    }

    .shoppingCount .shoppingFreight {
        padding: 9px 0 0 0;
    }

    .shoppingCount .shoppingFreight strong {
        padding: 0 110px 0 30px;
    }

    .commitShoppingOrder {
        height: 83px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        padding: 27px 70px 0 0;
    }

    .commitShoppingOrder strong {
        font-weight: normal!important;
        font-size: 16px!important;
        font-family: ''!important;
        color: #333!important;
        padding: 17px 3px 0 0;
    }

    .commitShoppingOrder span {
        font-weight: bold!important;
        font-size: 18px!important;
        font-family: ''!important;
        color: #da4d00!important;
        padding: 17px 39px 0 0;
    }

    .commitShoppingOrder a {
        width: 172px;
        height: 56px;
        background-color: #278bdd;
        font-weight: normal!important;
        font-size: 16px!important;
        line-height: 56px!important;
        font-family: ''!important;
        color: #fff!important;
        border-radius: 3px;
        text-align: center;
    }
    /**
        购物清单 end
     */
</style>
