/**
 * Created by Administrator on 2014-06-23.
 */
var crypto = require("crypto");

var localKey = 'compalLoginAuth201203';
/**
 * 암호화
 *
 * @param text
 * @param key
 * @returns {*}
 */
exports.encrypt = function (text,key){
    var key = key == '' ? localKey : key;
    /* 알고리즘과 암호화 key 값으로 셋팅된 클래스를 뱉는다 */
    var cipher = crypto.createCipher('aes-256-cbc',key);
    /* 컨텐츠를 뱉고 */
    var encipheredContent = cipher.update(text,'utf8','hex');
    /* 최종 아웃풋을 hex 형태로 뱉게 한다*/
    encipheredContent += cipher.final('hex');
    return encipheredContent;
}

/**
 * 복호화
 *
 * @param text
 * @param key
 * @returns {*}
 */
exports.decrypt = function (text,key){
    var key = key == '' ? localKey : key;
    var decipher = crypto.createDecipher('aes-256-cbc',key);
    var decipheredPlaintext = decipher.update(text,'hex','utf8');
    decipheredPlaintext += decipher.final('utf8');
    return decipheredPlaintext;
}
