var connection=require('../config/DBConnection.js');
exports.post=function(req,res,next){
	var selectInfo={};
	switch(req.body.type){
		case 0:
			selectInfo.table='video_likes';
			selectInfo.idType='videoId';
			break;
		case 1:
			selectInfo.table='song_likes';
			selectInfo.idType='songId';
			break;
		default:
			break;
	}
	var id=req.body.id;
	if(isNaN(id)){
		next('incorrectId');
		return;
	}
	selectLike();
	function selectLike(){
		var query='select userId from mediadb.'+selectInfo.table+
	  		 ' where '+ selectInfo.idType +' = '+id+' and userId='+req.session.user;
		connection.query(query,function(err,data){
			if(err){
				next(true);
				return;
			}
			if(data.length>0){
				deleteLike();
			}else{
				addLike();
			}
		})
	}
	function deleteLike(){
		var query='delete from mediadb.'+selectInfo.table+
	  		 ' where '+ selectInfo.idType +' = '+id+' and userId='+req.session.user;
		connection.query(query,function(err,data){
			if(err){
				next(true);
				return;
			}
			res.status(200).send(false);
		})
	}
	function addLike(){
		var query='insert into mediadb.'+selectInfo.table+
	  		 ' ('+selectInfo.idType+',userId) VALUES ("'+id+'","'+req.session.user+'")';
		connection.query(query,function(err,data){
			if(err){
				next(true);
				return;
			}
			res.status(200).send(true);
		})
	}
}
