var connection=require('../config/DBConnection.js');
exports.post=function(req,res,next){
	var selectInfo={};
	switch(req.body.type){
		case 0:
			selectInfo.table='video';
			selectInfo.id="videoId";
			selectInfo.joinTable='favorites_videos';
			break;
		case 1:
			selectInfo.table='album';
			selectInfo.id="albumId";
			selectInfo.joinTable='favorites_albums';
			break;
		default:
			break;
	}
	var query='select '+selectInfo.id+',name,posterUrl from mediadb.'+ selectInfo.table +
	' join mediadb.'+selectInfo.joinTable+' using('+selectInfo.id+') where userId='+req.session.user+
	' order by '+selectInfo.joinTable+'.addDate DESC';
	connection.query(query,function(err,data){
		if(err){
			next(true);
			return;
		}
		if(data.length>0){
			res.status(200).send(data);	
		}else{
			next(true);
		}
	});
}
