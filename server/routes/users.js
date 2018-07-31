'use strict';
const express = require ( 'express' );
const router = express.Router ();
const Users = require ( './../models/users' );
const jwt = require ( 'jsonwebtoken' );
const config = require ( '../config' );
const passport = require ( 'passport' );
require ( '../passport' ) ( passport );
require ( './../util/util' );

/* GET users listing. */
router.get ( '/', function ( req, res, next ) {
    res.send ( 'respond with a resource' );
});

// 用户注册接口
router.post ( '/register', ( req, res, next ) => {
    // 获取post数据中userName的值
    let userName = req.body.userName;
    // 获取post数据中userPwd的值
    let userPwd = req.body.userPwd;

    if ( !userName || !userPwd ) {
        res.json ({
            status: "1",
            msg: "请输入您的账号密码！",
            result: ""
        });
    }

    // 同理：/login 路径的处理方式
    Users.findOne ({ userName: userName }, ( err, user ) => {
        if ( err ) {
            res.json ({
                status: "1",
                msg: "网络异常错误！",
                result: ""
            });
        } else if ( user ) {
            res.json ({
                status: "1",
                msg: "用户名已存在！",
                result: ""
            });
        } else {
            let orderList = [];
            let cartList = [];
            let addressList = [];
            // 创建一组user对象置入model
            let newUsers = new Users ({
                userId: Math.floor ( Math.random () * 10 + 1 ),
                userName: userName,
                userPwd: userPwd,
                orderList: orderList,
                cartList: cartList,
                addressList: addressList
            });

            newUsers.save ( ( err2, user2 ) => {
                if ( err2 ) {
                    res.json ({
                        status: "1",
                        msg: '抱歉，注册失败！',
                        result: ""
                    });
                } else {
                    if ( user2 ) {
                        res.json ({
                            status: "0",
                            msg: '恭喜，注册成功！',
                            result: ""
                        });
                    }
                }
            });
        }
    });
});

// 用户登录接口，检查用户名与密码并生成一个token并验证通过
router.post ( '/login', ( req, res, next ) => {
    // 获取post数据中userName的值
    let userName = req.body.userName;
    // 获取post数据中userPwd的值
    let userPwd = req.body.userPwd;
    // 通过此model以用户名的条件来查询数据库中的匹配信息
    Users.findOne ({
        userName: userName
    }, ( err, user ) => {
        if ( err ) {
            res.json ({
                status: "1",
                msg: err.message,
                result: ""
            });
        }
        // 查询不到用户名匹配信息，则用户名不存在
        if ( !user ) {
            res.json ({
                status: "1",
                msg: "认证失败,用户不存在！",
                result: ""
            });
        } else if ( user ) {
            // 检查密码是否正确
            user.comparePassword ( userPwd, ( err, isMatch ) => {
                if ( isMatch && !err ) {
                    var token = jwt.sign ({
                        userName: user.userName
                    }, config.jwtsecret, {
                        // 授权时效24小时
                        expiresIn: 60 * 3
                    });
                    user.token = token;
                    user.save ( function ( err ) {
                        if ( err ) {
                            res.send ( err );
                        }
                    });
                    res.json ({
                        status: "0",
                        msg: '恭喜，验证成功!',
                        result: user
                    });
                    // 查询到匹配用户名的信息，但相应的userPwd属性不匹配
                } else {
                    res.json ({
                        status: "1",
                        msg: "认证失败,密码错误!",
                        result: ""
                    });
                }
            });
        }
    });
});

// 用户登出接口
router.post ( '/logout', ( req, res, next ) => {
    Users.findOne ( { 'token': req.headers.authorization }, ( err, user ) => {
        // 这里用户的时候除了把token清空之后还要做啥操作吗?
        user.token = "";
        user.save ( ( err2, user2 ) => {
            if ( user2 ) {
                res.json ({
                    status: "0",
                    msg: "用户已登出!",
                    result: ""
                });
            }
        });
    });
});

