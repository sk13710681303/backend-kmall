'use strict';
/**
 * author: 小小游 ---> allen
 * date: 2018.06.23
 * lastUpdateDate: 2018.06.23
 * description: 省市区二级路由逻辑文件
 */
const express = require ( 'express' );
const router = express.Router ();
const proCityAreaListData = require ( './../../client/mock/proCityAreaListData.json' );

// 查询省市区
router.get ( '/proCityAreaListData', ( req, res, next ) => {
    res.json ( proCityAreaListData );
});

module.exports = router;
