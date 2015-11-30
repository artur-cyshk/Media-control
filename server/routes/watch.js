var connection=require('../config/DBConnection.js');
var async=require('async');
exports.get=function(req,res,next){
	var id=req.params.id;
	if(isNaN(id)){
		next('incorrectId');
		return;
	}
	async.waterfall([
	  function(callback){
	  	var query='select userId from mediadb.video_watchings '+
	  		 'where videoId='+id+' and userId='+req.session.user;
		connection.query(query,function(err,data){
			if(err){
				callback(err);
				return;
			}
			if(data.length>0){
				callback(true);
			}else{
				callback();				
			}
		})
	  },
	  function(callback){
	  	var query='insert into mediadb.video_watchings (userId,videoId) VALUES ("'+
	  			req.session.user+'","'+id+'")'
		connection.query(query,function(err,data){
			callback(err);
		})
	  }
	], function (err, result) {
		if(!err){
	  		res.status(200).end();
		}else{
			next(true);
		}
	});
}