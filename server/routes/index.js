'use strict';
module.exports = ( app ) => {
    /* GET home page. */
    app.get ( '/', function ( req, res, next ) {
        res.render ( 'index', { title: 'Express' });
    });

    // 在所有goodsLists路由前加上一级路由/goodsLists
    app.use ( '/goodsLists', require ( './goodsLists' ) );

    // 在所有users路由前加上一级路由/users
    app.use ( '/users', require ( './users' ) );

    // 在省市区路由前加上一级路由/pcas
    app.use ( '/pcas', require ( './pcasLists' ) );
};
