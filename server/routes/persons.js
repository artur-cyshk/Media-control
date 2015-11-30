var connection=require('../config/DBConnection.js');
exports.post=function(req,res,next){
	var selector="";
	switch(req.body.type){
		case 0:
			selector="actor";
			break;
		case 1:
			selector="director";
			break;
		default:
			break;
	}

	var query='select name from mediadb.'+selector+' order By name';
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