<template>
    <div class="goodsList">
        <!-- NavHeader start -->
        <nav-header></nav-header>
        <!-- NavHeader end -->

        <!-- NavBread start -->
        <nav-bread>
            <!-- 灵活的运用插槽 start -->
            <span slot="goodsListPage">商品列表页</span>
            <!-- 灵活的运用插槽 end -->
        </nav-bread>
        <!-- NavBread end -->

        <!--
            商品排序方式 start
        -->
        <section class="goodsOfSortMode clearfix comWidth">
            <label class="fl">排序方式：</label>
            <nav class="fl clearfix" v-for="(item, index) in sortOrderItems">
                <!-- 将索引值传入class(索引值等于几就将第几个添加active类) -->
                <a
                    :class="{ 'inActive': index == sortChecked }"
                    @click="toggleClassOfSortOrder(index)"
                    href="javascript:;">
                        {{ item }}
                </a>
            </nav>
        </section>
        <!--
            商品排序方式 end
        -->

        <!--
            商品价格筛选 start
        -->
        <section class="goodsOfPriceFilter clearfix comWidth">
            <label class="fl">价格筛选：</label>
            <nav class="fl clearfix">
                <a
                    v-for="(priceInterval, index) in priceFilter"
                    :class="{ 'inActive': priceChecked == index }"
                    @click="toggleClassOfPriceFilter(index)"
                    href="javascript:;"
                >
                    {{ priceInterval }}
                </a>
            </nav>
        </section>
        <!--
            商品价格筛选 end
        -->

        <!--
            商品列表展示，注意在引用组件的时候一定要写成烤串的方式，
            在子级用props接收父级传递过来的数据的时候就要写成驼峰式，
            小度注意下 start
        -->
        <section class="goodsList comWidth">
            <goods-list-item
                :goodsListItem="goodsListItem"
            >
            </goods-list-item>
            <div class="loading-more"
                 v-infinite-scroll="loadMore"
                 infinite-scroll-disabled="busy"
                 infinite-scroll-distance="20"
            >
                <img
                    src="/static/images/loading_img/loading-spinning-bubbles.svg"
                    v-show="loading"
                />
            </div>
        </section>
        <!--
            商品列表展示，注意在引用组件的时候一定要写成烤串的方式，
            在子级用props接收父级传递过来的数据的时候就要写成驼峰式，
            小度注意下 end
        -->

        <!-- NavFooter start -->
        <nav-footer style="margin-top: -18px;"></nav-footer>
        <!-- NavFooter end -->
    </div>
</template>

