/**
 * Created by 동준 on 2014-11-17.
 */
var express = require('express');
var cryptoUtil = require('../util/cryptoUtil');
var config = require('../config/config');
var validator = require('validator');
var error = require('../util/error');
var loginUtil = require('../util/loginUtil');

/* mongo 연결 */
var mongo = require('../config/mongoConfig');
/* mongo Model */
var Member = mongo.model.member;

/* 라우터 */
var router = express.Router();

/**
 * 로그인 체크
 */
router.post('/check', loginUtil.check, function(req, res){
    res.send('');
});

/**
 * 로그인정보를 가지고 온다.
 */
router.post('/getLogin', function(req, res){
    res.send(req.session.loginInfo);
});

/**
 * 로그인 하기
 * 통합 에러 메시지에 걸리지 않게 나만의 코드 만듬 4019,
 * 로그인 같은경우 에러가 났을시 로그인 창에 뿌려주기 때문에 에러코드 409가 아닌 4019로 넘겨준다.
 */
router.post('/', function(req, res){
    var id = validator.isNull(req.param('id'))  ? error.throw(4019,'Please check id.') : req.param('id');
    var password = validator.isNull(req.param('pw')) ? error.throw(4019,'Please check Password.') : cryptoUtil.encrypt(req.param('pw'), config.crypto.password);

    Member.findOne({_id: id, password : password}, function(err, loginInfo){
        if(err){
            throw err;
        }

        if(!loginInfo){
            error.throw(4019,'Please check id or password.');
        }

        req.session.loginInfo = loginInfo._doc;
        res.send(loginInfo._doc);
    });
});

/**
 * 로그아웃
 */
router.post('/logout', function(req, res){
    req.session.destroy();
    res.send('');
});

module.exports = router;