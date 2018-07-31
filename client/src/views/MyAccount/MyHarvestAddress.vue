<template>
    <div>
        <div class="myOrderRightOfReceivingAddress commonInfo fr">
            <div class="myOrderRightOfReceivingAddressByTop clearfix">
                <h1 class="fl">收货信息</h1>
                <a
                    class="addReceivingAddress fr"
                    href="javascript:;"
                    @click="addAddAddressPopHandler"
                >
                    添加收货地址
                </a>
            </div>

            <!--
                无收货地址的提示 start
            -->
            <div
                v-if="addressInfoListData.length == 0"
                class="myOrderRightOfReceivingAddressByNoCoreCont"
            >
                <strong>
                    您的收货地址为空，请点击右上方添加收货地址吧！
                </strong>
            </div>
            <!--
                无收货地址的提示 end
            -->

            <!--
                有收货地址的提示 start
            -->
            <div
                v-else
                class="myOrderRightOfReceivingAddressByCoreCont"
            >
                <div class="myOrderRightOfReceivingAddressByCoreContTitle">
                    <strong>收件人</strong>
                    <strong>收件地址</strong>
                    <strong>联系电话</strong>
                    <strong>是否默认</strong>
                    <strong>操作</strong>
                </div>

                <div class="myOrderRightOfReceivingAddressByCoreContCont">
                    <ul>
                        <li
                            class="clearfix"
                            :key="index"
                            v-for="(receive, index) in addressInfoListData"
                            @mouseenter="executedShow(index)"
                            @mouseleave="executedHide(index)"
                        >
                            <strong>{{ receive.receiveName }}</strong>
                            <strong><em>{{ receive.receiveProvince }}</em> <em>{{ receive.receiveCity }}</em> <em>{{ receive.receiveCounty }}</em> <em>{{ receive.receiveDetailsAddress }}</em></strong>
                            <strong>{{ receive.receivePhone }}</strong>
                            <strong class="defaultAddr">
                                <span
                                    v-if="receive.receiveDefaultSelectStatus"
                                >
                                    （默认地址）
                                </span>
                                <a
                                    v-else
                                    :class="{ 'hideDefaultBtn': receive.isHide }"
                                    class="defaultAddress"
                                    href="javascript:;"
                                    @click="checkedDefaultHandler(receive.receiveId)"
                                >
                                    设为默认
                                </a>
                            </strong>
                            <strong class="operatorBtn">
                                <a
                                    class="editOperator"
                                    href="javascript:;"
                                    @click="editReceiveInfoDataHandler(receive, index)"
                                >
                                </a>
                                <a
                                    class="delOperator"
                                    href="javascript:;"
                                    @click="deleteAddressConfirm(receive.receiveId)"
                                >
                                </a>
                            </strong>
                        </li>
                    </ul>
                </div>
            </div>
            <!--
                有收货地址的提示 end
            -->
        </div>

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
            遮罩层 start
        -->
    </div>
</template>

