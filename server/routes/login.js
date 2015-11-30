var connection=require('../config/DBConnection.js');
var encrypt=require('../config/encrypt.js');
exports.post=function(req,res,next){
	console.log(req.body);
	if(!req.body.username){
		next(true);
		return;
	}
	var query='select * from mediadb.user where userName="'+ req.body.username+'"';
	connection.query(query,function(err,data){
		if(err){
			next(true);
			return;
		}
		if(data.length>0){
			if(encrypt(req.body.password)==data[0].userPassword){
				req.session.user=data[0].userId;
				req.session.authorized=true;
				res.status(200).end();
			}else{
				res.status(400).send({'error':'incorrectPassword'});
			}
		}else{
			res.status(400).send({'error':'incorrectUsername'});
		}
	})
}