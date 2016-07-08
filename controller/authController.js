"use strict";
var md5 = require('md5');
var redis = require('../common/redisClient');
var config = require('../config');
var adminDAO = require('../dao/adminDAO');
var i18n = require('../i18n/localeMessage');
var _ = require('lodash');
var moment = require('moment');
var uuid = require('node-uuid');
module.exports = {
    login: function (req, res, next) {
        var userName = (req.body && req.body.username) || (req.query && req.query.username);
        var password = (req.body && req.body.password) || (req.query && req.query.password);
        var user = {};
        adminDAO.findByUserName(userName).then(function (users) {
            if (!users || !users.length) throw new Error(i18n.get('member.not.exists'));
            user = users[0];
            if (user.password != md5(password)) throw new Error(i18n.get('member.password.error'));
            var token = uuid.v4();
            redis.set('angel:admin:' + token, JSON.stringify(user));
            redis.expire('angel:admin:' + token, config.app.tokenExpire);
            user.token = token;
            res.send({ret: 0, data: user});
        }).catch(function (err) {
            res.send({ret: 1, message: err.message});
        });
        return next();
    },

    logout: function (req, res, next) {
        var token = req.headers['token'];
        if (!token) return res.send(401, i18n.get('token.not.provided'));
        redis.delAsync('angel:admin:' + token).then(function () {
            res.send({ret: 0, message: i18n.get('logout.success')});
        }).catch(function (err) {
            res.send({ret: 1, message: err.message});
        });
        return next();
    },
    resetPwd: function (req, res, next) {
        var that = this;
        var userName = req.body.username;
        var newPwd = req.body.password;
        adminDAO.updateAdminPassword(md5(newPwd), userName).then(function (result) {
            return adminDAO.findByUserName(userName);
        }).then(function (users) {
            if (!users || !users.length) throw new Error(i18n.get('member.not.exists'));
            var user = users[0];
            if (user.password != md5(newPwd)) throw new Error(i18n.get('member.password.error'));
            var token = uuid.v4();
            redis.set('angel:admin:' + token, JSON.stringify(user));
            redis.expire('angel:admin:' + token, config.app.tokenExpire);
            user.token = token;
            res.send({ret: 0, data: user});
        }).catch(function (err) {
            res.send({ret: 1, message: err.message});
        });
        return next();
    }
}