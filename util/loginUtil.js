/**
 * Created by Administrator on 2014-08-11.
 */
exports.check = function(req, res, next){
    if(!req.session.loginInfo){
        var err = new Error('need Login');
        err.status = 401;
        throw err;
    }
    next();
};