/**
 * Created by Johnson on 2016/7/7.
 */
"use strict";
var db = require('../common/db');
var sqlMapping = require('./sqlMapping');
module.exports = {
    insert: function (guider) {
        return db.query(sqlMapping.angelGuider.insert, guider);
    },
    findAll: function (page, conditions) {
        var sql = sqlMapping.angelGuider.findAll;
        if (conditions.length) sql = sql + ' where ' + conditions.join(' and ');
        sql = sql + ' order by createDate desc limit ?, ?';
        return db.queryWithCount(sql, [page.from, page.size]);
    },
    findByMobile: function (mobile) {
        return db.query(sqlMapping.angelGuider.findByMobile, mobile)
    }
}
