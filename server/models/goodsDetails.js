'use strict';
/**
 * author: 小小游 ---> allen
 * date: 2018.05.17
 * lastUpdateDate: 2018.05.17
 * description: 商品详情页实体类
 */
const mongoose = require ( 'mongoose' );
var Schema = mongoose.Schema;
var goodsDetailsSchema = new Schema ({
    "productSkuId": { type: String },
    "productTitle": { type: String },
    "productSubTitle": { type: String },
    "productBallImg": { type: String },
    "productBigImg": { type: String },
    "productSmallImg": { type: String },
    "productPrice": { type: Number },
    "productMonthlySales": { type: Number },
    "productLimitNum": { type: Number },
    "productSpecJson": {
        "productImage": { type: String },
        "productShowName": { type: String }
    },
    "productLittleImg": [
        { type: String },
        { type: String },
        { type: String },
        { type: String },
        { type: String }
    ],
    "productLargeImg": [
        { type: String },
        { type: String },
        { type: String },
        { type: String },
        { type: String }
    ],
    "productSkuColorList": [
        {
            "productSkuId": { type: String },
            "productImage": { type: String },
            "productLimitNum": { type: Number },
            "productShowName": { type: String }
        }
    ]
});

module.exports = mongoose.model ( 'GoodsDetail', goodsDetailsSchema, 'GoodsDetails' );