// 获取用户信息
router.get ( '/getUserInfo', ( req, res, next ) => {
    let token = req.headers.authorization;
    let params = { 'token': token };
    Users.findOne ( params, ( err, user ) => {
        if ( err ) {
            res.json ({
                status: "1",
                msg: "获取用户信息fail!",
                result: ""
            });
        } else {
            if ( user ) {
                res.json ({
                    status: "0",
                    msg: "获取用户信息success!",
                    result: user || ''
                });
            }
        }
    });
});

// 获取购物车的某个用户下的商品数量
router.get ( '/getCartCount', ( req, res, next ) => {
    let token = req.headers.authorization;
    let params = { 'token': token };
    Users.findOne ( params, ( err, user ) => {
        if ( err ) {
            res.json ({
                status: "1",
                msg: err.message,
                result: ""
            });
        } else {
            if ( user ) {
                let cartList = user.cartList;
                let cartCount = 0;
                cartList.forEach ( ( item ) => {
                    cartCount += parseInt ( item.productNumber );
                });
                res.json ({
                    status: "0",
                    msg: "",
                    result: cartCount
                });
            }
        }
    });
});

// 查看购物车中的商品
router.get ( '/cartList', ( req, res, next ) => {
    let token = req.headers.authorization;
    let params = { 'token': token };
    Users.findOne ( params, ( err, user ) => {
        if ( err ) {
            res.json ({
                status: "1",
                msg: err.message,
                result: ""
            });
        } else {
            if ( user ) {
                res.json ({
                    status: "0",
                    msg: "",
                    result: user.cartList
                });
            }
        }
    });
});

// 删除购物车中的某件商品
router.post ( '/cart/del', ( req, res, next ) => {
    let token = req.headers.authorization;
    let productSkuId = req.body.productSkuId;
    Users.update ({
        'token': token
    }, {
        $pull: {
            'cartList': {
                'productSkuId': productSkuId
            }
        }
    }, ( err, user ) => {
        if ( err ) {
            res.json ({
                status: "1",
                msg: err.message,
                result: ""
            });
        } else {
            if ( user ) {
                res.json ({
                    status: "0",
                    msg: "",
                    result: "delCartData success！"
                });
            }
        }
    });
});

// 编辑购物车中的增减数量和商品选中状态
router.post ( '/cart/edit', ( req, res, next ) => {
    let token = req.headers.authorization;
    let params = { 'token': token };
    let productSkuId = req.body.productSkuId;
    let productNumber = req.body.productNumber;
    let isChecked = req.body.isChecked;
    // mongoose里面update方法是非常强大的
    Users.update ({ params, 'cartList.productSkuId': productSkuId }, {
        'cartList.$.productNumber': productNumber,
        'cartList.$.isChecked': isChecked
    }, ( err, user ) => {
        if ( err ) {
            res.json ({
                status: "1",
                msg: err.message,
                result: ""
            });
        } else {
            if ( user ) {
                res.json ({
                    status: "0",
                    msg: "",
                    result: "edit operator success！"
                });
            }
        }
    });
});

// 点击全选将选中状态值保存进数据库里
router.post ( '/cart/checkAll', ( req, res, next ) => {
    let token = req.headers.authorization;
    let params = { 'token': token };
    let checkAllFlag = req.body.checkAllFlag;
    Users.findOne ( params, ( err, user ) => {
        if ( err ) {
            res.json ({
                status: "1",
                msg: err.message,
                result: ""
            });
        } else {
            if ( user ) {
                user.cartList.forEach ( ( item ) => {
                    item.isChecked = checkAllFlag;
                });

                // 保存数据库
                user.save ( ( err2, user2 ) => {
                    if ( err2 ) {
                        res.json ({
                            status: "1",
                            msg: err.message,
                            result: ""
                        });
                    } else {
                        if ( user2 ) {
                            res.json ({
                                status: "0",
                                msg: "",
                                result: "checkAllStatus save success！"
                            });
                        }
                    }
                });
            }
        }
    });
});

// 点击删除所有选中的购物车商品
router.post ( '/cart/isChecked', ( req, res, next ) => {
    let token = req.headers.authorization;
    let params = { 'token': token };
    let isChecked = req.body.isChecked;

    Users.update ( params, {
        '$pull': {
            'cartList': {
                'isChecked': isChecked
            }
        }
    }, ( err, user ) => {
        if ( err ) {
            res.json ({
                status: "1",
                msg: err.message,
                result: ""
            });
        } else {
            if ( user ) {
                res.json ({
                    status: "0",
                    msg: "",
                    result: "delete AllCheckedData success！"
                });
            }
        }
    });
});

