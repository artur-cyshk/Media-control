var connection=require('../config/DBConnection.js');
exports.post=function(req,res,next){
	var selectInfo={};
	switch(req.body.type){
		case 0:
			selectInfo.table='video';
			selectInfo.id="videoId";
			break;
		case 1:
			selectInfo.table='album';
			selectInfo.id="albumId";
			break;
		default:
			break;
	}
	var query='select ' + selectInfo.id + ' ,name, posterUrl'+ 
			' from mediadb.'+ selectInfo.table +
			' where name like "'+ req.body.searchStr+
			'%" order by addDate DESC';
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
