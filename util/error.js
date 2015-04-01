/**
 * Created by Administrator on 2014-08-18.
 */
exports.throw = function(status, msg){
    var err = new Error(msg);
    err.status = status;
    throw err;
};