<script type="text/ecmascript-6">
    // 引入通用的modal模态框组件
    import CommonPopModal from './../CommonPopModal';
    // 引入通用的新增和编辑的弹框组件
    import CommonAddressPop from '../CommonAddressPop';
    // 引入遮罩层组件
    import MaskLayer from './../MaskLayer';
    export default {
        name: 'MyHarvestAddress',
        mounted () {
            // 初始化获取地址信息的方法
            this.getAddressInfoData ();
        },
        data () {
            return {
                // 地址索引值
                receiveIndex: 0,
                // 地址信息数据
                addressInfoListData: [],
                // 旧地址信息数据
                oldReceiveInfoData: null,
                // 控制地址弹框是否显示
                controlAddressPopIsShow: false,
                // 默认设为默认是隐藏的，鼠标移入控制其显示
                isHide: true,
                // 地址删除确认的模态框标题
                modalHeader: '地址删除确认的模态框',
                // 某个地址删除确认的模态框变量，默认为false
                mdShowAddress: false
            };
        },
        methods: {
            // 显示遮罩层，隐藏滚动条
            showMask () {
                this.$refs.mask.showMaskLayer ();
            },
            // 隐藏遮罩层，显示滚动条
            hideMask () {
                this.$refs.mask.hideMaskLayer ();
            },
            // 点击添加新地址按钮，显示弹窗和遮罩层，隐藏滚动条
            addAddAddressPopHandler () {
                this.oldReceiveInfoData = null;
                this.receiveIndex = 0;
                this.controlAddressPopIsShow = true;
                this.showMask ();
            },
            // 编辑收获地址信息数据
            editReceiveInfoDataHandler ( data, index ) {
                this.oldReceiveInfoData = data;
                this.receiveIndex = index;
                this.controlAddressPopIsShow = true;
                this.showMask ();
            },
            // 点击关闭按钮，隐藏弹窗和遮罩层，显示滚动条
            closeAddressPopHandler () {
                this.controlAddressPopIsShow = false;
                this.hideMask ();
                this.addressInfoListData.forEach ( ( receive, index ) => {
                    if ( receive.receiveDefaultSelectStatus ) {
                        this.receiveIndex = index;
                    }
                });
            },
            // 鼠标移入执行显示
            executedShow ( index ) {
                this.addressInfoListData[index].isHide = false;
            },
            // 鼠标移出执行隐藏
            executedHide ( index ) {
                this.addressInfoListData[index].isHide = true;
            },
            // 获取后台接口的地址列表数据
            getAddressInfoData () {
                this.$http.get ( '/users/getAddressInfoList' )
                    .then ( ( response ) => {
                        let res = response.data;
                        if ( res.status == "0" ) {
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
            // 关闭通用的弹层方法
            closeModal () {
                this.mdShow = false;
                this.mdShowAddress = false;
                this.$refs.mask1.showScroll ();
            },
            // 设置默认
            checkedDefaultHandler ( receiveId ) {
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
            }
        },
        // 注册局部组件
        components: {
            // 遮罩层组件
            MaskLayer,
            // 通用的新增和编辑的弹框组件
            CommonAddressPop,
            // 通用的modal模态框组件
            CommonPopModal
        }
    };
</script>

<style lang="css" rel="stylesheet/css" scoped>
    /**
        收货地址 start
     */
    .myOrderRightOfReceivingAddress {
        width: 978px;
        border-radius: 5px;
        background-color: #fff;
    }

    .myOrderRightOfReceivingAddress .myOrderRightOfReceivingAddressByTop {
        height: 60px;
        background-color: #f7f7f7;
        border: 1px solid #c9c9c9;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
    }

    .myOrderRightOfReceivingAddressByTop h1 {
        font-weight: bold!important;
        font-size: 18px!important;
        line-height: 61px!important;
        font-family: ''!important;
        color: #444!important;
        padding: 0 0 0 30px;
    }

    .myOrderRightOfReceivingAddressByTop a {
        width: 112px;
        height: 46px;
        background: #a2a2a2 url(./../../assets/images/receivingAddr_add_ico_16*16.png) no-repeat 12px center;
        border-radius: 5px;
        font-weight: normal!important;
        font-size: 16px!important;
        line-height: 46px!important;
        font-family: ''!important;
        color: #fff!important;
        padding: 0 0 0 36px;
        margin: 7px 30px 0 0;
    }

    /**
        有收货地址的提示 start
     */
    .myOrderRightOfReceivingAddressByCoreCont .myOrderRightOfReceivingAddressByCoreContTitle {
        height: 36px;
        line-height: 36px;
        border: 1px solid #c9c9c9;
        border-top: 0 none;
        background-color: #eee;
    }

    .myOrderRightOfReceivingAddressByCoreContTitle strong {
        display: inline-block;
        font-weight: normal!important;
        font-size: 14px!important;
        line-height: 36px!important;
        font-family: ''!important;
        color: #666!important;
        text-align: center;
    }

    .myOrderRightOfReceivingAddressByCoreContTitle strong:nth-of-type(1),
    .myOrderRightOfReceivingAddressByCoreContCont strong:nth-of-type(1) {
        width: 104px;
    }

    .myOrderRightOfReceivingAddressByCoreContTitle strong:nth-of-type(2),
    .myOrderRightOfReceivingAddressByCoreContCont strong:nth-of-type(2) {
        width: 487px;
    }

    .myOrderRightOfReceivingAddressByCoreContTitle strong:nth-of-type(3),
    .myOrderRightOfReceivingAddressByCoreContCont strong:nth-of-type(3) {
        width: 136px;
    }

    .myOrderRightOfReceivingAddressByCoreContTitle strong:nth-of-type(4) {
        width: 112px;
    }

    .myOrderRightOfReceivingAddressByCoreContTitle strong:nth-of-type(5) {
        width: 118px;
    }

    .myOrderRightOfReceivingAddressByCoreCont .myOrderRightOfReceivingAddressByCoreContCont {
        border-radius: 5px;
        border: 1px solid #c9c9c9;
        border-top: 0 none;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
    }

    .myOrderRightOfReceivingAddressByCoreContCont li {
        padding: 40px 0;
        background-color: #fff;
        border-bottom: 1px solid #c9c9c9;
        position: relative;
    }

    .myOrderRightOfReceivingAddressByCoreContCont li:last-of-type {
        border-bottom: 0 none;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
    }

    .myOrderRightOfReceivingAddressByCoreContCont .defaultAddr {
        font-weight: bold!important;
        font-size: 14px!important;
        line-height: 36px!important;
        font-family: ''!important;
        color: #333!important;
    }

    .myOrderRightOfReceivingAddressByCoreContCont .defaultAddr a,
    .myOrderRightOfReceivingAddressByCoreContCont .defaultAddr span {
        width: 112px;
        position: absolute;
        right: 122px;
        top: 40px;
    }

    .myOrderRightOfReceivingAddressByCoreContCont .defaultAddr .defaultAddress {
        font-weight: bold!important;
        font-size: 14px!important;
        line-height: 36px!important;
        font-family: ''!important;
        color: #278bdd!important;
    }

    .myOrderRightOfReceivingAddressByCoreContCont .defaultAddr .showDefaultBtn {
        visibility: visible;
    }

    .myOrderRightOfReceivingAddressByCoreContCont .defaultAddr .hideDefaultBtn {
        visibility: hidden;
    }

    .myOrderRightOfReceivingAddressByCoreContCont .defaultAddr .defaultAddress:hover {
        text-decoration: underline;
    }

    .myOrderRightOfReceivingAddressByCoreContCont li strong {
        font-weight: normal!important;
        font-size: 14px!important;
        line-height: 36px!important;
        font-family: ''!important;
        color: #666!important;
        text-align: center;
        float: left;
    }

    .myOrderRightOfReceivingAddressByCoreContCont li .operatorBtn {
        position: absolute;
        right: 0;
        top: 39px;
        width: 118px;
        text-align: center;
        margin: 4px 0 0 0;
        vertical-align: middle;
    }

    .myOrderRightOfReceivingAddressByCoreContCont li .operatorBtn a {
        display: inline-block;
        width: 26px;
        height: 26px;
        background: url(./../../assets/images/receivingAddr_edit_ico_26-26.png) no-repeat;
        background-size: 26px 26px;
    }

    .myOrderRightOfReceivingAddressByCoreContCont li .operatorBtn a:first-of-type {
        padding: 0 0 0 10px;
    }

    .myOrderRightOfReceivingAddressByCoreContCont li .operatorBtn a:last-of-type {
        background-image: url(./../../assets/images/receivingAddr_del_ico_26-26.png);
    }
    /**
        有收货地址的提示 end
     */

    /**
        无收货地址的提示 start
     */
    .myOrderRightOfReceivingAddressByNoCoreCont {
        background-color: #fff;
        padding: 45px 0;
        text-align: center;
        border: 1px solid #c9c9c9;
        border-top: 0 none;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
    }

    .myOrderRightOfReceivingAddressByNoCoreCont strong {
        font-weight: bold!important;
        font-size: 18px!important;
        font-family: ''!important;
        color: #666!important;
    }
    /**
        无收货地址的提示 end
     */
    /**
        收货地址 end
     */
</style>
