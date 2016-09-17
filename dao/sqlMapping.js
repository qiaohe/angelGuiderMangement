module.exports = {
    hospital: {
        insert: 'insert Hospital set ?',
        update: 'update Hospital set ? where id=?',
        findById: 'select * from Hospital where id=?',
        findAll: 'select SQL_CALC_FOUND_ROWS h.*, a.balance, a.availableBalance from Hospital h left join Account a on h.id = a.uid and a.type = 1 order by h.createDate limit ?, ?',
        findRegistrations: 'select SQL_CALC_FOUND_ROWS r.id, r.recommendationFee, r.businessPeopleName,r.createDate, r.outpatientStatus, patientMobile, patientName,r.recipeFee,r.preScriptionFee, r.hospitalName, departmentName, doctorName, r.gender, totalFee as amount, concat(DATE_FORMAT(r.registerDate, \'%Y-%m-%d \') , p.`name`) as shiftPeriod from Registration r left JOIN ShiftPeriod p on r.shiftPeriod = p.id where r.registrationType = 8 '

    },
    admin: {
        findByUserName: 'select * from AngelAdmin where userName = ?',
        updateAdminPassword: 'update AngelAdmin set password=? where userName=?',
        findAll: 'select SQL_CALC_FOUND_ROWS id, userName, nickName, roleId, roleName, createDate from AngelAdmin order by createDate desc limit ?, ?',
        delete: 'delete from AngelAdmin where id = ?',
        insert: 'insert AngelAdmin set ?',
        update: 'update AngelAdmin set ? where id = ?'
    },
    angelGuider: {
        insert: 'insert AngelGuider set ?',
        findAngelGuiders: 'select d.uid, d.token from AngelGuider g left join AngelGuiderDevice d on d.uid = g.id where g.provId=? and g.cityId=?',
        findGroupMessages:'select SQL_CALC_FOUND_ROWS * from AngelGuiderGroupMessage order by createDate desc limit ?, ?',
        insertGroupMessages:'insert AngelGuiderGroupMessage set ?',
        findAll: 'select SQL_CALC_FOUND_ROWS ag.*, ac.balance, ac.availableBalance from AngelGuider ag left join Account ac on ag.id = ac.uid and ac.type = 0',
        findByMobile: 'select * from AngelGuider where mobile = ?',
        findAgents: 'select id, realName, name from AngelGuider where agency is null',
        updateAngelGuider: 'update AngelGuider set ? where id =?',
        findById: 'select * from AngelGuider where id=?',
        countOfAgency: 'select count(*) as count from AngelGuider where agency = ?',
        findWithdraw: 'select SQL_CALC_FOUND_ROWS w.*, a.name, a.accountName, a.account, a.bank, a.branch from AngelGuiderWithdrawApplication w left join AngelGuider a on w.uid = a.id',
        updateWithdrawStatus: 'update AngelGuiderWithdrawApplication set ? where id=?',
        findPendingWithdraw: 'select COUNT(*) as count from AngelGuiderWithdrawApplication WHERE status = 2 or status = 0'
    },
    account: {
        insert: 'insert Account set ?',
        findById: 'select * from AngelGuider where id=?',
        findByAccountNo: 'select * from Account where accountNo=?'
    },
    transactionFlow: {
        findCode: 'select * from TransactionCode',
        insert: 'insert AngelGuiderTransactionFlow set ?',
        findAll: 'select SQL_CALC_FOUND_ROWS t.*, a.accountName from AngelGuiderTransactionFlow t left JOIN  Account a on t.accountId = a.id',
        findHospitalFlowBy: "select SQL_CALC_FOUND_ROWS t.*,IF(t.transactionCode = '206',  h.id, s.hospitalId) as 'hospitalId', IF(t.transactionCode = '206',  h.name, s.hospitalName) as hospitalName, s.angelGuiderName, s.patientName, s.type, s.amount as originAmount, s.recipeShare, s.prescriptionShare from AngelGuiderTransactionFlow t left join AngelGuiderShare s on t.shareId = s.id left join Hospital h on (t.transactionCode = '206' and t.uid = h.id)",
        findAngelGuiderFlowBy: 'select SQL_CALC_FOUND_ROWS account.accountName, if(angel.agency IS NULL, 1, 0) AS isAngelGuide, t.*, s.hospitalName, s.angelGuiderName, s.patientName, s.type, s.amount as originAmount, s.recipeShare, s.prescriptionShare, s.angelGuiderShare, s.platformShare, s.agentShare from AngelGuiderTransactionFlow t left join AngelGuiderShare s on t.shareId = s.id LEFT JOIN Account account ON t.accountId =  account.id  LEFT JOIN AngelGuider angel  on t.uid = angel.id',
        addRechargeRecord: 'insert HospitalRechargeRecord set ?',
        updateRechargeRecordFlowId: 'update HospitalRechargeRecord set transactionFlowId=? where id=?'
    },
    feedback: {
        findFeedback: 'select f.*, r.hospitalName, r.doctorName, concat(DATE_FORMAT(r.registerDate, \'%Y-%m-%d \') , p.`name`) as shiftPeriod from Feedback f left join Registration r on r.id = f.registrationId left JOIN ShiftPeriod p on p.id = r.shiftPeriod order by f.createDate DESC limit ?,?',
        updateFeedback:'update Feedback set ? where id =?'
    },
    notification: {
        insert: 'insert AngelGuiderNotification set ?',
        findAll: 'select * from AngelGuiderNotification where uid=? order by id desc limit ?, ?',
        update: 'update AngelGuiderNotification set ? where id =?',
        delete: 'delete from AngelGuiderNotification where id =?'
    }
}
