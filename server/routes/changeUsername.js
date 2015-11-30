var connection=require('../config/DBConnection.js');
var async=require('async');
exports.post=function(req,res,next){
	async.waterfall([
    function(callback){
		var query='select userId from mediadb.user where userName="'+ req.body.username+'"';
		connection.query(query,function(err,data){
			if(err){
				callback(err);
				return;
			}
			if(data.length>0){
				if(data[0].userId===req.session.user){
					err=null;
				}else{
					err=true;
				}
			}
			callback(err);
		})
    },
    function(callback){
    	var query='update mediadb.user set userName="'+ req.body.username+'"'+
    			' where userId='+ req.session.user;
		connection.query(query,function(err,data){
			callback(err);
		})
    }
	],
	function(err){
		if(err){
			next(true);
			return;
		}
		res.status(200).end();
	});
}