// 点击获取某个用户下的所有地址信息列表
router.get ( '/getAddressInfoList', ( req, res, next ) => {
    let token = req.headers.authorization;
    let params = { 'token': token };
    Users.findOne ( params, ( err, user ) => {
        if ( err ) {
            res.json ({
                status: "1",
                msg: err.message,
                result: ""
            });
        } else {
            if ( user ) {
                res.json ({
                    status: "0",
                    msg: "",
                    result: user.addressList
                });
            }
        }
    });
});

// 点击设置默认地址并保存数据库
router.post ( '/setDefaultAddress', ( req, res, next ) => {
    let token = req.headers.authorization;
    let params = { 'token': token };
    let receiveId = req.body.receiveId;
    if ( !receiveId ) {
        res.json ({
            status: "10003",
            msg: "地址是空的！",
            result: ""
        });
    } else {
        Users.findOne ( params, ( err, user ) => {
            if ( err ) {
                res.json ({
                    status: "1",
                    msg: err.message,
                    result: ""
                });
            } else {
                if ( user ) {
                    let addressList = user.addressList;
                    addressList.forEach ( ( item ) => {
                        if ( item.receiveId == receiveId ) {
                            item.receiveDefaultSelectStatus = true;
                        } else {
                            item.receiveDefaultSelectStatus = false;
                        }
                    });

                    user.save ( ( err2, user2 ) => {
                        if ( err2 ) {
                            res.json ({
                                status: "1",
                                msg: err.message,
                                result: ""
                            });
                        } else {
                            if ( user2 ) {
                                res.json ({
                                    status: "0",
                                    msg: "",
                                    result: ""
                                });
                            }
                        }
                    });
                }
            }
        });
    }
});

// 点击添加收获地址并保存数据库
router.post ( '/saveHarvestAddress', ( req, res, next ) => {
    let token = req.headers.authorization;
    let params = { 'token': token };
    let receiveInfoData = req.body.receiveInfoData;

    Users.findOne ( params, ( err, user ) => {
        if ( err ) {
            res.json ({
                status: "1",
                msg: err.message,
                result: ""
            });
        } else {
            if ( user ) {
                user.addressList.push ({
                    receiveId: new Date ().getTime (),
                    receiveName: receiveInfoData.receiveName,
                    receivePhone: receiveInfoData.receivePhone,
                    receiveAreaCode: receiveInfoData.receiveAreaCode,
                    receiveSeatNumber: receiveInfoData.receiveSeatNumber,
                    receiveProvinceId: receiveInfoData.receiveProvinceId,
                    receiveProvince: receiveInfoData.receiveProvince,
                    receiveCityId: receiveInfoData.receiveCityId,
                    receiveCity: receiveInfoData.receiveCity,
                    receiveCountyId: receiveInfoData.receiveCountyId,
                    receiveCounty: receiveInfoData.receiveCounty,
                    receiveDetailsAddress: receiveInfoData.receiveDetailsAddress,
                    receiveDefaultSelectStatus: false,
                    isHide: true
                });

                user.save ( ( err2, user2 ) => {
                    if ( err2 ) {
                        res.json ({
                            status: "1",
                            msg: err.message,
                            result: ""
                        });
                    } else {
                        if ( user2 ) {
                            res.json ({
                                status: "0",
                                msg: "",
                                result: "New address is saved！"
                            });
                        }
                    }
                });
            }
        }
    });
});

