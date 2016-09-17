var authController = require('./controller/authController');
var thirdPartyController = require('./controller/thirdPartyController');
var hospitalController = require('./controller/hospitalController');
var angelGuiderController = require('./controller/angelGuiderController');
var transactionFlowController = require('./controller/transactionFlowController');

module.exports = [
    {
        method: "post",
        path: "/api/login",
        handler: authController.login
    },
    {
        method: "post",
        path: "/api/logout",
        handler: authController.logout,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/hospitals",
        handler: hospitalController.getHospitals,
        secured: 'user'
    },
    {
        method: "put",
        path: "/api/hospitals",
        handler: hospitalController.updateHospital,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/hospitals/:id",
        handler: hospitalController.getHospitalById,
        secured: 'user'
    },
    {
        method: "post",
        path: "/api/resetPwd",
        handler: authController.resetPwd,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/geocoder",
        handler: thirdPartyController.getGeocoder,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/sales",
        handler: hospitalController.getSales,
        secured: 'user'
    },
    {
        method: "post",
        path: "/api/angelGuiders",
        handler: angelGuiderController.addAngelGuider,
        secured: 'user'
    },
    {
        method: "put",
        path: "/api/angelGuiders",
        handler: angelGuiderController.updateAngelGuider,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/angelGuiders",
        handler: angelGuiderController.getAngelGuiders,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/angelGuiders/:id",
        handler: angelGuiderController.getAngelGuiderById,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/agents",
        handler: angelGuiderController.getAgents,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/agentPreRegistrations",
        handler: hospitalController.getPreRegistrations,
        secured: "user"
    },
    {
        method: "get",
        path: "/api/transactionCode",
        handler: transactionFlowController.getTransactionCode,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/hospitalTransactionFlows",
        handler: transactionFlowController.getHospitalTransactionFlows,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/platformTransactionFlows",
        handler: transactionFlowController.getPlatformTransactionFlows,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/angelGuiderTransactionFlows",
        handler: transactionFlowController.getGuiderTransactionFlows,
        secured: 'user'
    },
    {
        method: "post",
        path: "/api/hospitalRecharge",
        handler: transactionFlowController.rechargeForHospitalById,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/angelGuiderWithdraws",
        handler: transactionFlowController.getAngelGuiderWithdraw,
        secured: 'user'
    },
    {
        method: "put",
        path: "/api/angelGuiderWithdrawStatus",
        handler: transactionFlowController.changeAngelGuiderWithdrawStatus,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/pendingWithdraws",
        handler: transactionFlowController.getPendingWithdrawCount,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/accountInfo",
        handler: hospitalController.getAccountInfo,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/users",
        handler: authController.getUsers,
        secured: 'user'
    },
    {
        method: "post",
        path: "/api/users",
        handler: authController.addUser,
        secured: 'user'
    },
    {
        method: "put",
        path: "/api/users",
        handler: authController.updateUser,
        secured: 'user'
    },
    {
        method: "del",
        path: "/api/users/:id",
        handler: authController.removeUser,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/users/userName/:userName",
        handler: authController.getUserByUserName,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/feedback",
        handler: angelGuiderController.getFeedback,
        secured: 'user'
    },
    {
        method: "put",
        path: "/api/feedback",
        handler: angelGuiderController.updateFeedback,
        secured: 'user'
    },
    {
        method: "post",
        path: "/api/groupMessages",
        handler: angelGuiderController.addGroupMessage,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/groupMessages",
        handler: angelGuiderController.getGroupMessages,
        secured: 'user'
    }
];