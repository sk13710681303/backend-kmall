'use strict';
/**
 * author: 小小游 ---> allen
 * date: 2018.05.11
 * lastUpdateDate: 2018.05.11
 * description: 商品列表页面二级路由逻辑文件
 */
const express = require ( 'express' );
const router = express.Router ();
const GoodsLists = require ( './../models/goodsLists' );
const GoodsDetails = require ( './../models/goodsDetails' );
const Users = require ( './../models/users' );

// 查询商品列表数据
router.get ( '/list', ( req, res, next ) => {
    // 获取页码
    let page = parseInt ( req.param ( 'page' ) );
    // 获取每页的条数
    let pageSize = parseInt ( req.param ( 'pageSize' ) );
    // 排序参数，1是升序，-1是降序
    let sort = req.param ( 'sort' );
    // 跳过多少条数据
    let skip = ( page - 1 ) * pageSize;

    // 价格过滤参数
    let priceLevel = req.param ( 'priceLevel' );
    let priceGt = '';
    let priceLte = '';

    // 查询的数据库参数
    let params = {};

    switch ( priceLevel ) {
    case '0':
        priceGt = 0;
        priceLte = 10000;
        break;
    case '1':
        priceGt = 0;
        priceLte = 500;
        break;
    case '2':
        priceGt = 500;
        priceLte = 1000;
        break;
    case '3':
        priceGt = 1000;
        priceLte = 2000;
        break;
    case '4':
        priceGt = 2000;
        priceLte = 5000;
        break;
    case '5':
        priceGt = 5000;
        priceLte = 10000;
        break;
    }

    params = {
        productPrice: {
            $gt: priceGt,
            $lte: priceLte
        }
    };

    // 对商品进行查询跳过、筛选操作
    let goodsListsModel = GoodsLists.find ( params ).skip ( skip ).limit ( pageSize );
    // 按价格排序
    goodsListsModel.sort ({ 'productPrice': sort });
    // exec的全称叫executed执行
    goodsListsModel.exec ( ( err, doc ) => {
        if ( err ) {
            res.json ({
                status: '1',
                msg: err.message
            });
        } else {
            res.json ({
                status: '0',
                msg: '',
                result: {
                    count: doc.length,
                    list: doc
                }
            });
        }
    });
});

// 查询商品详情数据
router.get ( '/details', ( req, res, next ) => {
    // 查询的数据库参数
    let params = {};
    GoodsDetails.find ( params, ( err, doc ) => {
        if ( err ) {
            res.json ({
                status: '1',
                msg: err.message
            });
        } else {
            res.json ({
                status: '0',
                msg: '',
                result: {
                    count: doc.length,
                    list: doc
                }
            });
        }
    });
});

// 点击加入购物车列表数据
router.post ( '/cartList', ( req, res, next ) => {
    // 首先这里是假设用户是已经登录了
    // let userId = '0904050123';
    let productSkuId = req.body.productSkuId;
    let token = req.headers.authorization;
    let params = { 'token': token };
    console.log ( 'productSkuId:' + productSkuId );

    Users.findOne ( params, ( err, UsersDoc ) => {
        if ( err ) {
            res.json ({
                status: "1",
                msg: err.message,
                result: ""
            });
        } else {
            if ( UsersDoc ) {
                let goodsItem = "";
                UsersDoc.cartList.forEach ( ( item ) => {
                    if ( item.productSkuId == productSkuId ) {
                        goodsItem = item;
                        item.productNumber++;
                    }
                });
                // 如果数据库里已经存在了，再执行一次保存操作即可
                if ( goodsItem ) {
                    UsersDoc.save ( ( err2, UsersDoc2 ) => {
                        if ( err2 ) {
                            res.json ({
                                status: "1",
                                msg: err.message,
                                result: ""
                            });
                        } else {
                            if ( UsersDoc2 ) {
                                res.json ({
                                    status: "0",
                                    msg: "",
                                    result: "save success"
                                });
                            }
                        }
                    });
                // 如果没有就执行下面的代码
                } else {
                    GoodsLists.findOne ({ "productSkuInfo.productSkuId": productSkuId }, ( err3, GoodsDoc3 ) => {
                        if ( err3 ) {
                            res.json ({
                                status: "1",
                                msg: err1.message,
                                result: ""
                            });
                        } else {
                            console.log ( "GoodsDoc3:" + GoodsDoc3 );
                            if ( GoodsDoc3 ) {
                                GoodsDoc3.productSkuInfo.forEach ( ( item ) => {
                                    if ( item.productSkuId == productSkuId ) {
                                        GoodsDoc3.productNumber = 1;
                                        GoodsDoc3.isChecked = true;
                                        UsersDoc.cartList.push ( item );
                                        UsersDoc.save ( ( err4, GoodsDoc4 ) => {
                                            if ( err4 ) {
                                                res.json ({
                                                    status: "1",
                                                    msg: err.message,
                                                    result: ""
                                                });
                                            } else {
                                                if ( GoodsDoc4 ) {
                                                    res.json ({
                                                        status: "0",
                                                        msg: "",
                                                        result: "save success"
                                                    });
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    });
});

module.exports = router;
