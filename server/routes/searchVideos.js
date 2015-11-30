var connection=require('../config/DBConnection.js');
var validator=require('validator');
exports.post=function(req,res,next){
	var page=req.body.page;
	if(isNaN(page)){
		next('incorrectId');
		return;
	}
	var firstElement=(page*6)-6;
	var videoNameQuery;
	var videoDateQuery;
	var videoDirectorQuery;
	var videoGenreQuery;
	var videoActorQuery;
	var whereInSelectQuery;
	if(!validator.isNull(req.body.name)){
		videoNameQuery='video.name like "'+req.body.name+'%"';
	}else{
		videoNameQuery="";
	}
	whereInSelectQuery=videoNameQuery;

	if(!validator.isNull(req.body.date)){
		videoDateQuery='video.date = "'+req.body.date+'"';
		whereInSelectQuery+=(whereInSelectQuery) ? ' and '+videoDateQuery : videoDateQuery;
	}
	if(!validator.isNull(req.body.genre)){
		videoGenreQuery='videoGenreName IN (';
		for(var i=0;i<req.body.genre.length;i++){
			videoGenreQuery+='"'+req.body.genre[i]+'",';
		}
		videoGenreQuery=videoGenreQuery.substring(0,videoGenreQuery.length-1);
		videoGenreQuery+=')';
		whereInSelectQuery+=(whereInSelectQuery) ? ' and '+videoGenreQuery : videoGenreQuery;
	}
	if(!validator.isNull(req.body.actors)){
		videoActorQuery='actor.name IN (';
		for(var i=0;i<req.body.actors.length;i++){
			videoActorQuery+='"'+req.body.actors[i]+'",';
		}
		videoActorQuery=videoActorQuery.substring(0,videoActorQuery.length-1);
		videoActorQuery+=')';
		whereInSelectQuery+=(whereInSelectQuery) ? ' and '+videoActorQuery : videoActorQuery;
	}
	if(!validator.isNull(req.body.director)){
		videoDirectorQuery='director.name IN (';
		for(var i=0;i<req.body.director.length;i++){
			videoDirectorQuery+='"'+req.body.director[i]+'",';
		}
		videoDirectorQuery=videoDirectorQuery.substring(0,videoDirectorQuery.length-1);
		videoDirectorQuery+=')';
		whereInSelectQuery+=(whereInSelectQuery) ? ' and '+videoDirectorQuery : videoDirectorQuery;
	}
	var endWhere=(whereInSelectQuery) ? 'where ' + whereInSelectQuery : "";
	var query='select videoId,video.name,video.country,video.date,video.posterUrl,video.description from mediadb.video '+
			'left join mediadb.video_and_genre using(videoId) ' +
			'left join mediadb.video_genre using(videoGenreId) ' +
			'left join mediadb.video_actor using(videoId) ' +
			'left join mediadb.actor using(actorId) ' +
			'left join mediadb.director using(directorId) '+
			endWhere + ' group by name order By addDate DESC LIMIT ' + firstElement+ ',6';
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