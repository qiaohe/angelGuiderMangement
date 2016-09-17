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
        sql = sql + ' order by ag.createDate desc limit ?, ?';
        return db.queryWithCount(sql, [page.from, page.size]);
    },
    findByMobile: function (mobile) {
        return db.query(sqlMapping.angelGuider.findByMobile, mobile)
    },
    findAgents: function () {
        return db.query(sqlMapping.angelGuider.findAgents)
    },
    updateAngelGuider: function (guider) {
        return db.query(sqlMapping.angelGuider.updateAngelGuider, [guider, guider.id]);
    },
    findById: function (id) {
        return db.query(sqlMapping.angelGuider.findById, id);
    },
    countOfAgency: function (guiderId) {
        return db.query(sqlMapping.angelGuider.countOfAgency, guiderId);
    },
    insertAccount: function (account) {
        return db.query(sqlMapping.account.insert, account);
    },
    findFeedback: function (page) {
        return db.queryWithCount(sqlMapping.feedback.findFeedback, [page.from, page.size]);
    },
    updateFeedback: function (feedback) {
        return db.query(sqlMapping.feedback.updateFeedback, [feedback, feedback.id]);
    },
    findGroupMessages: function (page) {
        return db.queryWithCount(sqlMapping.angelGuider.findGroupMessages, [page.from, page.size]);
    },
    insertGroupMessage: function (g) {
        return db.query(sqlMapping.angelGuider.insertGroupMessage, g);
    },
    findAngelGuiders: function (provId, cityId) {
        return db.query(sqlMapping.angelGuider.findAngelGuiders, [provId, cityId]);
    }
}
