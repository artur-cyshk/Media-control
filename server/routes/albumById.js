var connection=require('../config/DBConnection.js');
var async=require('async');
exports.get=function(req,res,next){
	var id=req.params.id;
	if(isNaN(id)){
		next('incorrectId');
		return;
	}
	async.parallel([
    function(callback){
    	var query='select album.name,posterUrl,country,date,description'+
    	' from mediadb.album '+
    	' where albumId='+id;
		connection.query(query,function(err,data){
			if(err){
				callback(err);
			}
			if(data.length>0){
				callback(null,data[0]);
			}else{
				callback(true);
			}
		})
    },
    function(callback){
    	var query='SELECT singer.name FROM mediadb.singer '+
				'join mediadb.singer_album using(singerId)'+
    			' where albumId='+id;
		connection.query(query,function(err,data){
			if(err){
				callback(err);
			}
			if(data.length>0){
				callback(null,data);
			}else{
				callback(true);
			}
		})
    },
    function(callback){
    	var query='select songId,name,duration,src,count(songLikesId) as songLikes from mediadb.song '+
				'left join mediadb.song_likes using(songId) where albumId='+id+
				' group by song.name order by song.addDate DESC';
		connection.query(query,function(err,data){
			callback(err,data);
		})
    },
    function(callback){
    	var query='select songId from mediadb.song_likes'+
				' join mediadb.song using(songId)'+
				' join mediadb.album using(albumId)'+
				' where albumId='+id+' and userId='+req.session.user+
				' order by song.addDate DESC';
		connection.query(query,function(err,data){
			data=data.map(function(item){
				return item.songId;
			})
			callback(err,data);
		})
    },
    function(callback){
    	var query='select songId from mediadb.favorites_songs'+
				' join mediadb.song using(songId)'+
				' join mediadb.album using(albumId)'+
				' where albumId='+id+' and userId='+req.session.user+
				' order by song.addDate DESC';
		connection.query(query,function(err,data){
			data=data.map(function(item){
				return item.songId;
			})
			callback(err,data);
		})
    },
    function(callback){
    	var query='select favoritesAlbumsId AS favorites from mediadb.favorites_albums where albumId='+
    			id+' and userId='+req.session.user;
		connection.query(query,function(err,data){
			var result=false;
			if(data.length>0){
				result=true;
			}
			callback(err,{'favorites':result});
		})
    },
	],
	function(err, result){
		if(err){
			res.next(true);
			return;
		}
		var album={};
		album=result[0];
		var date=new Date(album.date);
		album.date=date.toLocaleString();
		album.singers=result[1];
		album.posterUrl="files/albumPosters/"+album.posterUrl;
		album.songs=result[2].map(function(item,j){
			item.src="files/songs/"+item.src;
			item.canLike = (result[3].indexOf(item.songId)===-1) ? true : false;
			item.canFavorite = (result[4].indexOf(item.songId)===-1) ? true : false;
			return item;
		})
		album.canBeFavorite=!result[5].favorites;
		res.status(200).send(album);
	});
}