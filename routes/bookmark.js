/**
 * Created by 동준 on 2014-12-09.
 */
var express = require('express');
var config = require('../config/config');
var error = require('../util/error');
var validator = require('validator');
var webshot = require('webshot');
var fileUtil = require('../util/fileUtil');
var dateUtil = require('../util/dateUtil');
var login = require('../util/loginUtil')

/* 라우터 */
var router = express.Router();

/**
 * 로그인 체크 후 웹사이트 이미지를 저장하고 리턴한다.
 */
router.post('/url', function(req, res){
    var url = validator.isNull(req.param('url'))  ? error.throw(409,'Please check url.') : req.param('url');

    var urlFile = {
        name : dateUtil.nowDate()+'.png',
        path : config.file.path + '/bookmark/'+ dateUtil.nowDate()+'.png',
        url : "/blog/bookmark/"+dateUtil.nowDate()+'.png',
        type : "image/jpeg"
    };

    webshot(url, urlFile.path, {shotSize: {width: 'all', height: 480}}, function(err) {
        if(err){
            throw err;
        }

        fileUtil.saveFileInfo(urlFile);

        res.send(urlFile);
    });
});

/**
 * 파일 삭제
 */
router.delete('/', function(req, res){

});

module.exports = router;