// 点击编辑收获地址并保存数据库
router.post ( '/editHarvestAddress', ( req, res, next ) => {
    let token = req.headers.authorization;
    let params = { 'token': token };
    let receiveInfoData = req.body.receiveInfoData;

    Users.findOne ( params, ( err, user ) => {
        if ( err ) {
            res.json ({
                status: "1",
                msg: err.message,
                result: ""
            });
        } else {
            if ( user ) {
                let index = false;
                user.addressList.forEach ( ( item, i ) => {
                    if ( item.receiveDefaultSelectStatus && receiveInfoData.receiveDefaultSelectStatus ) {
                        item.receiveDefaultSelectStatus = false;
                    }
                    if ( item.receiveId === receiveInfoData.receiveId && typeof index === 'boolean' ) {
                        index = i;
                    }
                });
                if ( receiveInfoData.receiveDefaultSelectStatus ) {
                    receiveInfoData.receiveDefaultSelectStatus = true;
                }
                receiveInfoData.isHide = true;
                user.addressList[index] = receiveInfoData;

                user.save ( ( err2, user2 ) => {
                    if ( err2 ) {
                        res.json ({
                            status: "1",
                            msg: err.message,
                            result: ""
                        });
                    } else {
                        if ( user2 ) {
                            res.json ({
                                status: "0",
                                msg: "",
                                result: "All address default is false！"
                            });
                        }
                    }
                });
            }
        }
    });
});

// 点击删除收获地址并保存数据库
router.post ( '/address/del', ( req, res, next ) => {
    let token = req.headers.authorization;
    let receiveId = req.body.receiveId;
    Users.update ({
        'token': token
    }, {
        $pull: {
            'addressList': {
                'receiveId': receiveId
            }
        }
    }, ( err, user ) => {
        if ( err ) {
            res.json ({
                status: "1",
                msg: err.message,
                result: ""
            });
        } else {
            if ( user ) {
                res.json ({
                    status: "0",
                    msg: "",
                    result: "delAddressData success！"
                });
            }
        }
    });
});

// 点击提交订单，跳转订单支付页，将数据带过来保存数据库
router.post ( '/submitOrder', ( req, res, next ) => {
    let token = req.headers.authorization;
    let params = { 'token': token };

    // 所有商品的总价格
    let checkedAllSumPrice = req.body.checkedAllSumPrice;

    // 运费
    let checkFreight = req.body.checkFreight;

    // 发票名称
    let invoiceName = req.body.invoiceName;

    // 提交地址信息
    let receiveInfoData = req.body.receiveInfoData;
    console.log ( "receiveInfoData.receiveName:" + receiveInfoData.receiveName );

    Users.findOne ( params, ( err, user ) => {
        if ( err ) {
            res.json ({
                status: "1",
                msg: err.message,
                result: ""
            });
        } else {
            if ( user ) {
                // 获取当前用户下的地址信息
                let address = '';
                user.addressList.forEach ( ( item ) => {
                    if ( item.receiveId == receiveInfoData.receiveId ) {
                        address = item;
                    }
                });

                // 获取当前用户下的购物车数据
                let goodsList = [];
                user.cartList.forEach ( ( item ) => {
                    if ( item.isChecked ) {
                        goodsList.push ( item );
                    }
                });

                // 创建一个平台码
                let platform = '622';
                // 生成两个0-9的随机数
                let r1 = Math.floor ( Math.random () * 10 );
                let r2 = Math.floor ( Math.random () * 10 );

                // 创建系统时间
                let sysDate = new Date ().Format ( 'yyyyMMddhhmmss' );
                let createDate = new Date ().Format ( 'yyyy-MM-dd hh:mm:ss' );
                let orderId = platform + r1 + sysDate + r2;

                // 正式创建订单
                let order = {
                    // 订单编号
                    orderId: orderId,
                    // 订单总金额
                    orderTotal: checkedAllSumPrice,
                    // 运费
                    freight: checkFreight,
                    // 发票名称
                    invoiceName: invoiceName,
                    // 地址信息
                    addressInfo: address,
                    // 购物车数据
                    goodsList: goodsList,
                    // 是否支付成功，默认为false
                    isPay: false,
                    // 订单创建日期
                    createDate: createDate
                };

                user.orderList.push ( order );

                user.save ( ( err2, user2 ) => {
                    if ( err2 ) {
                        res.json ({
                            status: "1",
                            msg: err.message,
                            result: ""
                        });
                    } else {
                        if ( user2 ) {
                            res.json ({
                                status: "0",
                                msg: "",
                                // 将订单编号和订单总金额返回给前端
                                result: {
                                    orderId: order.orderId,
                                    orderTotal: order.orderTotal
                                }
                            });
                        }
                    }
                });
            }
        }
    });
});

