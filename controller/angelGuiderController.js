"use strict";
var config = require('../config');
var _ = require('lodash');
var md5 = require('md5');
var angelGuiderDAO = require('../dao/angelGuiderDAO');
var i18n = require('../i18n/localeMessage');
module.exports = {
    addAngelGuider: function (req, res, next) {
        var angelGuider = req.body;
        angelGuiderDAO.findByMobile(req.body.mobile).then(function (angels) {
            if (!angels || angels.length > 0) throw new Error(i18n.get('user.mobile.exists'));
            return angelGuiderDAO.insert(_.assign(angelGuider, {
                createDate: new Date(),
                status: 0,
                balance: 0,
                password: md5(angelGuider.password)
            }));
        }).then(function (result) {
            angelGuider.id = result.insertId;
            res.send({ret: 0, data: angelGuider});
        }).catch(function (err) {
            res.send({ret: 1, message: err.message});
        });
        return next();
    },
    getAngelGuiders: function (req, res, next) {
        var conditions = [];
        var pageIndex = +req.query.pageIndex;
        var pageSize = +req.query.pageSize;
        if (req.query.name) conditions.push('name like \'%' + req.query.name + '%\'');
        if (req.query.provId) conditions.push('provId=\'' + req.query.provId + '\'');
        if (!!req.query.agency) conditions.push('agency=\'' + req.query.agency + '\'');
        conditions.push(!!req.query.onlyAgency ? 'agency is null' : 'agency is not null');
        if (req.query.cityId) conditions.push('cityId=\'' + req.query.cityId + '\'');
        if (req.query.status) conditions.push('status=\'' + req.query.status + '\'');
        angelGuiderDAO.findAll({
            from: (pageIndex - 1) * pageSize,
            size: pageSize
        }, conditions).then(function (angels) {
            angels.rows && angels.rows.forEach(function (item) {
                item.status = config.angelGuiderStatus[item.status];
                item.gender = config.gender[item.status];
            });
            angels.pageIndex = pageIndex;
            res.send({ret: 0, data: angels});
        }).catch(function (err) {
            res.send({ret: 1, message: err.message});
        });
        return next();
    }
}

