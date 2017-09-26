var express = require('express');
var router = express.Router();
var db = require('../bin/database').db;
var param;
var data;

router.use(function(req, res, next){
    param = req.query || {};
    data = {};
    next();
});

router.get('/add',function(req, res, next) {
    var collection = db.collection('groups');
    if(!param.data || param.data.length < 1) {
        res.send({status: 1, errorMessage: "Invalid Params!"});
    }
    var members = param.data;
    var data = {};
    data.members = members;
    data.groupName = "Group Chat";
    data.type = members.length > 2 ? "group" : "person";
    data.unreadMessageCount = {};
    data.messages = [];
    collection.insert(data ,function(err, result) {
        if(err)
        {
          console.log('Error:'+ err);
          res.send({status: 1, errorMessage: "数据库错误"});
        } else {
            res.send(result && result.ops[0]);            
        }
    });
})


module.exports = router;
