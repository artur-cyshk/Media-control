var connection=require('../config/DBConnection.js');
exports.post=function(req,res,next){
	var selectInfo={};
	switch(req.body.type){
		case 0:
			selectInfo.table='favorites_videos';
			selectInfo.idType='videoId';
			break;
		case 1:
			selectInfo.table='favorites_albums';
			selectInfo.idType='albumId';
			break;
		case 2:
			selectInfo.table='favorites_songs';
			selectInfo.idType='songId';
			break;
	}
	var id=req.body.id;
	if(isNaN(id)){
		next('incorrectId');
		return;
	}
	var query='delete from mediadb.'+selectInfo.table+
		 ' where '+ selectInfo.idType +' = '+id+' and userId='+req.session.user;
	connection.query(query,function(err,data){
		if(err){
			next(true);
			return;
		}
		res.status(200).end();
	})
}