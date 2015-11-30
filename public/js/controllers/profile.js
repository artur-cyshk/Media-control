app.controller('ProfileCtrl', ['$scope','$location','MainService','socket','$mdDialog', function($scope,$location,MainService,socket,$mdDialog){
	MainService.authorized().success(function(data,status){
		$scope.visible=false;
		getUsername();
		getProfileInfo();
	});
	socket.on('username',function(data){
		$scope.currentUsername=data.username;
	})
	$scope.showAdvanced = function(ev) {
	    $mdDialog.show({
	     	controller: 'ChangeProfileCtrl',
	      	templateUrl: 'templates/changeProfile.html',
	      	parent: angular.element(document.body),
	      	targetEvent: ev,
	      	clickOutsideToClose:true
	    });
	};
	function isEmpty(object) {
		for(key in object){
			if(key!=='$$hashKey'){
				return false;
			}
		}
		return true;
	}
	socket.on('like',function(data){
		if(isEmpty($scope.favoritesSongs)){
			return;
		}
		$scope.favoritesSongs=$scope.favoritesSongs.map(function(item){
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
		if(data.userId===$scope.userId){
			switch(data.type){
				case 0:
					if(isEmpty($scope.favoritesVideos)){
						return;
					}
					$scope.favoritesVideos=$scope.favoritesVideos.filter(function(item){
						return (item.videoId===data.id) ? false : true; 
					})
					break;
				case 1:
					if(isEmpty($scope.favoritesAlbums)){
						return;
					}
					$scope.favoritesAlbums=$scope.favoritesAlbums.filter(function(item){
						return (item.albumId===data.id) ? false : true; 
					})
					break;
				case 2:
					if(isEmpty($scope.favoritesSongs)){
						return;
					}
					$scope.favoritesSongs=$scope.favoritesSongs.filter(function(item){
						return (item.songId===data.id) ? false : true; 
					})
					break;
				default:
					break;
			}
			if(isEmpty($scope.favoritesAlbums)){
				$scope.albumsNotFound=true;
			}
			if(isEmpty($scope.favoritesVideos)){
				$scope.videosNotFound=true;
			}
			if(isEmpty($scope.favoritesSongs)){
				$scope.songsNotFound=true;
			}
		}
	})
	function getProfileInfo(){
		MainService.favoritesMedia({'type':0}).success(function(data,status){
			$scope.favoritesVideos=data.map(function(item){
				item.posterUrl='files/videosPosters/'+item.posterUrl;
				return item;
			});
		}).error(function(){
				$scope.videosNotFound=true;
		});
		MainService.favoritesMedia({'type':1}).success(function(data,status){
			$scope.favoritesAlbums=data.map(function(item){
				item.posterUrl='files/albumPosters/'+item.posterUrl;
				return item;
		});
		}).error(function(){
				$scope.albumsNotFound=true;
		});
		MainService.favoritesSongs().success(function(data,status){
			$scope.favoritesSongs=data;
			$scope.favoritesSongs=$scope.favoritesSongs.map(function(song){
				song.singers=song.singers.join(',');
				return song;
			})
			$scope.visible=true;
		}).error(function(){
			$scope.visible=true;
			$scope.songsNotFound=true;
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
				$scope.favoritesSongs=$scope.favoritesSongs.map(function(item){
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

	$scope.deleteFromFavorites=function(type,id){
		var deleteObj={
			'type':type,
			'id':id
		};
		MainService.deleteFromFavorites(deleteObj).success(function(data,status){
			socket.emit('favorites',deleteObj);
			switch(type){
				case 0:
					$scope.favoritesVideos=$scope.favoritesVideos.filter(function(item){
						return (item.videoId===id) ? false : true; 
					})
					break;
				case 1:
					$scope.favoritesAlbums=$scope.favoritesAlbums.filter(function(item){
						return (item.albumId===id) ? false : true; 
					})
					break;
				case 2:
					$scope.favoritesSongs=$scope.favoritesSongs.filter(function(item){
						return (item.songId===id) ? false : true; 
					})
					break;
				default:
					break;
			}
			if(isEmpty($scope.favoritesAlbums)){
				$scope.albumsNotFound=true;
			}
			if(isEmpty($scope.favoritesVideos)){
				$scope.videosNotFound=true;
			}
			if(isEmpty($scope.favoritesSongs)){
				$scope.songsNotFound=true;
			}
		});
	}
	function getUsername(){
		MainService.user().success(function(data,status){
			$scope.currentUsername=data.username;
		})
	}
}]);