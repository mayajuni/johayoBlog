/**
 * Created by 동준 on 2014-11-25.
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
 * 구분에 맞는 게시물을 가지고 온다.
 */
router.get('/list/:division', function(req, res){
    Board.find({division: req.params.division}, null, {sort : {'regDt' : -1}}, function(err, docs){
        if(err){
            throw err;
        }

        res.send(docs);
    });
});

/**
 * 모든 게시물을 가지고 온다.
 */
router.get('/list', function(req, res){
    Board.find({division:{'$ne':'bookmark'}}, null, {sort : {'regDt' : -1}}, function(err, docs){
        if(err){
            throw err;
        }

        res.send(docs);
    });
});

/**
 * 상세 게시물 가지고 온다.
 */
router.get('/:seq', function(req, res){
    Board.findOne({_id : new ObjectId(req.params.seq)},{'commentList.pw': 0, 'commentList.sub.pw' : 0},  {sort : {'commonList.regDt' : -1}},function(err, data){
        if(err){
            throw err;
        }

        res.send(data);
    });
});

module.exports = router;