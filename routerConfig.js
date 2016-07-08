var authController = require('./controller/authController');
var thirdPartyController = require('./controller/thirdPartyController');
var hospitalController = require('./controller/hospitalController');
var angelGuiderController = require('./controller/angelGuiderController');
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
        method: "post",
        path: "/api/hospitals",
        handler: hospitalController.addHospital,
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
        path: "/api/hospitals/:hospitalId",
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
        method: "get",
        path: "/api/angelGuiders",
        handler: angelGuiderController.getAngelGuiders,
        secured: 'user'
    }
];