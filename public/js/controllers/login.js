app.controller('LoginCtrl', ['$scope','MainService','$stateParams','$location','$mdDialog', function($scope,MainService,$stateParams,$location,$mdDialog){
	$scope.hide=true;
	MainService.authorized().success(function(data,status){
		if(status==200){
			$location.url('/home');
		}
	}).error(function(data,status){
		if(status==403){
			$scope.hide=false;
		}
	})
	$scope.showAdvanced = function(ev) {
	    $mdDialog.show({
	     	controller: 'RegistrationCtrl',
	      	templateUrl: 'templates/registration.html',
	      	parent: angular.element(document.body),
	      	targetEvent: ev,
	      	clickOutsideToClose:true
	    });
	};
	$scope.makeValid=function(){
		$scope.usernameEmpty=false;
		$scope.passwordEmpty=false;
	}
	$scope.login=function(){
		if(!$scope.user){
			$scope.usernameEmpty=true;
			$scope.passwordEmpty=true;
			return;
		}
		if(!$scope.user.username){
			$scope.usernameEmpty=true;
			return;			
		}
		if(!$scope.user.password){
			$scope.passwordEmpty=true;
			return;			
		}
		delete $scope.error;
		MainService.login($scope.user).success(function(data,status){
			$location.url('/home');
		}).error(function(data,status){
			$scope.error={};
			switch (data.error){
				case 'incorrectUsername':
					$scope.error.username=true;
					break;
				case 'incorrectPassword':
					$scope.error.password=true;
					break;
				default:
					break;
			}
			console.log($scope.error);
		});
	}
}]);