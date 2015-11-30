var connection=require('../config/DBConnection.js');
var async=require('async');
exports.get=function(req,res,next){
	var id=req.params.id;
	if(isNaN(id)){
		next('incorrectId');
		return;
	}
	async.parallel([
    function(callback){
    	var query='select director.name as director,video.name,posterUrl,country,video.src,date,description,'+
    	'duration from mediadb.video '+
    	'join mediadb.director using(directorId) where videoId='+id;
		connection.query(query,function(err,data){
			if(err){
				callback(err);
			}
			if(data.length>0){
				callback(null,data[0]);
			}else{
				callback(true);
			}
		})
    },
    function(callback){
    	var query='select name from mediadb.actor '+
				'join mediadb.video_actor using(actorId) where videoId='+id;
		connection.query(query,function(err,data){
			callback(err,data);
		})
    },
    function(callback){
    	var query='select COUNT(*) AS likesCount from mediadb.video_likes where videoId='+id;
		connection.query(query,function(err,data){
			callback(err,{'likes':data[0].likesCount});
		})
    },
    function(callback){
    	var query='select userName,commentString,commentDate from mediadb.video_comments '+ 
				'join mediadb.user using(userId) '+
				'where videoId='+id+' order by commentDate DESC';
		connection.query(query,function(err,data){
			callback(err,data);
		})
    },
    function(callback){
    	var query='select COUNT(*) AS watchingCount from mediadb.video_watchings where videoId='+id;
		connection.query(query,function(err,data){
			callback(err,{'watchings':data[0].watchingCount});
		})
    },
    function(callback){
    	var query='select favoritesVideoId AS favorites from mediadb.favorites_videos where videoId='+
    			id+' and userId='+req.session.user;
		connection.query(query,function(err,data){
			var result=false;
			if(data.length>0){
				result=true;
			}
			callback(err,{'favorites':result});
		})
    },
    function(callback){
    	var query='select videoLikesId  from mediadb.video_likes where videoId='+
    			id+' and userId='+req.session.user;
		connection.query(query,function(err,data){
			var result=false;
			if(data.length>0){
				result=true;
			}
			callback(err,{'likeFromUser':result});
		})
    }
	],
	function(err, results){
		results[3]=results[3].map(function(item){
			var date=new Date(item.commentDate);
			item.commentDate=date.toLocaleString();
			return item;
		})
		if(err){
			next(true);
			return;
		}
		res.status(200).send(results);
	});
}