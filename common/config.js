'use strict';

module.exports = {
    server: {
        name: 'cloud platform admin',
        version: '0.0.1',
        host: 'platform.hisforce.cn',
        port: 8080
    },
    db: {
        host: '10.161.161.229',
        port: '3306',
        user: 'root',
        password: 'heqiao75518?',
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
        defaultHeadPic: 'http://7xrtp2.com2.z0.glb.qiniucdn.com/headPic.png'
    },
    sms: {
        providerUrl: 'https://sms.yunpian.com/v1/sms/send.json',
        template: '【云诊宝】您的短信验证码是:code,在30分钟内输入有效。',
        expireTime: 1800000,
        apikey: '410ac09436843c0270f513a0d84802cc'
    },
    qiniu: {
        ak: "0d02DpW7tBPiN3TuZYV7WcxmN1C9aCiNZeW9fp5W",
        sk: "7zD3aC6xpvp_DfDZ0LJhjMq6n6nB6UVDbl37C5FZ",
        prefix: "http://7xrtp2.com2.z0.glb.qiniucdn.com/"
    }
};

