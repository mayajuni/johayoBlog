/**
 * Created by 동준 on 2014-12-05.
 */
var express = require('express');
var config = require('../config/config');
var multiparty = require('multiparty');
var error = require('../util/error');
var validator = require('validator');
var fileUtil = require('../util/fileUtil');
var loginUtil = require('../util/loginUtil')

/* 라우터 */
var router = express.Router();

/**
 * 로그인 체크
 */
router.post('/', function(req, res){
    var form = new multiparty.Form();
    form.uploadDir = config.file.path ;
    form.maxFilesSize   = config.file.max_size;
    form.parse(req, function(err, fields, files) {
        if(err){
            /* 에러 자동 감지를 벗어나기 위해 이렇게 넣는다. */
            error.throw(4019, err);
        }

        /*file.name = files.myFile[0].originalFilename.toString();
        file.path = files.myFile[0].path.toString();
        file.url = "/blog/" + files.myFile[0].path.replace(/(\/([^>]+)\/)/ig,"").replace(/(\\([^>]+)\\)/ig,"");
        file.type = files.myFile[0].headers['content-type'].toString();
        file.size = files.myFile[0].size.toString();
        */
        var resultObj = {
            name: files.myFile[0].originalFilename,
            path: files.myFile[0].path,
            url: "/blog/" + files.myFile[0].path.replace(/(\/([^>]+)\/)/ig,"").replace(/(\\([^>]+)\\)/ig,""),
            virtualName: files.myFile[0].path.replace(/(\/([^>]+)\/)/ig,"").replace(/(\\([^>]+)\\)/ig,""),
            size: files.myFile[0].size,
            type : files.myFile[0].headers['content-type'],
            isImg: files.myFile[0].headers['content-type'].toString().indexOf('image') > -1
        };
        var ltObj = files.myFile[0];

        fileUtil.saveFileInfo(resultObj);

        res.send(resultObj);
    });
});

/**
 * 파일 삭제
 */
router.delete('/', function(req, res){
    var filePath = validator.isNull(req.param('filePath'))  ? error.throw(409,'Please check filePath.') : req.param('filePath');

    var local = '';
    if(req.hostname == 'localhost'){
        local = 'd:\\';
    }
    fileUtil.deleteFile(local, filePath);

    res.send('');
});

module.exports = router;