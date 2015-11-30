var connection=require('../config/DBConnection.js');
exports.get=function(req,res){
	if(req.session.authorized){
		res.status(200).end();
	}else{
		res.status(403).end();
	}
}