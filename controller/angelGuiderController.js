"use strict";
var config = require('../config');
var _ = require('lodash');
var angelGuiderDAO = require('../dao/angelGuiderDAO');
var i18n = require('../i18n/localeMessage');
var Promise = require('bluebird');
var redis = require('../common/redisClient');
var moment = require('moment');
var pusher = require('../domain/NotificationPusher');
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
            return angelGuiderDAO.insertAccount({
                uid: angelGuider.id,
                updateDate: new Date(),
                accountNo: 'A' + moment().format('YYMMDD') + '-' + angelGuider.id,
                accountName: req.body.realName,
                balance: 0.00,
                availableBalance: 0.00,
                status: 0,
                type: 0
            });
        }).then(function (result) {
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
        if (req.query.name) conditions.push('ag.name like \'%' + req.query.name + '%\'');
        if (req.query.realName) conditions.push('ag.realName like \'%' + req.query.realName + '%\'');
        if (req.query.provId) conditions.push('ag.provId=\'' + req.query.provId + '\'');
        if (!!req.query.agency) conditions.push('ag.agency=\'' + req.query.agency + '\'');
        conditions.push((req.query.onlyAgency && +req.query.onlyAgency == 1) ? 'agency is null' : 'agency is not null');
        if (req.query.cityId) conditions.push('ag.cityId=\'' + req.query.cityId + '\'');
        if (req.query.status) conditions.push('ag.status=\'' + req.query.status + '\'');
        angelGuiderDAO.findAll({
            from: (pageIndex - 1) * pageSize,
            size: pageSize
        }, conditions).then(function (angels) {
            angels.rows && angels.rows.forEach(function (item) {
                item.status = config.angelGuiderStatus[item.status];
                item.gender = config.gender[item.gender];
            });
            Promise.map(angels.rows, function (item) {
                if (req.query.onlyAgency && +req.query.onlyAgency == 1) {
                    return angelGuiderDAO.countOfAgency(item.id).then(function (angelCount) {
                        item.guiderCount = angelCount[0].count;
                        return redis.getAsync('u:' + item.id + ':r').then(function (reply) {
                            item.totalRegistrationCount = (reply == null ? 0 : +reply);
                        })
                    })
                }
                return redis.getAsync('u:' + item.id + ':r').then(function (reply) {
                    item.totalRegistrationCount = (reply == null ? 0 : +reply);
                })
            }).then(function (result) {
                angels.pageIndex = pageIndex;
                res.send({ret: 0, data: angels});
            })
        }).catch(function (err) {
            res.send({ret: 1, message: err.message});
        });
        return next();
    },
    getAngelGuiderById: function (req, res, next) {
        angelGuiderDAO.findById(req.params.id).then(function (angelGuiders) {
            res.send({ret: 0, data: angelGuiders[0]})
        }).catch(function (err) {
            res.send({ret: 1, message: err.message})
        });
        return next();
    },
    updateAngelGuider: function (req, res, next) {
        var angelGuider = req.body;
        if (angelGuider.password) angelGuider.password = md5(angelGuider.password);
        angelGuiderDAO.updateAngelGuider(angelGuider).then(function (result) {
            res.send({ret: 0, message: '更新成功'})
        });
        return next();
    },
    getAgents: function (req, res, next) {
        angelGuiderDAO.findAgents().then(function (agents) {
            res.send({ret: 0, data: agents});
        }).catch(function (err) {
            res.send({ret: 1, err: err.message});
        });
        return next();
    },
    getAgentById: function (req, res, next) {
        angelGuiderDAO.findById(req.params.id).then(function (agents) {
            res.send({ret: 0, data: agents[0]})
        }).catch(function (err) {
            res.send({ret: 0, message: err.message})
        });
        return next();
    },
    getFeedback: function (req, res, next) {
        var pageIndex = +req.query.pageIndex;
        var pageSize = +req.query.pageSize;
        angelGuiderDAO.findFeedback({
            from: (pageIndex - 1) * pageSize,
            size: pageSize
        }).then(function (fb) {
            fb.pageIndex = pageIndex;
            res.send({ret: 0, data: fb});
        });
        return next();
    },
    updateFeedback: function (req, res, next) {
        var fb = req.body;
        fb.treated = 1;
        angelGuiderDAO.updateFeedback(fb).then(function (result) {
            res.send({ret: 0, message: '更新处理意见成功。'})
        }).catch(function (err) {
            res.send({ret: 1, message: err.message})
        });
        return next();
    },

    addGroupMessage: function (req, res, next) {
        var g = req.body;
        g = _.assign(g, {createDate: new Date(), sender: req.user.id, senderName: req.user.realName});
        angelGuiderDAO.addGroupMessage(g).then(function (result) {
            g.id = result.insertId;
            return angelGuiderDAO.findAngelGuiders(g.provId, g.cityId);
        }).then(function (guiders) {
            guiders && guiders.length && guiders.forEach(function (guider) {
                pusher.push({
                    body: gm.content,
                    uid: guider.uid,
                    title: g.title,
                    type: 1,
                    audience: {registration_id: [guider.token]}
                }, function (err, result) {
                    if (err) throw err;
                });
            });
        }).catch(function (err) {
            res.send({ret: 1, message: err.message});
        });
        return next();
    },

    getGroupMessages: function (req, res, next) {
        var pageIndex = +req.query.pageIndex;
        var pageSize = +req.query.pageSize;
        angelGuiderDAO.findGroupMessages({
            from: (pageIndex - 1) * pageSize,
            size: pageSize
        }).then(function (fb) {
            fb.pageIndex = pageIndex;
            res.send({ret: 0, data: fb});
        });
        return next();
    }

}

