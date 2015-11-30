app.controller('AlbumCtrl', ['$scope','MainService','$stateParams','socket','$location', function($scope,MainService,$stateParams,socket,$location){
	MainService.authorized().success(function(data,status){
		getAlbumById();
	});
	socket.on('like',function(data){
		$scope.album.songs=$scope.album.songs.map(function(item){
			if(item.songId===data.id){
				if(data.canLike===true){
					item.songLikes++;
				}else{
					item.songLikes--;
				}
			if($scope.userId===data.userId){
				item.canLike=!item.canLike;
			}
			}
			return item;
		})
	})
	socket.on('favorites',function(data){
		switch (data.type){
			case 2:
				$scope.album.songs=$scope.album.songs.map(function(item){
					if(item.songId===data.id){
						if(data.userId===$scope.userId){
							item.canFavorite=!item.canFavorite;
						}
					}
					return item;
				});
				break;
			case 1:
				if($scope.userId===data.userId){
					$scope.album.canBeFavorite=!$scope.album.canBeFavorite;
				};
				break;
			default:
				break;
		}
	})

	$scope.likeSong=function(id){
		var postData={
			'id':id,
			'type':1
		}
		MainService.like(postData).success(function(data,status){
			if(status==200){
				socket.emit('like',{'canLike':data,'id':id});
				$scope.album.songs=$scope.album.songs.map(function(item){
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


	$scope.favoriteAlbum=function(){
		var postData={
			'id':$stateParams.id,
			'type':1
		}
		MainService.favorites(postData).success(function(data,status){
			if(status==200){
				socket.emit('favorites',{'type':1});
				$scope.album.canBeFavorite=!data;
			}
		});
	}

	$scope.favoriteSong=function(id){
		var postData={
			'id':id,
			'type':2
		}
		MainService.favorites(postData).success(function(data,status){
			if(status==200){
				socket.emit('favorites',postData);
				$scope.album.songs=$scope.album.songs.map(function(item){
					if(item.songId===id){
						item.canFavorite=!data;
					}
					return item;
				})
			}
		});
	}
	function getAlbumById(){
		MainService.albumById($stateParams.id).success(function(data,status){
			$scope.album=data;
			$scope.visible=true;
		}).error(function(data){
			$scope.visible=false;
		})
	}

}]);