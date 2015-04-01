/**
 * Created by 동준 on 2014-12-11.
 */
var express = require('express');
var validator = require('validator');
var error = require('../util/error');
var tg = require('../util/tg');
var mail = require('../util/mailUtil');
var config = require('../config/config');
/* 라우터 */
var router = express.Router();

/**
 * 구분에 맞는 게시물을 가지고 온다.
 */
router.post('/', function(req, res){
    var content = validator.isNull(req.param('content'))  ? error.throw(4019,'Please check content.') : req.param('content');
    var email = validator.isNull(req.param('email'))  ? error.throw(4019,'Please check email.') : req.param('email');
    var tgData = {
        email : email,
        content : '[Blog 메세지] Check Email!',
        division : 'msg',
        ip: req.headers['x-forwarded-for'] || req.ip
    };

    tg.sendMsg(tgData);
    mail.sendMail(config.email.to, tgData.email + ' 님이 보낸 메세지', content);

    res.send('');
});

module.exports = router;