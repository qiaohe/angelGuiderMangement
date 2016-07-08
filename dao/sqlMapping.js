module.exports = {
    hospital: {
        insert: 'insert Hospital set ?',
        update: 'update Hospital set ? where id=?',
        findById: 'select * from Hospital where id=?',
        findAll: 'select SQL_CALC_FOUND_ROWS * from Hospital order by createDate limit ?, ?'
    },
    admin: {
        findByUserName: 'select * from AngelAdmin where userName = ?',
        updateAdminPassword: 'update AngelAdmin set password=? where userName=?'
    },
    angelGuider: {
        insert: 'insert AngelGuider set ?',
        findAll: 'select SQL_CALC_FOUND_ROWS * from AngelGuider',
        findByMobile: 'select * from AngelGuider where mobile = ?',
        findAgents: 'select id, realName, name from AngelGuider where agency is null'
    }
}
