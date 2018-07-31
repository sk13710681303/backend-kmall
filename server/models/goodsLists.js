'use strict';
/**
 * author: 小小游 ---> allen
 * date: 2018.05.11
 * lastUpdateDate: 2018.05.11
 * description: 商品列表页实体类
 */
const mongoose = require ( 'mongoose' );
var Schema = mongoose.Schema;
var goodsListsSchema = new Schema ({
    "productId": { type: String },
    "productName": { type: String },
    "productTitle": { type: String },
    "productPrice": { type: Number },
    "productNumber": { type: Number },
    "isChecked": { type: Boolean },
    "productMonthlySales": { type: Number },
    "productSkuInfo": [{
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
});

module.exports = mongoose.model ( 'GoodsList', goodsListsSchema, 'GoodsLists' );
