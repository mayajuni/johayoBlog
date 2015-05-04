/**
 * Created by 동준 on 2014-11-25.
 */
var express = require('express');
var validator = require('validator');
var error = require('../util/error');
var cryptoUtil = require('../util/cryptoUtil');
var config = require('../config/config');
var tg = require('../util/tg');
var dateUtil = require('../util/dateUtil');

/* mongo 연결 */
var mongo = require('../config/mongoConfig');
/* mongo Model */
var Board = mongo.model.board;
var AutoSeq = mongo.model.autoSeq;
/* mongo objectId type */
var ObjectId = mongo.mongoose.Types.ObjectId;
/* 라우터 */
var router = express.Router();

/**
 * autoSeq에서 seq를 가지고 온 후
 * 댓글을 등록 후 데이터 리턴
 */
router.post('/', function(req, res){
    if(!!req.session.loginInfo){
        var name = req.session.loginInfo._id;
        var pw = req.session.loginInfo.password;
    }else{
        var name = validator.isNull(req.param('name'))  ? error.throw(409,'Please check id.') : req.param('name');
        var pw = validator.isNull(req.param('pw'))  ? error.throw(409,'Please check password.') : cryptoUtil.encrypt(req.param('pw'), config.crypto.password);
    }
    var boardSeq = validator.isNull(req.param('boardSeq'))  ? error.throw(409,'Please check boardSeq.') : req.param('boardSeq');
    var content = validator.isNull(req.param('content'))  ? error.throw(409,'Please check content.') : req.param('content');
    var url = validator.isNull(req.param('url'))  ? error.throw(409,'Please retry.') : req.param('url');

    AutoSeq.findOneAndUpdate({_id : 'comment'}, {$inc : {seq: 1}, new: true}, function(err, result){
        if(err){
            throw err;
        }

        var seq = result.seq;

        Board.findOneAndUpdate(
            {_id: new ObjectId(boardSeq)},
            {
                $push: {commentList : {seq: seq, name : name, pw : pw, content : content, regDt : dateUtil.nowDateTypeDate()}},
            },
            {fields : {'commentList.pw': 0, 'commentList.sub.pw' : 0}, new: true},
            function (err, data){
                if(err){
                    throw err;
                }

                /* 텔레그램 메세지 보내기 */
                var tgData = {
                    content : '[댓글등록, '+name+'님]  http://johayo.com/#'+url ,
                    division : data.division,
                    ip: req.headers['x-forwarded-for'] || req.ip,
                    url : url
                };

                tg.sendMsg(tgData);

                res.send(data);
            });
    });
});

/**
 * 댓글을 삭제 후 데이터 리턴
 */
router.post('/delete', function(req, res){
    var pw = validator.isNull(req.param('pw'))  ? error.throw(409,'Please check password.') : cryptoUtil.encrypt(req.param('pw'), config.crypto.password);
    var boardSeq = validator.isNull(req.param('boardSeq'))  ? error.throw(409,'Please check boardSeq.') : req.param('boardSeq');
    var commentSeq = validator.isNull(req.param('commentSeq'))  ? error.throw(409,'Please check commentSeq.') : req.param('commentSeq');

    Board.findOneAndUpdate(
        {_id: new ObjectId(boardSeq)},
        {
            $pull: {commentList : {pw: pw, seq: commentSeq}}
        },
        {fields : {'commentList.pw': 0, 'commentList.sub.pw' : 0}, new: true},
        function(err, data){
            if(err){
                throw err;
            }

            res.send(data);
        })
});

/**
 * 수정후 데이터 리턴
 */
router.put('/', function(req, res){
    var pw = validator.isNull(req.param('pw'))  ? error.throw(409,'Please check password.') : cryptoUtil.encrypt(req.param('pw'), config.crypto.password);
    var boardSeq = validator.isNull(req.param('boardSeq'))  ? error.throw(409,'Please check boardSeq.') : req.param('boardSeq');
    var commentSeq = validator.isNull(req.param('commentSeq'))  ? error.throw(409,'Please check commentSeq.') : req.param('commentSeq');
    var content = validator.isNull(req.param('content'))  ? error.throw(409,'Please check content.') : req.param('content');

    Board.findOneAndUpdate(
        {
            _id: new ObjectId(boardSeq),
            'commentList': {
                $elemMatch: {'seq': commentSeq, 'pw':pw}
            }
        },
        {
            $set: {'commentList.$.content': content}
        },
        {fields : {'commentList.pw': 0, 'commentList.sub.pw' : 0}, new: true},
        function (err, data){
            if(err){
                throw err;
            }

            if(!data){
                throw error.throw('409', 'check password.');
            }

            res.send(data);
        });
});

module.exports = router;