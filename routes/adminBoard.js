/**
 * Created by 동준 on 2014-12-09.
 */
var express = require('express');
var validator = require('validator');
var error = require('../util/error');

/* mongo 연결 */
var mongo = require('../config/mongoConfig');
/* mongo Model */
var Board = mongo.model.board;
/* mongo objectId type */
var ObjectId = mongo.mongoose.Types.ObjectId;

/* 라우터 */
var router = express.Router();

/**
 * 로그인 체크후
 * 게시물을 등록한다.
 */
router.post('/', function(req, res){
    var board = new Board();
    board.id = req.session.loginInfo._id;
    board.division = validator.isNull(req.param('division'))  ? error.throw(409,'Please check division.') : req.param('division');
    board.title = validator.isNull(req.param('title'))  ? error.throw(409,'Please check title.') : req.param('title');
    board.reqDt = new Date();

    if(req.param('division') != 'bookmark'){
        board.content = validator.isNull(req.param('content'))  ? error.throw(409,'Please check content.') : req.param('content');
        board.hashTag = req.param('hashTag');
        board.fileList = req.param('fileList');
    }else{
        board.content = req.param('content');
        board.hashTag = validator.isNull(req.param('hashTag'))  ? error.throw(409,'Please check hashTag.') : req.param('hashTag');
        board.url = validator.isNull(req.param('url'))  ? error.throw(409,'Please check url.') : req.param('url');
        board.fileList = validator.isNull(req.param('fileList'))  ? error.throw(409,'Please check fileList.') : req.param('fileList');;
    }

    board.save(function(err, data){
        if(err){
            throw err;
        }

        res.send(data);
    })
});

/**
 * 로그인 체크후
 * 게시물을 수정한다. 수정후 데이터 리턴
 */
router.put('/:seq', function(req, res){
    var title = validator.isNull(req.param('title'))  ? error.throw(409,'Please check title.') : req.param('title');
    var content = validator.isNull(req.param('content'))  ? error.throw(409,'Please check content.') : req.param('content');
    var hashTag = validator.isNull(req.param('hashTag'))  ? error.throw(409,'Please check hashTag.') : req.param('hashTag');

    Board.findOneAndUpdate(
        {_id: new ObjectId(req.params.seq)},
        {$set: {title: title, content: content, hashTag: hashTag}, new: true},
        {fields : {'commentList.pw': 0, 'commentList.sub.pw' : 0}},
        function(err, data){
            if(err){
                throw err;
            }

            res.send(data);
        })
});

/**
 * 로그인 체크후
 * 게시물을 삭제한다.
 */
router.delete('/:seq', function(req, res){
    Board.remove({_id: new ObjectId(req.params.seq)}, function(err){
        if(err){
            throw err;
        }

        res.send('');
    });
});

module.exports = router;