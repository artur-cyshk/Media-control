app.controller('VideosCtrl', ['$scope','$location','MainService','$stateParams', function($scope,$location,MainService,$stateParams){
	MainService.authorized().success(function(data,status){
		postVideos(1);
	});	
	MainService.persons({'type':0}).success(function(data,status){
		$scope.actors=data;
	})
	MainService.genres().success(function(data,status){
		$scope.genres=data;
	})
	MainService.persons({'type':1}).success(function(data,status){
		$scope.directors=data;
	})

	$scope.getVideos=function(){
		page=$scope.page;
		type=$scope.type;
		switch(type){
			case 'main':
				postVideos(page);
				break;
			case 'search':
				searchVideos(page);
				break;
			default:
				break;
		}
	}

	$scope.getSearchedVideos=function(){
		searchVideos(1);
	}
	function isEmpty(object) {
		for(key in object){
			if(key!=='$$hashKey'){
				return false;
			}
		}
		return true;
	}

	function searchVideos(page){
		delete $scope.searchFormError;
		if(!$scope.search || (!$scope.search.name && !$scope.search.date && isEmpty($scope.search.genre) && isEmpty($scope.search.actors) && isEmpty($scope.search.director))){
			$scope.searchFormError=true;
			return;
		}
		$scope.searching=true;
		$scope.search.page=page;
		MainService.searchVideos($scope.search).success(function(data,status){
			$scope.visibleNext=false;
			if(page===1){
				$scope.videos=[];
			}
			data.forEach(function(item){
				$scope.videos.push(item);
			})
			$scope.type='search';
			$scope.search.page=page+1;
			MainService.searchVideos($scope.search).success(function(data,status){
				$scope.visibleNext=true;
			}).error(function(data,status){
				$scope.visibleNext=false;
			})
			$scope.page=page+1;
			delete $scope.searchError;
			$scope.searching=false;
		}).error(function(data,status){
			if(page===1){
				$scope.searching=false;
				delete $scope.videos;
				$scope.searchError=true;
			}
			$scope.searching=false;
			$scope.visibleNext=false;
		})
	}
	function postVideos(page){
		var postData={
			'page': page,
			'type': 0
		}
		MainService.media(postData).success(function(data,status){
			$scope.visibleNext=false;
			$scope.type='main';
			if(page===1){
				$scope.videos=[];
			}
			data.forEach(function(item){
				$scope.videos.push(item);
			})
			postData.page=postData.page+1;
			MainService.media(postData).success(function(data,status){
				$scope.visibleNext=true;
			}).error(function(data,status){
				$scope.visibleNext=false;
			})
			$scope.page=page+1;
			delete $scope.videoError;
			$scope.visible=true;
		}).error(function(data,status){
			if(page===1){
				$scope.videoError=true;
				delete $scope.videos;
			}
			$scope.visible=true;
			$scope.visibleNext=false;
		});
	}
}]);