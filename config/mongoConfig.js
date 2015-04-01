/**
 * Created by 동준 on 2014-10-28.
 */
var config = require('./config');
var mongo = {};

mongo.mongoose = require('mongoose');
mongo.mongoose.connect(config.mongodb.connectUrl);
var Schema = mongo.mongoose.Schema;

/* 스키마 */
mongo.schema = {};

mongo.schema.msgLog = new Schema({
    email : String,
    content : String,
    ip : String,
    division : String,
    url : String,
    regDt : {type: Date, default: Date.now}
});

/* 사용자 */
mongo.schema.member = new Schema({
    _id : String,
    password : String,
    name : String,
    regDt : {type: Date, default: Date.now}
});

/* 게시판 */
mongo.schema.board = new Schema({
    id : String,
    division : String,
    title : String,
    content : String,
    hashTag : String,
    url: String,
    commentList : [],
    fileList : [],
    regDt : {type: Date, default: Date.now}
});

mongo.schema.autoSeq = new Schema({
    _id: String,
    seq : Number
});

mongo.schema.file = new Schema({
    name : String,
    path : String,
    url : String,
    type : String,
    regDt : {type: Date, default: Date.now}
});

/* 메뉴 */
mongo.schema.menu = new Schema({
    name : String,
    url : String,
    isBoard : Boolean,
    /* 정렬 순서 */
    rank : Number,
    subMenuList : [],
    regDt : {type: Date, default: Date.now}
});

/* 달력 *//*
mongo.schema.calendar = new Schema({
    year : Number,
    month : Number,
    day : Number,
    week : String,
    holiday : String,
    weekend : String,
    notWork : String,
    objectives : [{
        id : String,
        isAnction : String,
        memo : String,
        actionDt : Date,
        regDt : Date
    }]
});*/

/* 모델 */
mongo.model = {};
mongo.model.member =  mongo.mongoose.model('member', mongo.schema.member);
mongo.model.menu =  mongo.mongoose.model('menu', mongo.schema.menu);
mongo.model.board =  mongo.mongoose.model('board', mongo.schema.board);
mongo.model.autoSeq =  mongo.mongoose.model('autoSeq', mongo.schema.autoSeq);
mongo.model.file =  mongo.mongoose.model('file', mongo.schema.file);
mongo.model.msgLog = mongo.mongoose.model('msgLog', mongo.schema.msgLog);

module.exports = mongo;