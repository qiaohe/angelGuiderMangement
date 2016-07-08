"use strict";
var config = require('../config');
var i18n = require('../i18n/localeMessage');
var hospitalDAO = require('../dao/hospitalDAO');
var _ = require('lodash');
var Promise = require('bluebird');
var moment = require('moment');
var redis = require('../common/redisClient');
module.exports = {
    getHospitals: function (req, res, next) {
        var pageIndex = +req.query.pageIndex;
        var pageSize = +req.query.pageSize;
        var conditions = [];
        if (req.query.name) conditions.push('h.name like \'%' + req.query.name + '%\'');
        if (req.query.businessPeople) conditions.push('h.businessPeople=\'' + req.query.businessPeople + '\'');
        if (req.query.districtId) conditions.push('h.districtId=\'' + req.query.districtId + '\'');
        if (req.query.provId) conditions.push('h.provId=\'' + req.query.provId + '\'');
        if (req.query.cityId) conditions.push('h.cityId=\'' + req.query.cityId + '\'');
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
    addHospital: function (req, res, next) {
        var hospital = _.assign(req.body, {
            icon: config.app.defaultHospitalIcon,
            background: config.app.defaultSysBackground,
            createDate: new Date(),
            enabled: 1
        });
        hospitalDAO.findHospitalByDomain(hospital.domainName).then(function (hospitals) {
            if (hospitals && hospitals.length > 0) throw new Error(i18n.get('domain.exists'));
            return hospitalDAO.findHospitalByName(hospital.name);
        }).then(function (hospitals) {
            if (hospitals && hospitals.length > 0) throw new Error(i18n.get('hospital.exists'));
            return hospitalDAO.insert(hospital);
        }).then(function (result) {
            hospital.id = result.insertId;
            return hospitalDAO.insertRole({hospitalId: hospital.id, name: '医生'});
        }).then(function (result) {
            var role = result.insertId;
            return hospitalDAO.insertJobTitle({
                hospitalId: hospital.id,
                role: role,
                name: '主治医师'
            }).then(function (result) {
                var jobTitle = result.insertId;
                return Promise.each([{jobTitleId: jobTitle, menuItem: 4}, {
                    jobTitleId: jobTitle,
                    menuItem: 5
                }, {jobTitleId: jobTitle, menuItem: 35}], function (item) {
                    return hospitalDAO.insertJobTitleMenuItem(item);
                })
            })
        }).then(function (result) {
            return hospitalDAO.insertRole({hospitalId: hospital.id, name: '挂号'});
        }).then(function (result) {
            return hospitalDAO.insertJobTitle({hospitalId: hospital.id, role: result.insertId, name: '导医挂号'});
        }).then(function (result) {
            var jobTitle = result.insertId;
            return Promise.each([{jobTitleId: jobTitle, menuItem: 1}, {
                jobTitleId: jobTitle,
                menuItem: 2
            }, {jobTitleId: jobTitle, menuItem: 20}, {jobTitleId: jobTitle, menuItem: 7}], function (item) {
                return hospitalDAO.insertJobTitleMenuItem(item);
            })
        }).then(function (result) {
            return hospitalDAO.insertRole({hospitalId: hospital.id, name: '财务'});
        }).then(function (result) {
            return hospitalDAO.insertJobTitle({hospitalId: hospital.id, role: result.insertId, name: '财务收费'});
        }).then(function (result) {
            var jobTitle = result.insertId;
            return Promise.each([{jobTitleId: jobTitle, menuItem: 1}, {
                jobTitleId: jobTitle,
                menuItem: 2
            }, {jobTitleId: jobTitle, menuItem: 28}, {jobTitleId: jobTitle, menuItem: 29}, {
                jobTitleId: jobTitle,
                menuItem: 31
            }], function (item) {
                return hospitalDAO.insertJobTitleMenuItem(item);
            });
        }).then(function (result) {
            return hospitalDAO.insertRole({hospitalId: hospital.id, name: '药房'});
        }).then(function (result) {
            return hospitalDAO.insertJobTitle({hospitalId: hospital.id, role: result.insertId, name: '药房管理'});
        }).then(function (result) {
            var jobTitle = result.insertId;
            Promise.each([{jobTitleId: jobTitle, menuItem: 23}, {
                jobTitleId: jobTitle,
                menuItem: 24
            }, {jobTitleId: jobTitle, menuItem: 25},
                {jobTitleId: jobTitle, menuItem: 26}, {jobTitleId: jobTitle, menuItem: 34}], function (item) {
                return hospitalDAO.insertJobTitleMenuItem(item);
            })
        }).then(function (result) {
            return Promise.each([{enabled: 1, hospitalId: hospital.id, name: '08:00-09:00'},
                {enabled: 1, hospitalId: hospital.id, name: '09:00-10:00'},
                {enabled: 1, hospitalId: hospital.id, name: '10:00-11:00'},
                {enabled: 1, hospitalId: hospital.id, name: '11:00-12:00'},
                {enabled: 1, hospitalId: hospital.id, name: '12:00-13:00'},
                {enabled: 1, hospitalId: hospital.id, name: '13:00-14:00'},
                {enabled: 1, hospitalId: hospital.id, name: '14:00-15:00'},
                {enabled: 1, hospitalId: hospital.id, name: '15:00-16:00'},
                {enabled: 1, hospitalId: hospital.id, name: '16:00-17:00'},
                {enabled: 1, hospitalId: hospital.id, name: '17:00-18:00'}], function (period, index) {
                return hospitalDAO.insertShiftPeriod(period);
            }).then(function (result) {
                return Promise.each([{hospitalId: hospital.id, type: 0, value: '每天1次'}, {
                    hospitalId: hospital.id,
                    type: 0,
                    value: '每天2次'
                },
                    {hospitalId: hospital.id, type: 0, value: '每天3次'}, {
                        hospitalId: hospital.id,
                        type: 0,
                        value: '每天4次'
                    }, {hospitalId: hospital.id, type: 1, value: 1},
                    {hospitalId: hospital.id, type: 1, value: 2}, {hospitalId: hospital.id, type: 1, value: 3}, {
                        hospitalId: hospital.id,
                        type: 1,
                        value: 4
                    }], function (item) {
                    return hospitalDAO.insertDict(item);
                }).then(function (result) {
                    //res.send({ret: 0, data: h});
                })
            })
        }).then(function (result) {
            return hospitalDAO.insertRole({hospitalId: hospital.id, name: '系统管理员'});
        }).then(function (result) {
            hospital.adminRole = result.insertId;
            return hospitalDAO.insertJobTitle({hospitalId: hospital.id, role: hospital.adminRole, name: '管理员'});
        }).then(function (result) {
            var adminJobTitle = result.insertId;
            Promise.each([{jobTitleId: adminJobTitle, menuItem: 10}, {
                jobTitleId: adminJobTitle,
                menuItem: 11
            }, {jobTitleId: adminJobTitle, menuItem: 12}, {
                jobTitleId: adminJobTitle,
                menuItem: 13
            }, {jobTitleId: adminJobTitle, menuItem: 14}, {jobTitleId: adminJobTitle, menuItem: 21}], function (item) {
                return hospitalDAO.insertJobTitleMenuItem(item)
            }).then(function () {
                return hospitalDAO.insertEmployee({
                    admin: 1,
                    gender: 1,
                    createDate: new Date(),
                    hospitalId: hospital.id,
                    name: '管理员',
                    mobile: 'admin',
                    password: '698d51a19d8a121ce581499d7b701668',
                    headPic: config.app.defaultHeadPic,
                    status: 0,
                    role: hospital.adminRole,
                    jobTitle: adminJobTitle
                });
            }).then(function (result) {
                return hospitalDAO.update({
                    id: hospital.id,
                    administrator: result.insertId,
                    customerServiceUid: result.insertId
                });
            }).then(function (result) {
                hospitalDAO.findPeriods(hospital.id).then(function (periods) {
                    Promise.map(periods, function (period, index) {
                        var key = 'h:' + hospital.id + ':p:' + period.id;
                        return redis.setAsync(key, String.fromCharCode(65 + index))
                    }).then(function (result) {
                        hospital.admin = {
                            admin: 1,
                            gender: 1,
                            createDate: new Date(),
                            hospitalId: hospital.id,
                            name: '管理员',
                            mobile: 'admin',
                            password: '698d51a19d8a121ce581499d7b701668',
                            headPic: config.app.defaultHeadPic,
                            status: 0
                        };
                        res.send({ret: 0, data: hospital});
                    });
                })
            })
        }).catch(function (err) {
            res.send({ret: 1, message: err.message});
        });
        return next();
    },

    updateHospital: function (req, res, next) {
        var h = req.body;
        h.updateDate = new Date();
        hospitalDAO.update(h).then(function (result) {
            return hospitalDAO.findById(h.id);
        }).then(function (hospitals) {
            res.send({ret: 0, data: hospitals[0]});
        }).catch(function (err) {
            res.send({ret: 1, message: err.message});
        });
        return next();
    },
    getHospitalById: function (req, res, next) {
        hospitalDAO.findById(req.params.hospitalId).then(function (hospitals) {
            res.send({ret: 0, data: hospitals[0]})
        }).catch(function (err) {
            res.send({ret: 0, message: err.message})
        });
        return next();
    },
    getSales: function (req, res, next) {
        res.send({ret: 0, data: config.sales});
        return next();
    }
}
