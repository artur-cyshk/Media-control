var connection=require('../config/DBConnection.js');
var async=require('async');
exports.post=function(req,res,next){
	var id=req.body.id;
	if(isNaN(id)){
		next('incorrectId');
		return;
	}
	async.waterfall([
	  function(callback){
	  	if(req.body.commentString){
	  		if(req.body.commentString.length>0){
	  			callback(null);
	  		}else{
	  			callback(true);
	  		}
	  	}else{
	  		callback(true);
	  	}
	  },
	  function(callback){
	  	var query='insert into mediadb.video_comments (userId,videoId,commentDate,commentString) VALUES ("'+
	  			req.session.user+'","'+id+'","'+new Date().toLocaleString()+'","'+req.body.commentString+'")';
		connection.query(query,function(err,data){
			callback(err);
		})
	  },
	  function(callback){
    	var query='select userName,commentString,commentDate from mediadb.video_comments '+ 
				'join mediadb.user using(userId) '+
				'where videoId='+id+' order by commentDate DESC';
		connection.query(query,function(err,data){
			callback(err,data);
		})
	  }
	], function (err, result) {
		result=result.map(function(item){
			var date=new Date(item.commentDate);
			item.commentDate=date.toLocaleString();
			return item;
		})
		if(!err){
	  		res.status(200).send(result);
		}else{
			next(true);
		}
	});
}