// http://eslint.org/docs/user-guide/configuring
module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true,
    },
    // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
    extends: 'standard',
    // required to lint *.vue files
    plugins: [
        'html'
    ],
    // add your custom rules here
    'rules': {
        // allow paren-less arrow functions
        'arrow-parens': 0,
        // allow async-await
        'generator-star-spacing': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        /**
         * 用ESLint配置上semi选项，让代码形成一种良好的规范，要加分号结束
         * 比如在vuejs里面我写如下代码是完全没有问题的：
         * import myHeader from './components/Header.vue'不加分号是没问题的对不对，
         * 因为在vuejs里面默认就是不加分号的，因为我的代码风格是想让其加上分号的，那么只需要
         * 在.eslintrc.js这个文件里面的'rules'选项中配置上'semi': ["error","always"]
         * 就可以实现我的需求了，这句话的意思是总是要加上分号，挺好
         */
        'semi': ["error", "always"],
        // 设置代码缩进风格为四个空格，并且忽略注释
        'indent': ["error", 4, { "ignoreComments": true }],
        /**
         * 设置如下代码时：
         export default {
                name: 'hello',
                data () {
                    return {
                        msg: 'Welcome to Your Vue.js App'
                    };
                }
            };
         * 遵循以上规范就行了，哈哈(总是包含有空格)
         */
        'space-before-function-paren': ["error", "always"],
        'space-before-blocks': ["error", "always"],
        'no-unused-vars': 0,
        'spaced-comment': 0,
        'keyword-spacing': ["error", { "after": true }],
        'func-call-spacing': ["error", "always", { "allowNewlines": true }],
        'space-in-parens': ["error", "always", { "exceptions": ["{}", "[]"] }],
        "no-else-return": ["error", {allowElseIf: true }],
        'no-useless-computed-key': 0,
        // 空行最多不能超过100行
        'no-multiple-empty-lines': [0, {"max": 100}],
        // 关闭禁止混用tab和空格
        'no-mixed-spaces-and-tabs': [0],
        "quotes": [0, "double"],
        // NodeJS 处理错误
        "handle-callback-err": 0,
        // off默认就是0
        eqeqeq: "off",
        // "no-extend-native": 2代表禁止扩展native对象，改成0就行了
        "no-extend-native": 0
    }
};
