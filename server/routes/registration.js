var connection=require('../config/DBConnection.js');
var encrypt=require('../config/encrypt.js');
exports.post=function(req,res,next){
	if(!req.body.username){
		if(req.body.username<4){
			next(true);
			return;
		}
		next(true);
		return;
	}
	if(!req.body.firstPassword){
		if(req.body.firstPssword<8){
			next(true);
			return;
		}
		next(true);
		return;
	}
	if(!req.body.secondPassword){
		if(req.body.firstPassword!=req.body.secondPassword){
			next(true);
			return;
		}
		next(true);
		return;
	}
	var query='insert into mediadb.user (userName,userPassword,userType) values ("' +
	 req.body.username + '","' + encrypt(req.body.firstPassword) + '","user")';
	connection.query(query,function(err,data){
		if(err){
			next(true);
			return;
		}else{
			res.status(200).end();
		}
	})
}