var connection=require('../config/DBConnection.js');
var encrypt=require('../config/encrypt.js');
var validator=require('validator');
exports.post=function(req,res,next){
	if(validator.isNull(req.body.firstPassword) || validator.isNull(req.body.secondPassword)){
		next(true);
		return;
	}
	if(req.body.firstPassword!=req.body.secondPassword){
		next(true);
		return;
	}
	if(req.body.firstPassword.length<8){
		next(true);
		return;
	}
	var query='update mediadb.user set userPassword = "'+ encrypt(req.body.firstPassword)+'"'+
			' where userId='+ req.session.user;
	connection.query(query,function(err,data){
		if(err){
			next(true);
		}else{
			res.status(200).end();
		}
	})		
}