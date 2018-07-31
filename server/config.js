'use strict';
module.exports = {
    // used when we create and verify JSON Web Tokens
    // 在创建和验证JSON Web令牌时使用
    'jwtsecret': 'learnRestApiwithNickj',
    // 数据库的名字
    'databaseName': 'kaiyouMall',
    // 连接本地MongoDB数据库
    'localDatabaseConnect': 'mongodb://root:123456@127.0.0.1:27017/kaiyouMall',
    // 连接线上MongoDB数据库
    'serverDatabaseConnect': 'mongodb://kaiyou_mall_runner:kymall123456@120.77.146.144:27017/kaiyouMall',
    // MongoDB数据库连接成功
    'databaseConnected': 'MongoDB connected success.',
    // MongoDB数据库连接失败
    'databaseError': 'MongoDB connected fail.',
    // MongoDB数据库连接断开
    'databaseDisconnected': 'MongoDB connected disconnected.'
};
