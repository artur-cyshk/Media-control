var connection=require('../config/DBConnection.js');
exports.get=function(req,res){
	if(req.session.authorized){
		var query='select userId,userName as username from mediadb.user where userId='+req.session.user;
		connection.query(query,function(err,data){
			if(err){
				next(true);
			}else{
				res.status(200).send(data[0]);
			}
		})
	}else{
		res.status(403).end();
	}
}