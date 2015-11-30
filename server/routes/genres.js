var connection=require('../config/DBConnection.js');
exports.get=function(req,res,next){
	var query="select videoGenreName from mediadb.video_genre order By videoGenreName";
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
	})
}