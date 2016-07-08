"use strict";
var db = require('../common/db');
var sqlMapping = require('./sqlMapping');
module.exports = {
    insert: function (hospital) {
        return db.query(sqlMapping.hospital.insert, hospital);
    },
    update: function (hospital) {
        return db.query(sqlMapping.hospital.update, [hospital, hospital.id]);
    },
    findById: function (hospitalId) {
        return db.query(sqlMapping.hospital.findById, hospitalId);
    },
    searchHospital: function (name, page) {
        return db.query('select * from Hospital where name like \'%' + name + '%\' limit ' + page.from + ',' + page.size);
    },
    findHospitalByName: function (name) {
        return db.query('select * from Hospital where name =\'' + name + '\'');
    },
    findHospitalByDomain: function (name) {
        return db.query('select * from Hospital where domainName =\'' + name + '\'');
    },

    findAll: function (page, conditions) {
        var sql = conditions.length ? 'select SQL_CALC_FOUND_ROWS * from Hospital where ' + conditions.join(' and ') + ' order by createDate desc limit ?,?' : sqlMapping.hospital.findAll;
        return db.queryWithCount(sql, [page.from, page.size])
    },
    insertRole: function (role) {
        return db.query('insert Role set ?', role);
    },
    insertJobTitle: function (jobTitle) {
        return db.query('insert JobTitle set ?', jobTitle);
    },
    insertJobTitleMenuItem: function (item) {
        return db.query('insert JobTitleMenuItem set ?', item);
    },
    insertShiftPeriod: function (period) {
        return db.query('insert ShiftPeriod set ?', period);
    },
    insertDict: function (item) {
        return db.query('insert Dictionary set ?', item);
    },
    insertEmployee: function (employee) {
        return db.query('insert Employee set ?', employee);
    },
    findPeriods: function (hospitalId) {
        return db.query('select id from ShiftPeriod where hospitalId = ? order by name', hospitalId);
    }

}
