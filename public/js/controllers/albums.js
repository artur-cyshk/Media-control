app.controller('AlbumsCtrl', ['$scope','MainService','$location','$stateParams', function($scope,MainService,$location,$stateParams){
	MainService.authorized().success(function(data,status){
		postAlbums(1);
	});
	$scope.getAlbums=function(){
		postAlbums($scope.page);
	}
	function postAlbums(page){
		var postData={
			'page': page,
			'type': 1
		}
		MainService.media(postData).success(function(data,status){
			$scope.visible=true;
			$scope.visibleNext=false;
			if(page===1){
				$scope.albums=[];
			}
			data.forEach(function(item){
				item.singers=item.singers.map(function(item){
					return item;
				}).join(',');
				$scope.albums.push(item);
			})
			postData.page=postData.page+1;
			MainService.media(postData).success(function(data,status){
				$scope.visibleNext=true;
			}).error(function(data,status){
				$scope.visibleNext=false;
			})
			$scope.page=page+1;
			delete $scope.albumError;
		}).error(function(data,status){
			if(page===1){
				$scope.visible=false;
				$scope.albumError=true;
				delete $scope.albums;
			}
			$scope.visibleNext=false;
		});
	}
}]);