/**
 * Created by 동준 on 2014-12-09.
 */
var express = require('express');
var error = require('../util/error');
var validator = require('validator');
var dateUtil = require('../util/dateUtil');
var menuUtil = require('../util/menuUtil');

/* mongo 연결 */
var mongo = require('../config/mongoConfig');
/* mongo Model */
var Menu = mongo.model.menu;
/* mongo objectId type */
var ObjectId = mongo.mongoose.Types.ObjectId;

var router = express.Router();

/**
 * 1step 메뉴 등록
 */
router.post('/', function(req, res){
    var menu = new Menu();
    menu.name =  validator.isNull(req.param('name'))  ? error.throw(409,'Please check name.') : req.param('name');
    menu.url = validator.isNull(req.param('url'))  ? error.throw(409,'Please check url.') : req.param('url');
    menu.rank = validator.isNull(req.param('rank'))  ? error.throw(409,'Please check rank.') : req.param('rank');
    menu.isBoard = !validator.isNull(req.param('isBoard'));
    menu.regDt = dateUtil.nowDateTypeDate();

    menu.save(function(err){
        if(err){
            throw err;
        }

        menuUtil.deleteMenu();
        res.send('');
    });
});

/**
 * 2step 메뉴 등록
 */
router.post('/sub', function(req, res){
    var oneStep_id = validator.isNull(req.param('oneStep_id'))  ? error.throw(409,'Please check rank.') : req.param('oneStep_id');
    var name =  validator.isNull(req.param('name'))  ? error.throw(409,'Please check name.') : req.param('name');
    var url = validator.isNull(req.param('url'))  ? error.throw(409,'Please check url.') : req.param('url');
    var rank = validator.isNull(req.param('rank'))  ? error.throw(409,'Please check rank.') : req.param('rank');

    Menu.update(
        {_id: new ObjectId(oneStep_id)},
        {$push : {subMenuList: {name : name, url : url, rank : rank}}},
        function(err){
            if(err){
                throw err;
            }

            menuUtil.deleteMenu();
            res.send('');
        })
});

/**
 * 메뉴 수정
 */
router.put('/:seq', function(req, res){

});

/**
 * 메뉴 삭제
 */
router.delete('/:seq', function(req,res){

});


module.exports = router;