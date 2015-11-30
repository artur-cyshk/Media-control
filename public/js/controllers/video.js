app.controller('VideoCtrl', ['$element','$scope','MainService','$stateParams','socket','$location', function($element,$scope,MainService,$stateParams,socket,$location){
	MainService.authorized().success(function(data,status){
		$scope.visible=false;
		getVideoById();
	});	
	socket.on('comment',function(data){
		$scope.comments=data;
	})
	socket.on('like',function(data){
		if(data.canLike===true){
			$scope.likes++;
		}else{
			$scope.likes--;
		}
		if($scope.userId===data.userId){
			$scope.likeStatus=!$scope.likeStatus;
		}
	})
	socket.on('favorites',function(data){
		if (data.type===0){
			if($scope.userId===data.userId){
				$scope.favoritesStatus=!$scope.favoritesStatus;
			}
		}
	})
	socket.on('watch',function(){
		$scope.watchings++;
	})


	$scope.like=function(){
		var postData={
			'id':$stateParams.id,
			'type':0
		}
		MainService.like(postData).success(function(data,status){
			if(status==200){
				socket.emit('like',{'canLike':data});
				if(data===true){
					$scope.likes++;
				}else{
					$scope.likes--;
				}
				$scope.likeStatus=data;
			}
		});
	}

	$element.find('video')[0].addEventListener('ended',function(){
		MainService.watch($stateParams.id).success(function(data,status){
			$scope.watchings++;
			socket.emit('watch');
		})
	})

	$scope.favorites=function(){
		var postData={
			'id':$stateParams.id,
			'type':0
		}
		MainService.favorites(postData).success(function(data,status){
			if(status==200){
				socket.emit('favorites',{'type':0});
				$scope.favoritesStatus=data;
			}
		});
	}
	
	$scope.comment=function(){
		if(!$scope.commentString){
			return;
		}
		body={
			'id': $stateParams.id,
			'commentString': $scope.commentString
		}
		MainService.comment(body).success(function(data,status){
			$scope.comments=data;
			socket.emit('comment',$scope.comments);
		});
	}

	function getVideoById(){
		MainService.videoById($stateParams.id).success(function(data,status){
			$scope.video=data[0];
			$scope.video.videoSrc="/files/videos/"+data[0].src;
			$scope.actors=data[1];
			$scope.likes=data[2].likes;
			$scope.comments=data[3];
			$scope.watchings=data[4].watchings;
			$scope.favoritesStatus=data[5].favorites;
			$scope.likeStatus=data[6].likeFromUser;
			$scope.visible=true;
		})
	}
}]);