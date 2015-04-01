/**
 * Created by 동준 on 2014-11-24.
 */
var exec = require('child_process').exec;
var colors = require('colors');
var config = require('../config/config');
/* mongo 연결 */
var mongo = require('../config/mongoConfig');
/* mongo Model */
var MsgLog = mongo.model.msgLog;

exports.sendMsg = function(obj){
    var _cmd = 'msg ' + 'dongjun_kwon ' +  obj.content;
    exec( "echo " + _cmd  + " | "+config.tg.path+"bin/telegram-cli -k "+config.tg.path+"/tg-server.pub -W" ,
        function(err, stdout, stderr) {
            if(err) {
                console.log(err.message.red);
            }else{
                var msgLog = new MsgLog();
                msgLog.email = obj.email;
                msgLog.content = obj.content;
                msgLog.ip = obj.ip;
                msgLog.division = obj.division;
                msgLog.url = obj.url;

                msgLog.save();
            }
        } );
};