/**
 * Created by 동준 on 2014-11-14.
 */
var express = require('express');
var validator = require('validator');
var error = require('../util/error');
var menuUtil = require('../util/menuUtil');

/* mongo 연결 */
var mongo = require('../config/mongoConfig');
/* mongo Model */
var Menu = mongo.model.menu;
/* mongo objectId type */
var ObjectId = mongo.mongoose.Types.ObjectId;

var router = express.Router();

/**
 * 메뉴 가지고 오기
 * 캐쉬에 있는지 확인후 있으면 캐쉬에 있는걸로 가지고 오고
 * 아니면 디비에서 가지고 온다.
 */
router.get('/', function(req, res){
    var menuList = menuUtil.getMenu;

    if(validator.isNull(menuList)){
       Menu.find({}, null, {sort : {'rank' : 1}}, function(err,data){
           if(err){
               throw err;
           }

           menuUtil.saveMenu(data);
           res.send(data);
       });
    }else{
        res.send(menuList);
    }
});

module.exports = router;