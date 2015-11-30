app.controller('RegistrationCtrl', ['$scope','MainService','$stateParams','$location','$mdDialog', function($scope,MainService,$stateParams,$location,$mdDialog){
	$scope.checkUsernames=function(){
		$scope.usernameError=false;
		$scope.usernameEmpty=false;
		$scope.usernameMinLength=false;
		if(!$scope.usernameToRegistr){
			$scope.usernameEmpty=true;
			return true;
		}
		if($scope.usernameToRegistr.length<4){
			$scope.usernameMinLength=true;
			return true;
		}
		if($scope.usernameToRegistr.length>=4){
			MainService.checkUsernames({'username':$scope.usernameToRegistr}).success(function(data,status){
				if(status==200){
					$scope.usernameError=true;
					return true;
				}
			});
		}
		return false;
	}	
	$scope.close=function(){
		$mdDialog.hide();
	}
	$scope.checkPasswords=function(){
		$scope.passwordsEmpty=false;
		$scope.minLengthErr=false;
		$scope.notEqual=false;
		var flag=false;
		if(!$scope.firstPassword || !$scope.secondPassword){
			return;
		}
		if($scope.firstPassword.length<8 || $scope.secondPassword.length<8){
			$scope.minLengthErr=true;
			flag=true;
		}
		if($scope.firstPassword!=$scope.secondPassword){
			$scope.notEqual=true;
			flag=true;
		}
		return !flag;
	}
	$scope.registration=function(){
		if(!$scope.checkUsernames()){
			if(!$scope.firstPassword || !$scope.secondPassword){
				$scope.passwordsEmpty=true;
				return;
			}
			if(!$scope.checkPasswords()){
				return;
			}
			$scope.registerUser={
				'username': $scope.usernameToRegistr,
				'firstPassword': $scope.firstPassword,
				'secondPassword':$scope.secondPassword
			}
			MainService.registration($scope.registerUser).success(function(data,status){
				$mdDialog.show(
				    $mdDialog.alert()
				      	.title('Alert')
				      	.content('Sign Up successfully')
				        .ok('OK')
			    );
			}).error(function(data,status){
				$mdDialog.show(
				    $mdDialog.alert()
				      	.title('Alert')
				      	.content('Sorry,An error has occurred')
				        .ok('OK')
			    );
			})
		}
	}
}]);
