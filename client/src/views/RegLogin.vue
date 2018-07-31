<template>
    <div>
        <!--
            注册和登录 start
        -->
        <div class="regAndLogin">
            <div class="regAndLoginTitle clearfix" :class="{ 'isHidden': user }">
                <a class="fl" href="javascript:;" @click="openLoginAndRegPop(1)">注册</a>
                <em class="fl">/</em>
                <a class="fl" href="javascript:;" @click="openLoginAndRegPop(0)">登录</a>
            </div>
            <!--
                v-if="nickName"
            -->
            <div
                class="loginSuccUser_ico"
                @mouseenter="showLoginBox"
                @mouseleave="hideLoginBox"
                :class="{ 'isHidden': !user }"
            >
                登录成功
            </div>
            <div
                class="loginSuccBox"
                v-show="loginBoxSuccessIsShow"
                @mouseenter="showLoginBox"
                @mouseleave="hideLoginBox"
            >
                <span class="boxTriangle_ico"></span>
                <div class="topArea">
                    <img src="./../../static/images/loginSuccUserHeadImage_ico.png" alt="小kaykay" title="小kaykay" />
                    <strong v-text="user.userName" v-if="user"></strong>
                </div>
                <div class="bottomArea">
                    <ul>
                        <router-link tag="li" :to="{ name: 'MyAccount' }">我的订单</router-link>
                        <router-link tag="li" :to="{ name: 'MyHarvestAddress' }">收获地址</router-link>
                        <li @click="logoutHandler">退出登录</li>
                    </ul>
                </div>
            </div>
        </div>
        <!--
            注册和登录 end
        -->

        <!--
            注册登录弹框 start
        -->
        <div class="regAndLoginBox" :class="{ 'kd-show': loginBoxIsHide }">
            <div class="regAndLoginHeader clearfix">
                <nav class="fl">
                    <a
                        class="fl"
                        :class="{ 'active': index == tabIndex }"
                        :key="index"
                        v-for="(item, index) in loginRegArray"
                        href="javascript:;"
                        @click="toggleTab(index)"
                    >
                        {{ item }}
                    </a>
                </nav>
                <em class="fr" @click="closeLoginAndRegPop"></em>
            </div>
            <div class="regAndLoginCont">
                <form v-show="tabIndex==0" style="display: block;" class="loginBox" method="post" onsubmit="return false;">
                    <span :class="{ 'hidden-errors': !loginErrorTips }">{{ regAndLoginErrorMsgShow }}</span>
                    <input type="text" class="userName commonInput" name="userName" placeholder="请输入用户名" v-model="userName" />
                    <input type="password" class="userPwd commonInput" name="userPwd" placeholder="6-12位密码，区分大小写，不能用空格" v-model="userPwd" @keyup.13="loginHandler" />
                    <div class="checkList clearfix">
                        <label
                            class="fl"
                            :class="{ 'active': isChecked }"
                            @click="switchCheckedStatus"
                        >
                            7天内自动登录
                        </label>
                        <a class="fr" href="javascript:;">忘记密码</a>
                    </div>
                    <input class="loginBtn commonInput" type="button" value="登录" @click="loginHandler" />
                </form>
                <form v-show="tabIndex==1" class="regBox" method="post" onsubmit="return false;">
                    <span :class="{ 'hidden-errors': !regErrorTips }">{{ regAndLoginErrorMsgShow }}</span>
                    <input type="text" class="userName commonInput" name="userName" placeholder="请输入用户名" v-model="userName" />
                    <input type="password" class="userPwd commonInput" name="userPwd" placeholder="6-12位密码，区分大小写，不能用空格" v-model="userPwd" @keyup.13="registerHandler" />
                    <div class="checkList clearfix">
                        <label
                            class="fl"
                            :class="{ 'active': isChecked }"
                            @click="switchCheckedStatus"
                        >
                            同意<a href="javascript:;" target="_blank">《凯游商城注册协议》</a>
                        </label>
                    </div>
                    <input class="regBtn commonInput" type="button" value="注册" @click="registerHandler" />
                </form>
            </div>
        </div>
        <!--
            注册登录弹框 end
        -->

        <!--
            遮罩层 start
        -->
        <div
            class="maskLayer"
            v-if="overLayerFlag"
            @click="closeLoginAndRegPop"
        >
        </div>
        <!--
            遮罩层 end
        -->
    </div>
