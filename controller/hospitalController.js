"use strict";
var config = require('../config');
var hospitalDAO = require('../dao/hospitalDAO');
var angelGuiderDAO = require('../dao/angelGuiderDAO');
var _ = require('lodash');
var Promise = require('bluebird');
var moment = require('moment');
var redis = require('../common/redisClient');
module.exports = {
    getHospitals: function (req, res, next) {
        var pageIndex = +req.query.pageIndex;
        var pageSize = +req.query.pageSize;
        var isAngelGuide = req.query.isAngelGuide;
        var conditions = [];
        if (req.query.name) conditions.push('h.name like \'%' + req.query.name + '%\'');
        if (req.query.businessPeople) conditions.push('h.businessPeople=\'' + req.query.businessPeople + '\'');
        if (req.query.status) conditions.push('h.status=\'' + req.query.status + '\'');
        if (req.query.districtId) conditions.push('h.districtId=\'' + req.query.districtId + '\'');
        if (req.query.provId) conditions.push('h.provId=\'' + req.query.provId + '\'');
        if (req.query.cityId) conditions.push('h.cityId=\'' + req.query.cityId + '\'');
        if (req.query.isAngelGuide) conditions.push('h.isAngelGuide=\'' + req.query.isAngelGuide + '\'');
        if (req.query.registerDateStart) conditions.push('h.createDate>=\'' + req.query.registerDateStart + ' 00:00:00\'');
        if (req.query.registerDateEnd) conditions.push('h.createDate<=\'' + req.query.registerDateEnd + ' 23:59:59\'');
        hospitalDAO.findAll({
            from: (pageIndex - 1) * pageSize,
            size: pageSize
        }, conditions).then(function (hospitals) {
            hospitals.pageIndex = pageIndex;
            return res.send({ret: 0, data: hospitals});
        }).catch(function (err) {
            res.send({ret: 1, message: err.message});
        });
        return next();
    },
    updateHospital: function (req, res, next) {
        var h = req.body;
        if (h.isAngelGuide)
            h.onlineDateInAngelGuide = new Date();
        hospitalDAO.update(h).then(function (result) {
            return hospitalDAO.findById(h.id);
        }).then(function (hospitals) {
            if (h.isAngelGuide) {
                angelGuiderDAO.insertAccount({
                    uid: h.id,
                    updateDate: new Date(),
                    accountNo: 'H' + moment().format('YYMMDD') + '-' + h.id,
                    balance: 0.00,
                    availableBalance: 0.00,
                    accountName: hospitals[0].name,
                    status: 0,
                    type: 1
                }).then(function (result) {
                    res.send({ret: 0, data: hospitals[0]});
                })
            }
            res.send({ret: 0, data: hospitals[0]});
        }).catch(function (err) {
            res.send({ret: 1, message: err.message});
        });
        return next();
    },
    getHospitalById: function (req, res, next) {
        hospitalDAO.findById(req.params.id).then(function (hospitals) {
            if (hospitals && hospitals.length < 1) return res.send({ret: 0, data: {}});
            res.send({ret: 0, data: hospitals[0]})
        }).catch(function (err) {
            res.send({ret: 1, message: err.message})
        });
        return next();
    },
    getSales: function (req, res, next) {
        res.send({ret: 0, data: config.sales});
        return next();
    },
    getPreRegistrations: function (req, res, next) {
        var conditions = [];
        var pageIndex = +req.query.pageIndex;
        var pageSize = +req.query.pageSize;
        if (req.query.patientName) conditions.push('r.patientName like \'%' + req.query.patientName + '%\'');
        if (req.query.hospitalName) conditions.push('r.hospitalName like \'%' + req.query.hospitalName + '%\'');
        if (req.query.startDate) conditions.push('r.registerDate>=\'' + req.query.startDate + ' 00:00:00\'');
        if (req.query.endDate) conditions.push('r.registerDate<=\'' + req.query.endDate + ' 23:59:59\'');
        if (req.query.outpatientStatus) conditions.push('r.outpatientStatus=\'' + req.query.outpatientStatus + '\'');
        hospitalDAO.findRegistrations({
            from: (pageIndex - 1) * pageSize,
            size: pageSize
        }, conditions).then(function (registrations) {
            if (registrations.length < 1) return res.send({ret: 0, data: []});
            registrations.pageIndex = pageIndex;
            registrations.rows && registrations.rows.length > 0 && registrations.rows.forEach(function (r) {
                r.outpatientStatus = config.outpatientStatus[r.outpatientStatus];
            });
            res.send({ret: 0, data: registrations});
        }).catch(function (err) {
            res.send({ret: 1, message: err.message});
        });
        return next();
    },
    getAccountInfo: function (req, res, next) {
        hospitalDAO.findAccount('P160716-999').then(function (accounts) {
            res.send({ret: 0, data: accounts[0]})
        }).catch(function (err) {
            return res.send({ret: 1, message: err.message});
        })
        return next();
    }
}
