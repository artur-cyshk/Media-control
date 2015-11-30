app.controller('ChangeProfileCtrl', ['$scope','$location','MainService','socket','$mdDialog',function($scope,$location,MainService,socket,$mdDialog){
	MainService.user().success(function(data,status){
		$scope.myUsername=data.username;
		$scope.usernameToEdit=data.username;
	})
	$scope.checkUsernames=function(){
		$scope.usernameError=false;
		$scope.usernameEmpty=false;
		$scope.usernameMinLength=false;
		if(!$scope.usernameToEdit){
			$scope.usernameEmpty=true;
			return true;
		}
		if($scope.usernameToEdit.length<4){
			$scope.usernameMinLength=true;
			return true;
		}
		if($scope.usernameToEdit.length>=4){
			if($scope.usernameToEdit!=$scope.myUsername){
				MainService.checkUsernames({'username':$scope.usernameToEdit}).success(function(data,status){
					if(status==200){
						$scope.usernameError=true;
						return true;
					}
				});
			}
		}
		return false;
	}	
	$scope.changeUsername=function(){
		if(!$scope.checkUsernames()){
			MainService.changeUsername({'username':$scope.usernameToEdit}).success(function(data,status){
				socket.emit('username',{'username':$scope.usernameToEdit});
				$scope.myUsername=$scope.usernameToEdit;
				$mdDialog.show(
			      $mdDialog.alert()
			      	.title('Alert')
			      	.content('Username successfully changed')
			        .ok('OK')
		    	);
			}).error(function(){
				$mdDialog.show(
			      $mdDialog.alert()
			      	.title('Alert')
			      	.content('Sorry,An error has occurred')
			        .ok('OK')
		    	);
			})
		}
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
	$scope.changePassword=function(){
		if(!$scope.firstPassword || !$scope.secondPassword){
			$scope.passwordsEmpty=true;
			return;
		}
		if(!$scope.checkPasswords()){
			return;
		}
		var passwords={
			'firstPassword': $scope.firstPassword,
			'secondPassword': $scope.secondPassword
		}
		MainService.changePassword(passwords).success(function(data,status){
			$mdDialog.show(
			    $mdDialog.alert()
			      	.title('Alert')
			      	.content('Password successfully changed')
			        .ok('OK')
		    );
		}).error(function(){
			$mdDialog.show(
			    $mdDialog.alert()
			      	.title('Alert')
			      	.content('Sorry,An error has occurred')
			        .ok('OK')
		    );
		})
	}
}]);