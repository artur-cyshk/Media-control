app.controller('SearchCtrl', ['$scope','$stateParams','$location','MainService','socket', function($scope,$stateParams,$location,MainService,socket){
	MainService.authorized().success(function(data,status){
		if($stateParams.str.length>0){
			$scope.searchFinish=false;
			searchItems($stateParams.str);
		}else{
			 return $location.url('/home');
		}
	});
	socket.on('like',function(data){
		$scope.songs=$scope.songs.map(function(item){
			if(item.songId===data.id){
				if(data.canLike===true){
					item.songLikes++;
				}else{
					item.songLikes--;
				}
				if(data.userId===$scope.userId){
					item.canLike=!item.canLike;
				}
			}
			return item;
		})
	})
	socket.on('favorites',function(data){
		if (data.type===2){
			$scope.songs=$scope.songs.map(function(item){
				if(item.songId===data.id){
					if(data.userId===$scope.userId){
						item.canFavorite=!item.canFavorite;
					}
				}
				return item;
			});
		}
	})
	$scope.favoriteSong=function(id){
		var postData={
			'id':id,
			'type':2
		};
		MainService.favorites(postData).success(function(data,status){
			socket.emit('favorites',{'type':2,'id':id});
			if(status==200){
				$scope.songs=$scope.songs.map(function(item){
					if(item.songId===id){
						item.canFavorite=!item.canFavorite;
					}
					return item;
				});	
			}
		});
	}
	$scope.likeSong=function(id){
		var postData={
			'id':id,
			'type':1
		}
		MainService.like(postData).success(function(data,status){
			if(status==200){
				socket.emit('like',{'canLike':data,'id':id});
				$scope.songs=$scope.songs.map(function(item){
					if(item.songId===id){
						if(data===true){
							item.songLikes++;
						}else{
							item.songLikes--;
						}
						item.canLike=!data;
					}
					return item;
				})
			}
		});
	}

	function searchItems(str){
		MainService.searchMedia({'type':0,'searchStr':str}).success(function(data,status){
			$scope.videos=data.map(function(item){
				item.posterUrl='files/videosPosters/'+item.posterUrl;
				return item;
			});
		}).error(function(){
			$scope.videosNotFound=true;
		});
		MainService.searchMedia({'type':1,'searchStr':str}).success(function(data,status){
			$scope.albums=data.map(function(item){
				item.posterUrl='files/albumPosters/'+item.posterUrl;
				return item;
			});
		}).error(function(){
			$scope.albumsNotFound=true;
		});
		MainService.searchSongs({'searchStr':str}).success(function(data,status){
			$scope.songs=data;
			$scope.songs=$scope.songs.map(function(song){
				song.singers=song.singers.join(',');
				return song;
			})
			$scope.searchFinish=true;
		}).error(function(){
			$scope.searchFinish=true;
			$scope.songsNotFound=true;
		});

	}
}]);