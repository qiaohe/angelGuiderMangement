'use strict';

module.exports = {
    server: {
        name: 'angel guider management',
        version: '0.0.1',
        host: '121.42.171.213',
        port: 8090
    },
    db: {
        host: '121.42.171.213',
        port: '3306',
        user: 'root',
        password: 'heqiao75518',
        debug: false,
        multipleStatements: true,
        dateStrings: true,
        database: 'medicalDB'
    },
    app: {
        locale: 'zh_CN',
        tokenSecret: '1~a',
        tokenExpire: 86400,
        dateStrings: 'true',
        defaultHeadPic: 'http://7xrtp2.com2.z0.glb.qiniucdn.com/headPic.png',
        defaultHospitalIcon: 'http://7xrtp2.com2.z0.glb.qiniucdn.com/Default%20hospital.png',
        defaultSysBackground: 'http://7xrtp2.com2.z0.glb.qiniucdn.com/background.jpgi',
        geocoderTemplate: 'http://restapi.amap.com/v3/geocode/geo?address=:address&output=json&key=97c82a411d07caf7dd5d69427ff64ea9'
    },
    redis: {
        host: '127.0.0.1',
        port: 6379
    },
    sms: {
        providerUrl: 'https://sms.yunpian.com/v1/sms/send.json',
        template: '【天使导医】您的短信验证码是:code,在30分钟内输入有效。',
        expireTime: 1800000,
        apikey: '410ac09436843c0270f513a0d84802cc'
    },
    qiniu: {
        ak: "0d02DpW7tBPiN3TuZYV7WcxmN1C9aCiNZeW9fp5W",
        sk: "7zD3aC6xpvp_DfDZ0LJhjMq6n6nB6UVDbl37C5FZ",
        prefix: "http://7xrtp2.com2.z0.glb.qiniucdn.com/"
    },
    gender:['男','女'],
    sales: ['姚红', '刘文涛', '刘安', '熊少林', '夏银庆', '胡国明', '滕俊杰', '张明生', '曹飞'],
    angelGuiderStatus:['禁用','正常']
};

