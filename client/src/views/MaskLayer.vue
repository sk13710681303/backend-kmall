<template>
    <!--
        遮罩层 start
    -->
    <div
        class="mask"
        :class="{ 'maskLayer': controlShowAndHideFlag }"
    >

    </div>
    <!--
        遮罩层 end
    -->
</template>

<script type="text/ecmascript-6">
    export default {
        name: 'MaskLayer',
        data () {
            return {
                // 用来控制遮罩层的显示和隐藏的变量
                controlShowAndHideFlag: false
            };
        },
        methods: {
            showMask () {
                /**
                 * 告知父级，我要给您传输数据过去，在自定义标签里面绑定一个自定义事件，并将值
                 * 传过去
                 */
                this.$emit ( 'show-mask-layer', this.controlShowAndHideFlag );
                // 将遮罩层状态值设置为true，让其盖住页面
                this.controlShowAndHideFlag = true;
            },
            hideMask () {
                /**
                 * 告知父级，我要给您传输数据过去，在自定义标签里面绑定一个自定义事件，并将值
                 * 传过去
                 */
                this.$emit ( 'hide-mask-layer', this.controlShowAndHideFlag );
                // 将遮罩层状态值设置为false，让其不盖住页面
                this.controlShowAndHideFlag = false;
            },
            // 显示遮罩层
            showMaskLayer () {
                this.showMask ();
                /** 隐藏纵向滚动条 start */
                document.querySelectorAll ( 'html' )[0].style.overflowY = 'hidden';
                document.querySelectorAll ( 'body' )[0].style.overflowY = 'hidden';
                /** 隐藏纵向滚动条 end */
            },
            // 隐藏遮罩层
            hideMaskLayer () {
                this.hideMask ();
                /** 显示纵向滚动条 start */
                document.querySelectorAll ( 'html' )[0].style.overflowY = 'auto';
                document.querySelectorAll ( 'body' )[0].style.overflowY = 'auto';
                /** 显示纵向滚动条 end */
            }
        }
    };
</script>

<style lang="css" rel="stylesheet/css" scoped>
    body,
    html {
        overflow-y: auto;
    }

    /**
        遮罩层 start
     */
    .maskLayer {
        width: 100%;
        height: 100%;
        _position: absolute;
        position: fixed;
        left: 0;
        top: 0;
        background-color: rgba( 0, 0, 0, 0.5 );
        filter: alpha(opacity = 50);
        opacity: 0.5;
        z-index: 999999;
    }
    /**
        遮罩层 end
     */
</style>
