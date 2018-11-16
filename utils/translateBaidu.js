const fetch = require('node-fetch');
const config = require('../config/config');
const MD5 = require('./md5').MD5;
const uuidv1 = require('uuid/v1');

function objToURI(obj = {}) {
    let uri = '';
    Object.keys(obj).forEach((key, i, arr) => {
        if (arr.length - 1 === i) {
            uri += `${key}=${obj[key]}`;
        } else {
            uri += `${key}=${obj[key]}&`;
        }
    });
    return uri ? `?${uri}` : '';
}

module.exports.translateBaidu = function (english) {
    let appid = config.baiduConfig.appid;
    let key = config.baiduConfig.key;
    let salt = uuidv1();
    let query = english;
    let from = 'en';
    let to = 'zh';
    let str1 = appid + query + salt + key;
    let sign = MD5(str1);
    let uri = objToURI({
        q: query,
        appid: appid,
        salt: salt,
        from: from,
        to: to,
        sign: sign
    });
    return fetch(`${config.baiduConfig.url}${uri}`, {
        method: 'get',
        headers: {'Content-Type': 'application/json'}
    }).then(res => {
        if (res.status < 200 || res.status > 210) {
            return res.json().then(res => Promise.reject(res));
        }
        if (res.headers.get('content-length') === '0') {
            return Promise.resolve({});
        }
        return res.json();
    }).catch(err => {
        console.log(err);
    });
};