// 根据订单Id查询订单信息
router.get ( '/orderDetails', ( req, res, next ) => {
    let token = req.headers.authorization;
    let params = { 'token': token };
    let orderId = req.param ( "orderId" );
    Users.findOne ( params, ( err, user ) => {
        if ( err ) {
            res.json ({
                status: "1",
                msg: err.message,
                result: ""
            });
        } else {
            if ( user ) {
                var orderList = user.orderList;
                // 有数据进行遍历
                if ( orderList.length > 0 ) {
                    let orderInfo = '';
                    let orderTotal = 0;
                    orderList.forEach ( ( item ) => {
                        if ( item.orderId == orderId ) {
                            orderInfo = item;
                            orderTotal = item.orderTotal;
                        }
                    });
                    // 判断下如果订单总金额是大于0的，表示success
                    if ( orderTotal > 0 ) {
                        res.json ({
                            status: "0",
                            msg: "",
                            result: {
                                orderId: orderId,
                                orderInfo: orderInfo
                            }
                        });
                    } else {
                        res.json ({
                            status: "120002",
                            msg: "查无此订单！",
                            result: ""
                        });
                    }
                    // 没有数据直接返回
                } else {
                    res.json ({
                        status: "120001",
                        msg: "当前用户下未创建订单！",
                        result: ""
                    });
                }
            } else {
                res.json ({
                    status: "100004",
                    msg: "不存在此用户！",
                    result: ""
                });
            }
        }
    });
});

// 查询某个用户下所有的订单信息
router.get ( '/orderList', ( req, res, next ) => {
    let token = req.headers.authorization;
    let params = { 'token': token };
    Users.findOne ( params, ( err, user ) => {
        if ( err ) {
            res.json ({
                status: "1",
                msg: err.message,
                result: ""
            });
        } else {
            // 如果存在这个用户
            if ( user ) {
                let orderList = user.orderList;
                res.json ({
                    status: "0",
                    msg: "",
                    result: {
                        orderList: orderList
                    }
                });
            } else {
                res.json ({
                    status: "100004",
                    msg: "不存在此用户！",
                    result: ""
                });
            }
        }
    });
});

// 订单支付成功接口
router.get ( '/isPaymentSuccess', ( req, res, next ) => {
    let token = req.headers.authorization;
    let params = { 'token': token };
    let orderId = req.param ( "orderId" );
    Users.findOne ( params, ( err, user ) => {
        if ( err ) {
            res.json ({
                status: "1",
                msg: err.message,
                result: ""
            });
        } else {
            // 如果存在这个用户
            if ( user ) {
                let orderList = user.orderList;
                if ( orderList.length > 0 ) {
                    orderList.forEach ( ( order ) => {
                        if ( order.orderId == orderId ) {
                            order.isPay = true;
                            return;
                        }
                        console.log ( "看看是否现在支付成功了！" );
                    });

                    user.save ( ( err2, user2 ) => {
                        if ( err2 ) {
                            res.json ({
                                status: "1",
                                msg: err.message,
                                result: ""
                            });
                        } else {
                            if ( user2 ) {
                                res.json ({
                                    status: "0",
                                    msg: "恭喜您，支付成功了！",
                                    result: ""
                                });
                            }
                        }
                    });
                }
            } else {
                res.json ({
                    status: "100004",
                    msg: "不存在此用户！",
                    result: ""
                });
            }
        }
    });
});

// 删除某个用户下的某个订单列表数据
router.post ( '/delOrder', ( req, res, next ) => {
    let token = req.headers.authorization;
    let orderId = req.body.orderId;
    Users.update ({
        'token': token
    }, {
        $pull: {
            'orderList': {
                'orderId': orderId
            }
        }
    }, ( err, user ) => {
        if ( err ) {
            res.json ({
                status: "1",
                msg: err.message,
                result: ""
            });
        } else {
            if ( user ) {
                res.json ({
                    status: "0",
                    msg: "",
                    result: "delete orderData success！"
                });
            }
        }
    });
});

module.exports = router;
