var connection=require('../config/DBConnection.js');
var async=require('async');
exports.post=function(req,res,next){
async.waterfall([
    function(callback){
    	var selector={};
		switch (req.body.type){
				case 0:
					selector.id="videoId";
					selector.table="video";
					break;
				case 1: 
					selector.id="albumId";
					selector.table="album";
					break;
				default:
					break;

			}
			var page=req.body.page;
			if(isNaN(page)){
				next('incorrectId');
				return;
			}
			var firstElement=(page*6)-6;
			var query='select '+ selector.id +',name,posterUrl,country,date from mediadb.'+selector.table+
			' order By addDate DESC LIMIT ' + firstElement+ ',6';
			connection.query(query,function(err,data){
				if(err){
					callback(err);
					return;
				}
				if(data.length>0){
					callback(null,data);
				}else{
					callback(true);
				}
			})
    },
    function(media,callback){
    	if(req.body.type===1){
    		albumIds=media.map(function(item){
    			return item.albumId;
    		}).join(',');
	    	var query='SELECT singer.name,albumId FROM mediadb.singer '+
					'join mediadb.singer_album using(singerId)'+
	    			' where albumId IN ('+albumIds +')';
			connection.query(query,function(err,data){
				if(err){
					callback(err);
				}
				if(data.length>0){
					media.singers=media.map(function(album){
						return album.singers=data.filter(function(singer){
							if(singer.albumId===album.albumId){
								return true;
							}else{
								return false;
							}
						}).map(function(item){
							return item.name;
						})
					})
					callback(null,media);
				}else{
					callback(true);
				}
			})
    	}else{
    		callback(null,media);
    	}
    }
	],
	function(err, result){
		if(err){
			next(true);
			return;
		}
		res.status(200).send(result);
	});

	var selector={};
	
}