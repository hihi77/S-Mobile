var express = require('express');
var router = express.Router();
var db = require('../bin/database').db;
var param;
var body;

router.use(function(req, res, next){
    param = req.query || {};
    body = req.body || {};
    next();
});



router.get('/add',function(req, res, next) {
    var collection = db.collection('groups');
    if(!param) {
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
            var addedCollection = result.ops[0];
            var addedCollectionId = addedCollection._id;
            var userCollection = db.collection("users");
            userCollection.update({"email":{"$in":members}}, {"$addToSet": {"threadsList": addedCollectionId}}, function(err){
                if (!err) 
                    res.send(addedCollection);                            
            });
        }
    });
})

router.post('/add',function(req, res, next) {
    var collection = db.collection('groups');
    if(!body || body.data.length < 1) {
        res.send({status: 1, errorMessage: "Invalid Params!"});
    }
    var data = {};
    var members = body.data;
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
            var addedCollection = result.ops[0];
            var addedCollectionId = addedCollection._id;
            var userCollection = db.collection("users");
            userCollection.updateMany({"email":{"$in":members}}, {"$addToSet": {"threadsList": addedCollectionId}}, function(err,resf){
                if (!err) 
                    res.send(addedCollection);                            
            });
        }
    });
})


module.exports = router;
