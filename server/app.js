'use strict';
const createError = require ( 'http-errors' );
const express = require ( 'express' );
const path = require ( 'path' );
// const ejs = require ( 'ejs' );
const cookieParser = require ( 'cookie-parser' );
const multer = require ( 'multer' );
// express-session模块
const expressSession = require ( 'express-session' );
// 解析body字段模块
const bodyParser = require ( 'body-parser' );
// 命令行log显示
const morgan = require ( 'morgan' );
// mongoose模块
const mongoose = require ( 'mongoose' );
// 使用jwt签名
const jwt = require ( 'jsonwebtoken' );
// 用户认证模块passport
const passport = require ( 'passport' );
// token验证模块
const Strategy = require ( 'passport-http-bearer' ).Strategy;
// 所有路由配置
const routes = require ( './routes' );
// 数据库配置
const config = require ( './config' );
// 创建application
const app = express ();
// 用户表
const Users = require ( './models/users' );

// app.use ( bodyParser.urlencoded ({ extended: false }) );
// 在原有的基础上加上下面代码即可
// app.use ( bodyParser.json () );

// view engine setup
app.set ( 'views', path.join ( __dirname, 'views/' ) );
// app.engine ( '.html', require ( 'ejs' ).renderFile );
app.set ( 'view engine', 'ejs' );
// app.engine ( 'html', ejs.__express );

let port = process.env.PORT || 3000;

// 初始化passport模块
app.use ( passport.initialize () );
// 命令行中显示程序运行日志,便于bug调试
app.use ( morgan ( 'dev' ) );

// 设置superSecret全局参数
app.set ( 'superSecret', config.jwtsecret );

app.use ( bodyParser.urlencoded ({ extended: false }) );
// 调用bodyParser模块以便程序正确解析body传入值
app.use ( bodyParser.json () );
app.use ( multer () );
app.use ( cookieParser () );
app.set ( 'trust proxy', 1 );

app.use ( express.static ( path.join ( __dirname, 'public' ) ) );

// 全局拦截登录操作
app.use ( ( req, res, next ) => {
    let token = req.headers.authorization;
    if ( req.originalUrl == '/users/register' ||
        req.originalUrl == '/users/login' ||
        req.originalUrl == '/pcas/proCityAreaListData' ||
        req.originalUrl.indexOf ( '/goodsLists/list' ) > -1 ) {
        next ();
    } else {
        if ( !token ) {
            res.json ({
                status: "10001",
                msg: "当前用户未登录",
                result: ""
            });
        } else {
            // 如果存在token，那么表示用户登录了，调用next()方法
            Users.findOne ( { 'token': token }, ( err, user ) => {
                if ( user ) {
                    next ();
                } else {
                    res.json ({
                        status: "10001",
                        msg: "当前用户未登录",
                        result: err || ""
                    });
                }
            });
        }
    }
});

routes ( app );

mongoose.Promise = global.Promise;

// 连接MongoDB数据库
mongoose.connect ( config.localDatabaseConnect );

// MongoDB数据库连接成功
mongoose.connection.on ( 'connected', () => {
    console.log ( config.databaseConnected );
});

// MongoDB数据库连接失败
mongoose.connection.on ( 'error', () => {
    console.log ( config.databaseError );
});

// MongoDB数据库连接断开
mongoose.connection.on ( 'disconnected', () => {
    console.log ( config.databaseDisconnected );
});

// catch 404 and forward to error handler
app.use ( function ( req, res, next ) {
    next ( createError ( 404 ) );
});

// error handler
app.use ( function ( err, req, res, next ) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get ( 'env' ) === 'development' ? err : {};

    // render the error page
    res.status ( err.status || 500 );
    res.render ( 'error' );
});

// 开启监听服务
app.listen ( port, () => {
    console.log ( 'JWT测试服务已经开启地址： http://localhost:' + port );
});