</template>

<script type="text/ecmascript-6">
    // 引入vuex
    import { mapState } from 'vuex';
    // 引入axios
    import Axios from 'axios';
    export default {
        name: 'RegLogin',
        created () {
            // 调用获取用户信息的方法
            this.getUserInfo ();
        },
        mounted () {
            // 调用检查登录状态方法
            // this.checkLogin ();
        },
        // 计算属性，状态共享
        computed: {
            // vuex辅助函数
            ...mapState (['user', 'cartCount'])
            /**nickName () {
                return this.$store.state.nickName;
            },
            cartCount () {
                return this.$store.state.cartCount;
            }*/
        },
        data () {
            return {
                // 定时器变量，默认为null
                timer: null,
                // 登录注册弹出层是否显示，默认不显示true
                loginBoxIsHide: true,
                // loginBoxSuccessIsShow是否显示，默认不显示
                loginBoxSuccessIsShow: false,
                // 登录用户名
                userName: '',
                // 登录密码
                userPwd: '',
                // 注册的错误信息提示，默认不显示错误信息，只有注册失败才显示错误信息
                regErrorTips: false,
                // 登录的错误信息提示，默认不显示错误信息，只有登录失败才显示错误信息
                loginErrorTips: false,
                regAndLoginUserNameErrorTips: false,
                regAndLoginUserPwdErrorTips: false,
                regAndLoginUserPwdLengthErrorTips: false,
                regAndLoginErrorMsgShow: '',
                regAndLoginErrorMsg: [ '用户名不能为空', '密码不能为空', '密码不能小于6位噢' ],
                // 接收遮罩层子组件传递过来的数据，接收下
                hideMaskLayer: false,
                // 登录成功用户名
                // nickName: '',
                // 登录注册的选中状态，默认为选中
                isChecked: true,
                // 登录注册切换的索引值
                tabIndex: 0,
                // 登录注册集合
                loginRegArray: ["登录", "注册"],
                overLayerFlag: false
            };
        },
        methods: {
            // tab为当前触发标签页的组件名
            toggleTab ( index ) {
                this.tabIndex = index;
            },
            // 显示登录成功弹框
            showLoginBox () {
                clearTimeout ( this.timer );
                this.loginBoxSuccessIsShow = true;
            },
            // 隐藏登录成功弹框
            hideLoginBox () {
                this.timer = setTimeout ( function () {
                    this.loginBoxSuccessIsShow = false;
                }.bind ( this ), 200 );
            },
            // 获取用户信息
            getUserInfo () {
                this.$http.get ( '/users/getUserInfo' )
                    .then ( ( response ) => {
                        let res = response.data;
                        let path = this.$route.pathname;
                        if ( res.status == "0" ) {
                            /**
                             * 这里通过commit提交到vuex里，然后在vuex里面去改变nickName的值，最后在用到的组件
                             * 里面会时时的计算，从而拿到这个属性状态从而进行渲染
                             */
                            sessionStorage.setItem ( 'userInfo', JSON.stringify ( res.result ) );
                            this.$store.commit ( 'updateUserInfo', res.result );
                            // 调用获取购物车的某个用户下的商品数量
                            this.getCartCount ();
                        } else {
                            if ( this.$route.path != '/goodsLists' ) {
                                this.$router.push ({
                                    name: 'GoodsList'
                                });
                            }
                        }
                    });
            },
            // 注册方法
            registerHandler () {
                if ( this.userName == "" ) {
                    this.regAndLoginErrorMsgShow = this.regAndLoginErrorMsg[0];
                    this.regErrorTips = true;
                    this.regAndLoginUserNameErrorTips = true;
                    this.regAndLoginUserPwdErrorTips = false;
                    this.regAndLoginUserPwdLengthErrorTips = false;
                    return;
                } else if ( this.userPwd == "" ) {
                    this.regAndLoginErrorMsgShow = this.regAndLoginErrorMsg[1];
                    this.regErrorTips = true;
                    this.regAndLoginUserPwdErrorTips = true;
                    this.regAndLoginUserNameErrorTips = false;
                    this.regAndLoginUserPwdLengthErrorTips = false;
                    return;
                } else if ( this.userPwd.length < 6 ) {
                    this.regAndLoginErrorMsgShow = this.regAndLoginErrorMsg[2];
                    this.regErrorTips = true;
                    this.regAndLoginUserPwdLengthErrorTips = true;
                    this.regAndLoginUserNameErrorTips = false;
                    this.regAndLoginUserPwdErrorTips = false;
                    return;
                } else if ( this.userName != "" && this.userPwd != "" && this.userPwd.length >= 6 ) {
                    this.regAndLoginErrorMsgShow = "用户名已被注册！";
                    this.regErrorTips = false;
                    this.regAndLoginUserNameErrorTips = false;
                    this.regAndLoginUserPwdErrorTips = false;
                    this.regAndLoginUserPwdLengthErrorTips = false;
                }
                this.$http.post ( '/users/register', {
                    userName: this.userName,
                    userPwd: this.userPwd
                }).then ( ( response ) => {
                    let res = response.data;
                    if ( res.status == "0" ) {
                        this.closeLoginAndRegPop ();
                        this.regErrorTips = false;
                    } else {
                        this.regErrorTips = true;
                    }
                });
            },
            // 登录方法
            loginHandler () {
                if ( this.userName == "" ) {
                    this.regAndLoginErrorMsgShow = this.regAndLoginErrorMsg[0];
                    this.loginErrorTips = true;
                    this.regAndLoginUserNameErrorTips = true;
                    this.regAndLoginUserPwdErrorTips = false;
                    this.regAndLoginUserPwdLengthErrorTips = false;
                    return;
                } else if ( this.userPwd == "" ) {
                    this.regAndLoginErrorMsgShow = this.regAndLoginErrorMsg[1];
                    this.loginErrorTips = true;
                    this.regAndLoginUserPwdErrorTips = true;
                    this.regAndLoginUserNameErrorTips = false;
                    this.regAndLoginUserPwdLengthErrorTips = false;
                    return;
                } else if ( this.userPwd.length < 6 ) {
                    this.regAndLoginErrorMsgShow = this.regAndLoginErrorMsg[2];
                    this.loginErrorTips = true;
                    this.regAndLoginUserPwdLengthErrorTips = true;
                    this.regAndLoginUserNameErrorTips = false;
                    this.regAndLoginUserPwdErrorTips = false;
                    return;
                } else if ( this.userName != "" && this.userPwd != "" && this.userPwd.length >= 6 ) {
                    this.regAndLoginErrorMsgShow = "用户名或密码输入有误！";
                    this.loginErrorTips = false;
                    this.regAndLoginUserNameErrorTips = false;
                    this.regAndLoginUserPwdErrorTips = false;
                    this.regAndLoginUserPwdLengthErrorTips = false;
                }
                this.$http.post ( '/users/login', {
                    userName: this.userName,
                    userPwd: this.userPwd
                }).then ( ( response ) => {
                    let res = response.data;
                    if ( res.status == "0" ) {
                        this.closeLoginAndRegPop ();
                        this.loginErrorTips = false;
                        this.$store.commit ( 'updateUserInfo', res.result );
                        // 将token存入sessionStorage里
                        sessionStorage.setItem ( 'userInfo', JSON.stringify ( res.result ) );
                        sessionStorage.setItem ( 'token', res.result.token );
                        Axios.defaults.headers.Authorization = res.result.token;
                        // 调用获取购物车的某个用户下的商品数量
                        this.getCartCount ();
                    } else {
                        this.loginErrorTips = true;
                    }
                });
            },
            // 登出方法
            logoutHandler () {
                this.$http.post ( '/users/logout' )
                    .then ( ( response ) => {
                        let res = response.data;
                        if ( res.status == "0" ) {
                            this.$store.commit ( 'updateUserInfo', '' );
                            this.$store.commit ( 'initCartCount', 0 );
                            sessionStorage.removeItem ( "userInfo" );
                            this.loginBoxSuccessIsShow = false;
                        }
                    });
            },
            // 获取购物车的某个用户下的商品数量
            getCartCount () {
                this.$http.get ( '/users/getCartCount' )
                    .then ( ( response ) => {
                        let res = response.data;
                        if ( res.status == "0" ) {
                            // 将后台返回的商品总数量提交到vuex里进行统一管理
                            this.$store.commit ( 'initCartCount', res.result );
                        }
                    });
            },
            // 显示滚动条的方法
            showScroll () {
                document.querySelectorAll ( 'body' )[0].style.overflowY = 'auto';
                document.querySelectorAll ( 'html' )[0].style.overflowY = 'auto';
            },
            // 隐藏滚动条的方法
            hideScroll () {
                document.querySelectorAll ( 'body' )[0].style.overflowY = 'hidden';
                document.querySelectorAll ( 'html' )[0].style.overflowY = 'hidden';
            },
            // 点击右上方登录注册按钮的方法
            openLoginAndRegPop ( index ) {
                // 打开对应的登录注册选项卡
                this.tabIndex = index;
                // 显示弹出层
                this.loginBoxIsHide = false;
                // 让遮罩层显示
                this.overLayerFlag = true;
                // 调用隐藏滚动条的方法
                this.hideScroll ();
            },
            // 点击关闭登录注册弹框的方法
            closeLoginAndRegPop () {
                // 隐藏弹出层
                this.loginBoxIsHide = true;
                // 让遮罩层隐藏
                this.overLayerFlag = false;
                // 清空用户名
                this.userName = '';
                // 清空密码
                this.userPwd = '';
                // 调用显示滚动条的方法
                this.showScroll ();
            },
            // 切换登录注册的选中状态
            switchCheckedStatus () {
                this.isChecked = !this.isChecked;
            }
        }
    };
