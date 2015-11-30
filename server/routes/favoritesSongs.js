var connection=require('../config/DBConnection.js');
var async=require('async');
exports.get=function(req,res,next){
	async.waterfall([
    function(callback){
    	var query='select songId,name,src,count(songLikesId) as songLikes from mediadb.song '+
				' left join mediadb.song_likes using(songId)'+
				' join mediadb.favorites_songs using(songId)'+
				' where favorites_songs.userId='+req.session.user+
				' group by song.name order by favorites_songs.addDate DESC';
		connection.query(query,function(err,data){
			if(err){
				callback(err);
				return;
			}
			if(data.length>0){
				callback(null,data);
			}else{
				callback(true);
			}
		})
    },
    function(songs,callback){
		songsIds=songs.map(function(item){
    		return item.songId;
    	}).join(',');
	    var query='SELECT singer.name,songId FROM mediadb.singer '+
				' join mediadb.singer_album using(singerId)'+
				' join mediadb.song using(albumId)'+
	    		' where songId IN ('+songsIds +')';
		connection.query(query,function(err,data){
			if(err){
				callback(err);
			}
			if(data.length>0){
				songs.singers=songs.map(function(song){
					return song.singers=data.filter(function(singer){
						if(singer.songId===song.songId){
							return true;
						}else{
							return false;
						}
					}).map(function(item){
						return item.name;
					})
				})
			}
			callback(null,songsIds,songs);
		})
    },
    function(songsIds,songs,callback){
    	var query='select songId from mediadb.song_likes'+
				' join mediadb.song using(songId)'+
				' where songId IN('+songsIds+') and userId='+req.session.user+
				' order by song.addDate DESC';
		connection.query(query,function(err,data){
			if(err){
				callback(err);
				return;
			}
			data=data.map(function(item){
				return item.songId;
			})
			songs=songs.map(function(item){
				item.src="files/songs/"+ item.src;
				item.canLike = (data.indexOf(item.songId)===-1) ? true : false;
				return item;
			})
			callback(err,songs);
		})
    }
	],
	function(err, result){
		if(err){
			next(true);
			return;
		}
		res.status(200).send(result);
	});
}