<script type="text/ecmascript-6">
    // 引入头部公用组件
    import NavHeader from './NavHeader';
    // 引入面包屑组件
    import NavBread from './NavBread';
    // 引入底部公用组件
    import NavFooter from './NavFooter';
    // 引入抽离出来的单个商品组件
    import GoodsListItem from './GoodsListItem';
    // 通用的模态框
    import CommonPopModal from './CommonPopModal';
    export default {
        name: 'GoodsList',
        data () {
            return {
                // 排列方式，默认第一个加上active状态
                sortChecked: 0,
                // 排序方式数据
                sortOrderItems: ['综合排序', '销量从低到高', '销量从高到低', '价格从低到高', '价格从高到低'],
                // 排列方式，默认第一个加上active状态
                // 价格排序默认选中所有
                priceChecked: '0',
                priceFilter: [
                    '所有',
                    '0 - 500',
                    '500 - 1000',
                    '1000 - 2000',
                    '2000 - 5000',
                    '5000 - 10000'
                ],
                // 商品列表页数据，返回一个数组来接收
                goodsListItem: [],
                // 价格和月销售量升降序字段，默认为true(升序)，false(降序)
                sortGoodsList: true,
                // 商品页数，初始化为第一页
                page: 1,
                // 商品每页显示的商品条数
                pageSize: 8,
                // 默认是禁止滚动页面就加载数据的
                busy: true,
                // 图片分页加载，默认设为false
                loading: false
            };
        },
        // 注册局部组件
        components: {
            // 头部公用组件
            NavHeader,
            // 面包屑组件
            NavBread,
            // 底部公用组件
            NavFooter,
            // 商品列表页组件
            GoodsListItem
        },
        mounted () {
            // 商品列表页查询接口数据
            this.goodsListData ();
        },
        methods: {
            // 排序方式
            toggleClassOfSortOrder ( index ) {
                // 排列方式切换
                this.sortChecked = index;
                // 价格升序排列
                if ( index == 1 || index == 3 ) {
                    // console.log ( '价格或月销量升序排列' );
                    this.sortGoodsList = true;
                    // 默认点击价格或月销量升序排列都从第一页开始
                    this.page = 1;
                    // 重新调用下商品列表页查询接口数据
                    this.goodsListData ( false );
                // 价格降序排列
                } else if ( index == 2 || index == 4 ) {
                    // console.log ( '价格或月销量降序排列' );
                    this.sortGoodsList = false;
                    // 默认点击价格或月销量降序排列都从第一页开始
                    this.page = 1;
                    // 重新调用下商品列表页查询接口数据
                    this.goodsListData ();
                }
            },
            // 价格过滤
            toggleClassOfPriceFilter ( index ) {
                this.priceChecked = index;
                // 默认点击价格过滤都从第一页开始
                this.page = 1;
                // 重新调用下商品列表页查询接口数据
                this.goodsListData ();
            },
            // 商品列表页查询接口数据
            goodsListData ( flag ) {
                var params = {
                    // 当前的页码
                    page: this.page,
                    // 当前页码的商品数量
                    pageSize: this.pageSize,
                    // 如果true赋值为1，升序排列，false赋值为-1，降序排列
                    // 1为升序，-1为降序
                    sort: this.sortGoodsList ? 1 : -1,
                    // 价格过滤参数
                    priceLevel: this.priceChecked
                };
                // 数据正在请求，loading状态设置为true
                this.loading = true;
                this.$http.get ( '/goodsLists/list', {
                    params: params
                }).then ( ( response ) => {
                    var res = response.data;
                    // 数据请求完成，loading状态设置为false
                    this.loading = false;
                    // 请求成功的
                    if ( res.status == "0" ) {
                        // 如果flag == true，代表是分页的，要做数据拼接
                        if ( flag ) {
                            this.goodsListItem = this.goodsListItem.concat ( res.result.list );
                            // 已经没有商品，把禁用加载参数置为true
                            if ( res.result.count == 0 ) {
                                this.busy = true;
                            // 如果有商品，那么把禁用加载参数置为false
                            } else {
                                this.busy = false;
                            }
                        // 第一次进来不需要进行数据拼接的，正常的请求
                        } else {
                            this.goodsListItem = res.result.list;
                            // 注意这里首次应该将禁用加载参数设为false，不然滚动是不会加载分页数据的
                            this.busy = false;
                        }
                        console.log ( res.result.list );
                    // 请求失败的
                    } else {
                        this.goodsListItem = [];
                    }
                });
            },
            // 加载分页数据
            loadMore () {
                // 一旦加载完了下一页的数据，就将busy设为true，禁止滚动页面的时候再去发请求加载数据
                this.busy = true;
                setTimeout ( () => {
                    this.page++;
                    // 然后开始加载数据，这里注意要区分下，true就是告诉它只有当分页的时候数据才需要累加
                    this.goodsListData ( true );
                }, 500 );
            }
        }
    };
</script>

<style lang="css" rel="stylesheet/css" scoped>
    /**
        商品排序方式 start
     */
    .goodsOfSortMode {
        margin-top: 30px;
    }

    .goodsOfSortMode label {
        padding: 0 10px 0 0;
    }

    .goodsOfSortMode label,
    .goodsOfSortMode a {
        font-weight: normal!important;
        font-size: 14px!important;
        line-height: 30px!important;
        font-family: ''!important;
        color: #999;
    }

    .goodsOfSortMode a {
        float: left;
        height: 30px;
        border: 1px solid #999;
        border-radius: 2px;
        margin: 0 20px 0 0;
        padding: 0 24px;
    }

    .goodsOfSortMode a.inActive,
    .goodsOfSortMode a:hover {
        background-color: #278bdd;
        color: #fff;
        border: 1px solid #278bdd;
    }
    /**
        商品排序方式 end
     */

    /**
        商品价格筛选 start
     */
    .goodsOfPriceFilter {
        margin-top: 30px;
        margin-bottom: 30px;
    }

    .goodsOfPriceFilter label {
        padding: 0 10px 0 0;
    }

    .goodsOfPriceFilter label,
    .goodsOfPriceFilter a {
        font-weight: normal!important;
        font-size: 14px!important;
        line-height: 30px!important;
        font-family: ''!important;
        color: #999;
    }

    .goodsOfPriceFilter a {
        float: left;
        height: 30px;
        border: 1px solid #999;
        border-radius: 2px;
        margin: 0 20px 0 0;
        padding: 0 24px;
    }

    .goodsOfPriceFilter a.inActive,
    .goodsOfPriceFilter a:hover {
        background-color: #278bdd;
        color: #fff;
        border: 1px solid #278bdd;
    }
    /**
        商品价格筛选 end
     */

    /**
        加载更多显示隐藏 start
     */
    .loading-more {
        width: 1200px;
        height: 0;
        position: relative;
        top: -48px;
        margin: 0 auto;
    }
    /**
        加载更多显示隐藏 end
     */
</style>
