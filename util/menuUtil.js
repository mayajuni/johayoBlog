/**
 * Created by 동준 on 2014-12-09.
 */
/*  캐쉬 설정 */
var SimpleCache = require("simple-lru-cache");
var cache = new SimpleCache({"maxSize":1000});

var menu = {};
menu.saveMenu = function(menu){
    cache.set('menuList', menu);
};

menu.getMenu = cache.get('menuList');

menu.deleteMenu = function(){
    cache.del('menuList');
};

module.exports = menu;