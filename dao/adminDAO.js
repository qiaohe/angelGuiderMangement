"use strict";
var db = require('../common/db');
var sqlMapping = require('./sqlMapping');
module.exports = {
    findByUserName: function (userName) {
        return db.query(sqlMapping.admin.findByUserName, userName);
    },
    updateAdminPassword: function (password, userName) {
        return db.query(sqlMapping.admin.updateAdminPassword, [password, userName]);
    },
    findUsers: function (page) {
        return db.queryWithCount(sqlMapping.admin.findAll, [page.from, page.size]);
    },
    insertUser: function (user) {
        return db.query(sqlMapping.admin.insert, user);
    },
    updateUser: function (user) {
        return db.query(sqlMapping.admin.update, [user, user.id]);
    },
    deleteUser: function (id) {
        return db.query(sqlMapping.admin.delete, id);
    }
}
