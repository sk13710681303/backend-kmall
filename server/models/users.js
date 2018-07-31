'use strict';
/**
 * author: 小小游 ---> allen
 * date: 2018.05.24
 * lastUpdateDate: 2018.05.24
 * description: 个人用户信息表
 */
const mongoose = require ( 'mongoose' );
const Schema = mongoose.Schema;
const bcrypt = require ( 'bcrypt' );
const usersSchema = new Schema ({
    "userId": { type: String, unique: true, require: true },
    "userName": { type: String, unique: true, require: true },
    "userPwd": { type: String, require: true },
    "token": { type: String },
    "orderList": [{
        "orderId": { type: String },
        "invoiceName": { type: String },
        "freight": { type: Number },
        "createDate": { type: String },
        "orderTotal": { type: Number },
        "isPay": { type: Boolean },
        "addressInfo": {
            "receiveId": { type: String },
            "receiveName": { type: String },
            "receivePhone": { type: String },
            "receiveAreaCode": { type: String },
            "receiveSeatNumber": { type: String },
            "receiveProvinceId": { type: Number },
            "receiveProvince": { type: String },
            "receiveCityId": { type: Number },
            "receiveCity": { type: String },
            "receiveCountyId": { type: Number },
            "receiveCounty": { type: String },
            "receiveDetailsAddress": { type: String },
            "receiveDefaultSelectStatus": { type: Boolean },
            "isHide": { type: Boolean }
        },
        "goodsList": [{
            "productSkuId": { type: String },
            "productTitle": { type: String },
            "productSubTitle": { type: String },
            "productBallImg": { type: String },
            "productBigImg": { type: String },
            "productSmallImg": { type: String },
            "productPrice": { type: Number },
            "productNumber": { type: Number },
            "isChecked": { type: Boolean },
            "productMonthlySales": { type: Number },
            "productLimitNum": { type: Number },
            "productSpecJson": {
                "productImage": { type: String },
                "productShowName": { type: String }
            }
        }]
    }],
    "cartList": [{
        "productSkuId": { type: String },
        "productTitle": { type: String },
        "productSubTitle": { type: String },
        "productBallImg": { type: String },
        "productBigImg": { type: String },
        "productSmallImg": { type: String },
        "productPrice": { type: Number },
        "productNumber": { type: Number },
        "isChecked": { type: Boolean },
        "productMonthlySales": { type: Number },
        "productLimitNum": { type: Number },
        "productSpecJson": {
            "productImage": { type: String },
            "productShowName": { type: String }
        }
    }],
    "addressList": [{
        "receiveId": { type: String },
        "receiveName": { type: String },
        "receivePhone": { type: String },
        "receiveAreaCode": { type: String },
        "receiveSeatNumber": { type: String },
        "receiveProvinceId": { type: Number },
        "receiveProvince": { type: String },
        "receiveCityId": { type: Number },
        "receiveCity": { type: String },
        "receiveCountyId": { type: Number },
        "receiveCounty": { type: String },
        "receiveDetailsAddress": { type: String },
        "receiveDefaultSelectStatus": { type: Boolean },
        "isHide": { type: Boolean }
    }]
});

// 添加用户保存时中间件对userPwd进行bcrypt加密,这样保证用户密码只有用户本人知道
usersSchema.pre ( 'save', function ( next ) {
    var user = this;
    if ( this.isModified ( 'userPwd' ) || this.isNew ) {
        bcrypt.genSalt ( 10, function ( err, salt ) {
            if ( err ) {
                return next ( err );
            }
            bcrypt.hash ( user.userPwd, salt, function ( err, hash ) {
                if ( err ) {
                    return next ( err );
                }
                user.userPwd = hash;
                next ();
            });
        });
    } else {
        return next ();
    }
});

// 校验用户输入密码是否正确
usersSchema.methods.comparePassword = function ( passw, cb ) {
    bcrypt.compare ( passw, this.userPwd, ( err, isMatch ) => {
        if ( err ) {
            return cb ( err );
        }
        cb ( null, isMatch );
    });
};

module.exports = mongoose.model ( 'User', usersSchema, 'Users' );
