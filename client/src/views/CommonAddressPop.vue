<template>
    <!--
        新增和编辑公用的收货地址弹框 start
    -->
    <div class="newReceivingAddressBox">
        <h1>管理收货地址</h1>
        <em class="closePop" @click="closeAddAddressPop"></em>
        <form action="" method="get">
            <div class="itemBox">
                <input
                    type="text"
                    name="addressee"
                    class="addressee"
                    placeholder="收件人"
                    v-model="receiveInfoData.receiveName"
                    @blur="validatorAddressee"
                    @focus="setValidatorAddressee"
                />
                <span
                    :class="{ 'validatorError': validatorAddresseeError }"
                >
                    收件人格式错误
                </span>
            </div>
            <div class="itemBox">
                <input
                    type="text"
                    name="cellPhoneNumber"
                    class="cellPhoneNumber"
                    placeholder="手机号"
                    v-model="receiveInfoData.receivePhone"
                    @blur="validatorCellPhoneNumber"
                    @focus="setValidatorCellPhoneNumber"
                />
                <span
                    :class="{ 'validatorError': validatorCellPhoneNumberError }"
                >
                    手机格式错误
                </span>
            </div>
            <div class="item-box clearfix">
                <div class="itemBox fl">
                    <input
                        type="text"
                        class="areaCode fl"
                        name="areaCode"
                        placeholder="区号（可选）"
                        v-model="receiveInfoData.receiveAreaCode"
                    />
                </div>
                <div class="itemBox fr">
                    <input
                        type="text"
                        class="fixedTelephone fr"
                        name="fixedTelephone"
                        placeholder="固定电话（可选）"
                        v-model="receiveInfoData.receiveSeatNumber"
                    />
                </div>
            </div>
            <div id="wrap">
                <div class="itemBox itemSelectProvince" id="provinces">
                    <!-- v-model="receiveInfoData.receiveProvinceId" -->
                    <select
                        name="selectProvince"
                        class="selectProvince commonSelectBox"
                        v-model="receiveInfoData.receiveProvinceId"
                        @change="watchProvinceChange"
                    >
                        <option value="0">请选择省份</option>
                        <option
                            :value="province.area_id"
                            :key="index"
                            v-for="(province, index) in proCityAreaListDataInfo"
                        >
                            {{ province.area_name }}
                        </option>
                    </select>
                </div>
                <div class="itemCommonSel clearfix">
                    <div class="itemBox itemSelectCity fl" id="citys">
                        <!-- v-model="receiveInfoData.receiveCityId" -->
                        <select
                            name="selectCity"
                            class="commonSelectBox commonSelectText"
                            v-model="receiveInfoData.receiveCityId"
                            @change="watchCityChange"
                        >
                            <option value="0">请选择城市</option>
                            <option
                                :value="city.area_id"
                                :key="index"
                                v-for="(city, index) in cityListData"
                            >
                                {{ city.area_name }}
                            </option>
                        </select>
                    </div>
                    <div class="itemBox itemSelectArea fr" id="areas">
                        <!-- v-model="receiveInfoData.receiveCountyId" -->
                        <select
                            name="selectCounty"
                            class="commonSelectBox commonSelectText"
                            v-model="receiveInfoData.receiveCountyId"
                        >
                            <option value="0">请选择区县</option>
                            <option
                                :value="county.area_id"
                                :key="index"
                                v-for="(county, index) in countyListData"
                            >
                                {{ county.area_name }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="itemBox">
                <input
                    type="text"
                    name="detailsAddress"
                    class="detailsAddress"
                    placeholder="详细地址，如街道名称，楼层，门牌号等"
                    v-model="receiveInfoData.receiveDetailsAddress"
                    @blur="validatorDetailsAddress"
                    @focus="setValidatorDetailsAddress"
                />
                <span
                    :class="{ 'validatorError': validatorDetailsAddressError }"
                >
                    详细地址格式错误
                </span>
            </div>
            <a
                href="javascript:;"
                class="setDefaultBtn"
                :class="{ 'active': receiveInfoData.receiveDefaultSelectStatus }"
                @click="checkedDefaultSelectStatus"
            >
                设为默认
            </a>
            <!--
                'disabled-btn': !isCorrect的意思表示当输入的信息不正确的时候，
                按钮为禁用，不可点击。只有当输入正确的时候，按钮才能被激活，从而
                去做提交表单等相关事宜。
             -->
            <a
                href="javascript:;"
                class="saveBtn"
                :class="{ 'disabled-btn': !isCorrect }"
                @click="submitReceiveInfoDataHandler"
            >
                保存
            </a>
        </form>
    </div>
    <!--
        新增和编辑公用的收货地址弹框 end
    -->
</template>

<script type="text/ecmascript-6">
    export default {
        name: 'CommonAddressPop',
        created () {
            if ( this.oldReceiveInfoData ) {
                let province = [];
                let city = [];
                // 如果province的area_id已经和我们选中的这个省id相等，就让名字也赋上值
                if ( this.receiveInfoData.receiveProvinceId != 0 ) {
                    province = this.proCityAreaListDataInfo.filter ( ( receiveProvince ) => {
                        return receiveProvince.area_id == this.oldReceiveInfoData.receiveProvinceId;
                    })[0];
                    this.receiveInfoData.receiveProvince = province.area_name;
                }

                // 如果city的area_id已经和我们选中的这个市id相等，就让名字也赋上值
                if ( this.receiveInfoData.receiveCityId != 0 ) {
                    this.cityList = province.city_list;
                    city = this.cityList.filter ( ( receiveCity ) => {
                        return receiveCity.area_id == this.oldReceiveInfoData.receiveCityId;
                    })[0];
                    this.receiveInfoData.receiveCity = city.area_name;
                    this.countyList = city.county_list;
                }
                this.receiveInfoData = JSON.parse ( JSON.stringify ( this.oldReceiveInfoData ) );
            }
        },
        mounted () {
            // 初始化拿到省市区的数据
            this.proCityAreaListData ();
        },
        // 注意从父级接收过来的数据，记得最好验证下其类型
        props: {
            'oldReceiveInfoData': {
                type: Object
            },
            'receiveIndex': {
                type: Number
            }
        },
        data () {
            return {
                // 接收地址信息数据变量
                receiveInfoData: {
                    'receiveId': '',
                    'receiveName': '',
                    'receivePhone': '',
                    'receiveAreaCode': '',
                    'receiveSeatNumber': '',
                    'receiveProvinceId': 0,
                    'receiveProvince': '',
                    'receiveCityId': 0,
                    'receiveCity': '',
                    'receiveCountyId': 0,
                    'receiveCounty': '',
                    'receiveDetailsAddress': '',
                    'receiveDefaultSelectStatus': false,
                    'isHide': true
                },
                // 验证收件人变量，默认为false(不显示)
                validatorAddresseeError: false,
                // 验证手机号码变量，默认为false(不显示)
                validatorCellPhoneNumberError: false,
                // 验证详细地址变量，默认为false(不显示)
                validatorDetailsAddressError: false,
                // 验证表单输入的值是否都正确的变量，false为显示不正确
                isCorrect: false,
                // 省市区下拉联动数据
                proCityAreaListDataInfo: []
            };
        },
        // 监控操作
        watch: {
            'receiveInfoData.receiveCountyId' () {
                this.countyListData.forEach ( ( county ) => {
                    // 如果county的area_id已经和我们选中的这个区县id相等，就让名字也赋上值
                    if ( county.area_id == this.receiveInfoData.receiveCountyId ) {
                        this.receiveInfoData.receiveCounty = county.area_name;
                        return;
                    }
                    console.log ( '~~~~~~~~~~~~区县变化~~~~~~~~~~' );
                });
            },
            // 深度监控每一个新增收获地址弹框里面的所有属性发生变化的时候
            'receiveInfoData': {
                handler () {
                    // 调用验证方法即可
                    this.validatorReceiveInfo ();
                },
                // 开启深度监控，只要对象当中有一个属性发生变化，就进行监测
                deep: true
            }
        },
        computed: {
            // 通过省数据拿到市数据
            cityListData () {
                let cityListData = [];
                this.proCityAreaListDataInfo.forEach ( ( province ) => {
                    if ( province.area_id == this.receiveInfoData.receiveProvinceId ) {
                        this.receiveInfoData.receiveProvince = province.area_name;
                        cityListData = province.city_list;
                        return;
                    }
                    console.log ( '看看点击对应省是否拿到了对应的市' );
                });
                // 当用户没有选择省的时候，将市和区恢复默认没有选择
                if ( this.receiveInfoData.receiveProvinceId == '0' ) {
                    this.receiveInfoData.receiveCityId = '0';
                    this.receiveInfoData.receiveCountyId = '0';
                }
                return cityListData;
            },
            // 通过市数据拿到区数据
            countyListData () {
                let countyListData = [];
                this.cityListData.forEach ( ( city ) => {
                    if ( city.area_id == this.receiveInfoData.receiveCityId ) {
                        this.receiveInfoData.receiveCity = city.area_name;
                        countyListData = city.county_list;
                        return;
                    }
                    console.log ( '看看点击对应市是否拿到了对应的区' );
                });
                // 当用户没有选择市的时候，将区恢复默认没有选择
                if ( this.receiveInfoData.receiveCityId == '0' ) {
                    this.receiveInfoData.receiveCountyId = '0';
                }
                return countyListData;
            }
        },
        methods: {
            // 关闭新增收获地址弹框，通过发布订阅模式$emit告知父级即可
            closeAddAddressPop () {
                this.$emit ( 'closeAddressPop' );
            },
            // 验证收件人
            validatorAddressee ( ev ) {
                var oEvent = ev || window.event;
                // 如果输入的是中文、英文、字母、下划线，那么显示正确，否则显示错误的提示
                var chineseRe = /^[\u4E00-\u9FA5A-Za-z_]+$/;
                if ( chineseRe.test ( this.receiveInfoData.receiveName ) ) {
                    this.validatorAddresseeError = false;
                    oEvent.target.style.border = '1px solid #e5e5e5';
                } else {
                    this.validatorAddresseeError = true;
                    oEvent.target.style.border = '1px solid #c97671';
                }
            },
            setValidatorAddressee ( ev ) {
                var oEvent = ev || window.event;
                this.validatorAddresseeError = false;
                oEvent.target.style.border = '1px solid #278bdd';
            },
            // 验证手机号码
            validatorCellPhoneNumber ( ev ) {
                var oEvent = ev || window.event;
                var phoneRe = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
                if ( phoneRe.test ( this.receiveInfoData.receivePhone ) ) {
                    this.validatorCellPhoneNumberError = false;
                    oEvent.target.style.border = '1px solid #e5e5e5';
                } else {
                    this.validatorCellPhoneNumberError = true;
                    oEvent.target.style.border = '1px solid #c97671';
                }
            },
            setValidatorCellPhoneNumber ( ev ) {
                var oEvent = ev || window.event;
                this.validatorCellPhoneNumberError = false;
                oEvent.target.style.border = '1px solid #278bdd';
            },
            // 验证详细地址，中文、英文、数字包括下划线
            validatorDetailsAddress ( ev ) {
                var oEvent = ev || window.event;
                var detailsAddressRe = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/;
                if ( detailsAddressRe.test ( this.receiveInfoData.receiveDetailsAddress ) ) {
                    this.validatorDetailsAddressError = false;
                    oEvent.target.style.border = '1px solid #e5e5e5';
                } else {
                    this.validatorDetailsAddressError = true;
                    oEvent.target.style.border = '1px solid #c97671';
                }
            },
            setValidatorDetailsAddress ( ev ) {
                var oEvent = ev || window.event;
                this.validatorDetailsAddressError = false;
                oEvent.target.style.border = '1px solid #278bdd';
            },
            // 监控省变化
            watchProvinceChange () {
                this.receiveInfoData.receiveCityId = '0';
                this.receiveInfoData.receiveCountyId = '0';
            },
            // 监控市变化
            watchCityChange () {
                this.receiveInfoData.receiveCountyId = '0';
            },
            // 设为默认按钮的状态
            checkedDefaultSelectStatus () {
                this.receiveInfoData.receiveDefaultSelectStatus = !this.receiveInfoData.receiveDefaultSelectStatus;
            },
            // 验证表单字段输入是否都已经OK
            validatorReceiveInfo () {
                // 如果输入的是中文、英文、下划线，那么显示正确，否则显示错误的提示
                var chineseRe = /^[\u4E00-\u9FA5A-Za-z_]+$/;
                var phoneRe = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
                var detailsAddressRe = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/;
                if ( chineseRe.test ( this.receiveInfoData.receiveName ) &&
                    phoneRe.test ( this.receiveInfoData.receivePhone ) &&
                    this.receiveInfoData.receiveProvince &&
                    this.receiveInfoData.receiveCity &&
                    this.receiveInfoData.receiveCounty &&
                    detailsAddressRe.test ( this.receiveInfoData.receiveDetailsAddress ) ) {
                    // 验证通过
                    console.log ( '恭喜，您已通过验证！' );
                    this.isCorrect = true;
                } else {
                    // 验证不通过
                    console.log ( '抱歉，您不通过验证！' );
                    this.isCorrect = false;
                }
            },
            // 提交表单，保存数据
            submitReceiveInfoDataHandler () {
                if ( this.isCorrect ) {
                    if ( !this.oldReceiveInfoData ) {
                        this.$http.post ( '/users/saveHarvestAddress', {
                            receiveInfoData: this.receiveInfoData
                        }).then ( ( response ) => {
                            let res = response.data;
                            if ( res.status == "0" ) {
                                console.log ( '恭喜，地址保存成功！' );
                                // 重新调用下地址列表数据查询接口拉取最新数据
                                this.$emit ( 'add-data' );
                                // 数据保存成功后，关闭添加收获地址的弹框
                                this.closeAddAddressPop ();
                                // this.$store.commit ( 'submitReceiveInfoData', [this.receiveInfoData, this.oldReceiveInfoData]);
                            }
                        }).catch ( ( err ) => {
                            console.log ( `error: ${err}` );
                        });
                    } else {
                        this.$http.post ( '/users/editHarvestAddress', {
                            receiveInfoData: this.receiveInfoData
                        }).then ( ( response ) => {
                            let res = response.data;
                            if ( res.status == "0" ) {
                                console.log ( '恭喜，地址编辑成功！' );
                                // 重新调用下地址列表数据查询接口拉取最新数据
                                this.$emit ( 'edit-data' );
                                // 数据编辑成功后，关闭编辑收获地址的弹框
                                this.closeAddAddressPop ();
                                // this.$store.commit ( 'submitReceiveInfoData', [this.receiveInfoData, this.receiveIndex]);
                            }
                        }).catch ( ( err ) => {
                            console.log ( `error: ${err}` );
                        });
                    }
                }
            },
            // 调用省市区接口数据
            proCityAreaListData () {
                this.$http.get ( '/pcas/proCityAreaListData' )
                    .then ( ( response ) => {
                        let res = response.data;
                        this.proCityAreaListDataInfo = res.proCityAreaListDataResult;
                        console.log ( this.proCityAreaListDataInfo );
                    }).catch ( ( err ) => {
                        console.log ( `error: ${err}` );
                    });
            }
        }
    };
</script>

<style lang="css" rel="stylesheet/css" scoped>
    /**
        新增和编辑公用的收货地址弹框 start
     */
    .newReceivingAddressBox {
        _position: absolute;
        position: fixed;
        left: 50%;
        top: 50%;
        width: 384px;
        height: 510px;
        background-color: #fff;
        border-radius: 5px;
        margin: -258px 0 0 -192px;
        z-index: 99999999;
    }

    .newReceivingAddressBox h1 {
        font-weight: bold!important;
        font-size: 18px!important;
        line-height: 56px!important;
        font-family: ''!important;
        color: #444!important;
        text-align: center;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        background-color: #e1e1e1;
        border-bottom: 1px solid #c7c7c7;
    }

    .newReceivingAddressBox .closePop {
        position: absolute;
        right: 20px;
        top: 20px;
        width: 18px;
        height: 18px;
        background: url(./../assets/images/closePop_ico.png) no-repeat;
        background-size: 18px 18px;
        cursor: pointer;
    }

    .newReceivingAddressBox form {
        padding: 20px 27px;
    }

    .newReceivingAddressBox .itemBox {
        position: relative;
    }

    .newReceivingAddressBox .itemBox:nth-of-type(1) span,
    .newReceivingAddressBox .itemBox:nth-of-type(2) span,
    .newReceivingAddressBox .itemBox:nth-of-type(5) span {
        position: absolute;
        right: 10px;
        top: 6px;
        padding: 0 10px;
        height: 30px;
        border-radius: 5px;
        background-color: #c97671;
        font-weight: normal!important;
        font-size: 14px!important;
        line-height: 30px!important;
        font-family: ''!important;
        color: #fff!important;
        text-align: center;
        visibility: hidden;
    }

    .newReceivingAddressBox .itemBox:nth-of-type(1) .validatorError,
    .newReceivingAddressBox .itemBox:nth-of-type(2) .validatorError,
    .newReceivingAddressBox .itemBox:nth-of-type(5) .validatorError {
        visibility: visible;
    }

    .newReceivingAddressBox input {
        width: 308px;
        height: 40px;
        border: 1px solid #e5e5e5;
        border-radius: 5px;
        font-weight: normal!important;
        font-size: 14px!important;
        line-height: 40px!important;
        font-family: ''!important;
        color: #333!important;
        margin: 0 0 15px 0;
        padding: 0 0 0 20px;
    }

    .newReceivingAddressBox input:focus {
        border: 1px solid #278bdd;
    }

    .newReceivingAddressBox .areaCode {
        width: 106px;
    }

    .newReceivingAddressBox .fixedTelephone {
        width: 168px;
    }

    .newReceivingAddressBox .selectProvince {
        width: 330px;
        height: 42px;
        background-color: #fff;
        border-radius: 5px;
        border: 1px solid #e5e5e5;
        font-weight: normal!important;
        font-size: 14px!important;
        line-height: 40px!important;
        font-family: ''!important;
        color: #666!important;
        padding: 0 0 0 20px;
    }

    .newReceivingAddressBox .commonSelectText {
        width: 150px;
        height: 42px;
        border: 1px solid #e5e5e5;
        border-radius: 5px;
        background-color: #fff;
        font-weight: normal!important;
        font-size: 14px!important;
        line-height: 40px!important;
        font-family: ''!important;
        color: #666!important;
        padding: 0 0 0 20px;
    }

    .newReceivingAddressBox .itemCommonSel {
        padding: 15px 0;
    }

    .newReceivingAddressBox .setDefaultBtn {
        display: block;
        width: auto;
        height: 17px;
        background: url(./../assets/images/setDefault_ico.png) no-repeat left 3px;
        background-size: 14px 14px;
        font-weight: normal!important;
        font-size: 14px!important;
        font-family: ''!important;
        color: #666!important;
        padding: 0 0 0 20px;
        text-align: left;
        margin: -2px 0 0 0;
    }

    .newReceivingAddressBox .setDefaultBtn.active {
        background-image: url(./../assets/images/setDefault_active_ico.png);
    }

    .newReceivingAddressBox .saveBtn.disabled-btn {
        filter: alpha(opacity = 50);
        opacity: 0.5;
        cursor: not-allowed;
        -webkit-transition: none;
        transition: none;
        pointer-events: none;
    }

    .newReceivingAddressBox .saveBtn {
        display: block;
        width: 330px;
        height: 42px;
        border-radius: 5px;
        background-color: #2585d3;
        font-weight: normal!important;
        font-size: 18px!important;
        line-height: 42px!important;
        font-family: ''!important;
        color: #fff!important;
        text-align: center;
        margin: 15px 0 0 0;
    }
    /**
        新增和编辑公用的收货地址弹框 end
     */

    /** 使用webkit内核的浏览器 */
    ::-webkit-input-placeholder {
        color: #d0d6d9;
    }

    /** Firefox版本4-18 */
    :-moz-placeholder {
        color: #d0d6d9;
    }

    /** Firefox版本19+ */
    ::-moz-placeholder {
        color: #d0d6d9;
    }

    /** IE浏览器 */
    :-ms-input-placeholder {
        color: #d0d6d9;
    }
</style>
