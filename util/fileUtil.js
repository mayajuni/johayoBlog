/**
 * Created by 동준 on 2014-12-09.
 */
var fs = require('fs');
/* mongo 연결 */
var mongo = require('../config/mongoConfig');
/* mongo Model */
var File = mongo.model.file;

/**
 * 파일정보를 등록한다.
 *
 * @param param
 */
exports.saveFileInfo = function(param){
    var file = new File(param);
    file.save(function(err){
        if(err){
            throw err;
        }
    });
};

/**
 * 파일를 삭제한다.
 *
 * @param param
 */
exports.deleteFile = function(local, path){
    File.remove({path: path}, function(err){
        if(err){
            throw err;
        }

        fs.unlinkSync(local+path);
    });
};

