var express = require('express');
var router = express.Router();
var db = require('../bin/database').db;
var param;

router.use(function(req, res, next){
    param = req.query || {};
    next();
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource: user');
});

router.post("/upload", function(req, res, next) {
  console.log(req);
})

router.get('/add',function(req, res, next) {
  var data = {};
  if (!param.email || !param.password) {
      res.send({status: 1, errorMessage: "Invalid Params!"});
  }
  data.email = param.email || "";
  data.name = param.name || "user";
  data.password = param.password || "111111";
  data.participate = {};
  data.basicinfo = {nickname: param.username};
  data.projectExperience = [];
  data.workExperience = [];
  data.educationalBackground=[];
  data.sysNotice = [];
  data.messages = [];
  data.messageBadge = 0;
  data.threadsList = [];
  data.avatar = "../../../assets/img/avatar.png";
  data.config = {位置隐身可见: false, 基本信息可见: false, 个人简历可见: false};
  var collection = db.collection('users');
  collection.find({email:data.email}).toArray(function (err,rest) {
    if(err)
    {
      res.send({status: 1, errorMessage: "Database error"});
    }else if(!rest[0]){
      collection.insertOne(data ,function(err, result) {
        if(err)
        {
          console.log(err)
        }else{
          res.send({result:{ok:1}});
        }
      });
    } else {
      res.send({status: 1, erroeMessage:"This email has been used already!"});
    }
  })
});

router.get('/all', function(req, res, next){
  var collection = db.collection('users');
  collection.find(param).toArray(function(err,result){
    if(err){
      console.log('err:',err);
      return;
    }else{
      console.log(result);
      res.send(result);
    }
  })
});

router.get('/login', function(req, res, next){
  var collection = db.collection('users');
  var errorMessage = "Invalid param";
  if(!param || !param.email || !param.password){
    next(errorMessage);
  } else {
    collection.find({email: param.email, password: param.password},{password:0}).toArray(function(err, result) {
      console.log(result);
      if(err)
      {
        console.log('Error:'+ err);
        res.send(err);
      }
      if(result[0]){
        res.send({status:0, data:result[0]});        
      } else {
        res.send({status: 1, errorMessage: "Not Found"});
      }
    });
  }
});

router.get('/profile', function(req, res, next){

  var collection = db.collection('users');
  collection.find(param,{name:1,nickname:1,currentCompany:1,currentFunction:1,headUrl:1,config:1,sysSetting:1}).toArray(function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }else {
      console.log(result)
      if(result.length>0){
        res.send(result[0]);
        //db.close();
      }
    }
  });
});

module.exports = router;