</script>

<style lang="css" rel="stylesheet/css" scoped>
    /**
        注册和登录 start
    */
    .regAndLogin {
        font-weight: normal!important;
        font-size: 16px!important;
        line-height: 60px!important;
        font-family: ''!important;
        color: #eee!important;
        padding: 0 0 0 49px;
        position: relative;
    }

    .regAndLogin a {
        display: block;
        padding: 0 15px;
        color: #eee!important;
    }

    .regAndLogin em {
        padding: 0 10px;
    }

    .regAndLogin .isHidden {
        visibility: hidden;
    }

    .header-c a:hover,
    .header-c a.active,
    .regAndLogin a:hover,
    .regAndLogin a:active  {
        background-color: #278bdd!important;
        color: #fff!important;
    }

    .loginSuccUser_ico {
        position: absolute;
        right: 64px;
        top: 17px;
        width: 24px;
        height: 26px;
        background: url(./../assets/images/loginSucc_ico.png) no-repeat;
        background-size: 24px 26px;
        text-indent: -999999em;
        cursor: pointer;
        visibility: visible;
    }

    .loginSuccBox {
        position: absolute;
        right: -50px;
        top: 68px;
        width: 250px;
        /*height: 334px;*/
        background-color: #fff!important;
        border-radius: 5px;
        z-index: 9999;
        cursor: pointer;
        display: block;
    }

    .loginSuccBox .boxTriangle_ico {
        position: absolute;
        right: 112px;
        top: -12px;
        width: 25px;
        height: 12px;
        background: url(./../assets/images/boxTriangle_ico.png) no-repeat;
        background-size: 25px 12px;
        z-index: 9;
    }

    .loginSuccBox .topArea img,
    .loginSuccBox .topArea strong {
        display: block;
        line-height: 0;
    }

    .loginSuccBox .topArea img {
        width: 76px;
        height: 76px;
        margin: 30px auto 0;
    }

    .loginSuccBox .topArea strong {
        font-weight: normal!important;
        font-size: 16px!important;
        font-family: ''!important;
        color: #000!important;
        text-align: center;
        padding: 15px 0 26px 0;
    }

    .loginSuccBox .bottomArea li:first-of-type {
        border-top: 1px solid #ddd;
        background: url(./../assets/images/myOrder_ico.png) no-repeat 60px 16px;
        background-size: 20px 22px;
    }

    .loginSuccBox .bottomArea li:first-of-type:hover {
        background-image: url(./../assets/images/myOrder_active_ico.png);
    }

    .loginSuccBox .bottomArea li:nth-of-type(2) {
        background: url(./../assets/images/receivingAddress_ico.png) no-repeat 59px 15px;
        background-size: 20px 24px;
    }

    .loginSuccBox .bottomArea li:nth-of-type(2):hover {
        background-image: url(./../assets/images/receivingAddress_active_ico.png);
    }

    .loginSuccBox .bottomArea li:last-of-type {
        border-bottom: 0 none;
        background: url(./../assets/images/safeExit_ico.png) no-repeat 58px 15px;
        background-size: 22px 24px;
    }

    .loginSuccBox .bottomArea li:last-of-type:hover {
        background-image: url(./../assets/images/safeExit_active_ico.png);
    }

    .loginSuccBox .bottomArea li {
        width: 220px!important;
        height: 54px!important;
        border: 0 none!important;
        border-radius: 0!important;
        margin-bottom: 0!important;
        border-bottom: 1px solid #ddd!important;
        font-weight: normal!important;
        font-size: 16px!important;
        line-height: 54px!important;
        font-family: ''!important;
        color: #999!important;
        padding: 0 0 0 30px!important;
    }

    .loginSuccBox .bottomArea li:hover {
        background-color: #278bdd!important;
        color: #fff!important;
    }
    /**
        注册和登录 end
    */

    /**
        注册登录弹框 start
     */
    .regAndLoginBox {
        _position: absolute;
        position: fixed;
        left: 50%;
        top: 50%;
        width: 324px;
        height: 296px;
        background-color: #fff;
        padding: 16px 20px;
        margin: -164px 0 0 -182px;
        z-index: 99999999;
    }

    .regAndLoginBox.kd-show {
        display: none;
    }

    .regAndLoginHeader {
        height: 38px;
        border-bottom: 1px solid #d0d6d9;
    }

    .regAndLoginHeader a {
        float: left;
        width: 100px;
        height: 38px;
        font-weight: normal!important;
        font-size: 18px!important;
        font-family: ''!important;
        color: #717274!important;
        text-align: center;
    }

    .regAndLoginHeader em {
        width: 18px;
        height: 21px;
        background: url(./../assets/images/boxClose_ico.png) no-repeat 0 3px;
        background-size: 18px 18px;
        cursor: pointer;
    }

    .regAndLoginHeader a.active,
    .regAndLoginHeader a:hover {
        color: #278bdd!important;
        border-bottom: 1px solid #278bdd;
    }

    .regAndLoginCont span {
        display: block;
        height: 30px;
        font-weight: bold!important;
        font-size: 16px!important;
        line-height: 30px!important;
        font-family: ''!important;
        color: #ff0000!important;
        text-align: left;
    }

    .regAndLoginCont span.hidden-errors {
        visibility: hidden;
    }

    .regAndLoginCont .commonInput {
        display: block;
        width: 300px;
        height: 38px;
        border: 1px solid #c9c9c9;
        border-radius: 2px;
        padding: 0 0 0 22px;
        font-weight: normal!important;
        font-size: 14px!important;
        line-height: 38px!important;
        font-family: ''!important;
        color: #000!important;
    }

    .regAndLoginCont input:focus {
        border: 1px solid #278bdd;
    }

    .regAndLoginCont input:nth-of-type(2) {
        margin-top: 22px!important;
    }

    .regAndLoginCont .checkList {
        margin: 20px 0 30px 0;
    }

    .regBox .checkList a:hover {
        color: #f00!important;
        text-decoration: none;
    }

    .checkList label {
        width: auto;
        height: 21px;
        background: url(./../assets/images/default_radio.png) no-repeat 0 2px;
        background-size: 19px 19px;
        font-weight: normal!important;
        font-size: 16px!important;
        font-family: ''!important;
        color: #666!important;
        padding: 0 0 0 28px;
    }

    .checkList label.active {
        background: url(./../assets/images/active_radio.png) no-repeat 0 2px;
    }

    .checkList a {
        font-weight: normal!important;
        font-size: 16px!important;
        font-family: ''!important;
        color: #666!important;
    }

    .checkList a:hover {
        text-decoration: underline;
    }

    .regAndLoginCont input:nth-of-type(3) {
        width: 324px;
        height: 50px;
        background-color: #278bdd;
        border-radius: 2px;
        font-weight: normal!important;
        font-size: 18px!important;
        line-height: 50px!important;
        font-family: ''!important;
        color: #fff!important;
        text-align: center;
        border: 0 none;
        padding-left: 0;
        cursor: pointer;
    }

    .loginBox input:nth-of-type(3) {
        position: relative;
        top: -2px;
    }

    .regAndLoginCont input:nth-of-type(3):hover {
        background-color: #2992e8;
    }
    /**
        注册登录弹框 end
     */

    /**
        遮罩层 start
     */
    .maskLayer {
        _position: absolute;
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba( 0, 0, 0, 0.5 );
        filter: alpha(opacity = 50);
        opacity: 0.5;
        z-index: 999999;
    }
    /**
        遮罩层 end
     */
</style>
