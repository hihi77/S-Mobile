var db = require('mongoskin').db('mongodb://localhost:27017/app0924');
/* var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/app0924';

MongoClient.connect(DB_CONN_STR,{
    db: {
        native_parser: false
    },
    server: {
        socketOptions: {
            connectTimeoutMS: 500
        }
    },
    replSet: {},
    mongos: {}
}, function(err, database)
{
    db = database;
    if(err)
    {
        console.log(err);
        res.send(' 数据库连接错误');
    }
    else{
        console.log("DataBase ready!", db)      
    }
    //res.send(' 数据库连接错误');
}); */

exports.db = db;