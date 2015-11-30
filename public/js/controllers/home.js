app.controller('HomeCtrl', ['$scope','$location','MainService','socket', function($scope,$location,MainService,socket){
	MainService.authorized().success(function(data,status){
		$scope.visible=false;
		getPopular();
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
		$scope.songs.sort(sortSongs);
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
	function sortSongs(a,b){
		if(a.songLikes>=b.songLikes){
			return -1;
		}else{
			return 1;
		}
	}
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
				$scope.songs.sort(sortSongs);
			}
		});
	}
	function getPopular(){
		MainService.popularMedia({'type':0}).success(function(data,status){
			$scope.videos=data.map(function(item){
				item.posterUrl='files/videosPosters/'+item.posterUrl;
				return item;
			});
		});
		MainService.popularMedia({'type':1}).success(function(data,status){
			$scope.albums=data.map(function(item){
				item.posterUrl='files/albumPosters/'+item.posterUrl;
				return item;
			});
		});
		MainService.popularSongs().success(function(data,status){
			$scope.visible=true;
			$scope.songs=data;
			$scope.songs=$scope.songs.map(function(song){
				song.singers=song.singers.join(',');
				return song;
			})
		});
	}
}]);