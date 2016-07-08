"use strict";
var db = require('../common/db');
var sqlMapping = require('./sqlMapping');
module.exports = {
    findByUserName: function (userName) {
        return db.query(sqlMapping.admin.findByUserName, userName);
    },
    updateAdminPassword: function(password, userName) {
        return db.query(sqlMapping.admin.updateAdminPassword, [password, userName]);
    }
}
