<template>
    <div>
        <!--
            小小游通用的modalPopModal start
        -->
        <div class="commonPopModal" :class="{ 'md-isShow': mdShow }">
            <div class="modal-header">
                <slot name="modal-title"></slot>
            </div>
            <div class="modal-content">
                <slot name="modal-message"></slot>
            </div>
            <div class="modal-footer clearfix">
                <div class="fr clearfix">
                    <slot name="modal-btnGroup">
                        <a href="javascript:;" @click="closeModal">关闭</a>
                    </slot>
                </div>
            </div>
        </div>
        <!--
            小小游通用的modalPopModal end
        -->

        <!--
            遮罩层 start
        -->
        <div
            class="maskLayer"
            :class="{ 'maskLayer': controlShowAndHideFlag }"
            v-if="mdShow"
            @click="closeModal"
        >
        </div>
        <!--
            遮罩层 end
        -->
    </div>
</template>

<script type="text/ecmascript-6">
    // 定义一个组件
    // 第一个参数就是组件的名称，第二个参数就是一个对象(配置参数选项)
    /**
     * 1.定义全局组件通过Vue.component('组件名', { 配置选项 });在任何地方
     * 都可以使用。
     * 2.定义的局部组件通过在new Vue({ components: { '组件名': { 配置选项 } } });
     * 只能在当前这个实例下使用，其它new Vue({  });的实例无法使用。
     */

    /**********************************************************************/

    /**
     * 设置的props:
     *     modalHeader 提醒消息 默认为 '这是一个模态框'
     *
     * 定制模板：
     *     slot为modal-content 定制提醒信息模板
     *     slot为modal-footer 定制底部模板
     *
     * 监控子组件状态的变化：
     *     事件名on-sure       点击确定触发
     *     事件名on-cancel     点击取消触发
     *     事件名on-close      点击关闭触发
     */
    export default {
        name: 'CommonPopModal',
        data () {
            return {
                // 用来控制遮罩层的显示和隐藏的变量
                controlShowAndHideFlag: false
            };
        },
        // props最好验证下类型
        props: {
            // 注意props里面用写成驼峰式，在定义标签里面写成modal-header烤串式
            // 模态框的默认标题
            'modalHeader': {
                type: String,
                default: '这是一个通用的模态框'
            },
            // 模态框是否显示
            'mdShow': {
                type: Boolean
            }
        },
        methods: {
            // 显示遮罩层
            showMask () {
                /**
                 * 告知父级，我要给您传输数据过去，在自定义标签里面绑定一个自定义事件，并将值
                 * 传过去
                 */
                this.$emit ( 'show-mask-layer', this.controlShowAndHideFlag );
                // 将遮罩层状态值设置为true，让其盖住页面
                this.controlShowAndHideFlag = true;
            },
            // 隐藏遮罩层
            hideMask () {
                /**
                 * 告知父级，我要给您传输数据过去，在自定义标签里面绑定一个自定义事件，并将值
                 * 传过去
                 */
                this.$emit ( 'hide-mask-layer', this.controlShowAndHideFlag );
                // 将遮罩层状态值设置为false，让其不盖住页面
                this.controlShowAndHideFlag = false;
            },
            // 隐藏滚动条
            hideScroll () {
                // this.showMask ();
                /** 隐藏纵向滚动条 start */
                document.querySelectorAll ( 'html' )[0].style.overflowY = 'hidden';
                document.querySelectorAll ( 'body' )[0].style.overflowY = 'hidden';
                /** 隐藏纵向滚动条 end */
            },
            // 显示滚动条
            showScroll () {
                // this.hideMask ();
                /** 显示纵向滚动条 start */
                document.querySelectorAll ( 'html' )[0].style.overflowY = 'auto';
                document.querySelectorAll ( 'body' )[0].style.overflowY = 'auto';
                /** 显示纵向滚动条 end */
            },
            // 关闭模态框
            closeModal () {
                this.$emit ( 'on-close' );
            }
        }
    };
</script>

<style lang="css" rel="stylesheet/css" scoped>
    .commonPopModal {
        _position: absolute;
        position: fixed;
        left: 50%;
        top: 50%;
        width: 400px;
        background-color: #fff;
        border-radius: 5px;
        border: 1px solid #c9c9c9;
        margin: 0 0 0 -200px;
        -webkit-transform: translateX(0) translateY(-50%);
        -moz-transform: translateX(0) translateY(-50%);
        -o-transform: translateX(0) translateY(-50%);
        -ms-transform: translateX(0) translateY(-50%);
        transform: translateX(0) translateY(-50%);
        z-index: 999999999;
        display: none;
    }

    .commonPopModal.md-isShow {
        display: block;
    }

    .commonPopModal .modal-header {
        height: 65px;
        border-bottom: 1px solid #c9c9c9;
    }

    .modal-header h1 {
        font-weight: normal!important;
        font-size: 22px!important;
        line-height: 65px!important;
        font-family: ''!important;
        color: #333;
        text-align: center;
    }

    .commonPopModal .modal-content {
        padding: 16px 20px;
        border-bottom: 1px solid #c9c9c9;
    }

    /**
      * 多行元素溢出隐藏 start
      */
    .modal-content p {
        /*display: -webkit-box;*/
        /*display: -moz-box;*/
        width: 458px;
        height: 56px;
        font-weight: normal!important;
        font-size: 20px!important;
        font-family: ''!important;
        color: #333;
        /*overflow: hidden;*/
        /*text-overflow: ellipsis;*/
        /*word-break: break-all;*/
        /*-webkit-box-orient: vertical;*/
        /*-webkit-line-clamp: 2;*/
    }
    /**
      * 多行元素溢出隐藏 end
      */

    .commonPopModal .modal-footer {
        padding: 14px 0;
    }

    .modal-footer div:first-of-type {
        margin: 0 10px 0 0;
    }

    .modal-footer a {
        float: left;
        height: 36px;
        background-color: #00a0e9;
        font-weight: normal!important;
        font-size: 18px!important;
        line-height: 36px!important;
        font-family: ''!important;
        color: #fff;
        border-radius: 5px;
        text-align: center;
        margin: 0 0 0 10px;
        padding: 0 10px;
    }

    .modal-footer a:nth-of-type(2) {
        background-color: #e5e5e5;
    }

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
        background-color: rgba( 0, 0, 0, 0.5 );
        filter: alpha(opacity = 50);
        opacity: 0.5;
        z-index: 999999;
    }
    /**
        遮罩层 end
     */
</style>
