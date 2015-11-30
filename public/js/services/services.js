app.factory('MainService', ['$http', function($http){
	return {
		media: function (data) {
			return $http.post('/media',data);
		},
		deleteFromFavorites:function(data){
			return $http.post('/deleteFromFavorites',data);
		},
		user:function(){
			return $http.get('/userById');
		},
		changePassword:function(data){
			return $http.post('/changePassword',data);
		},
		changeUsername:function(data){
			return $http.post('/changeUsername',data);
		},
		popularSongs:function(){
			return $http.get('/popularSongs');
		},
		favoritesMedia:function(data){
			return $http.post('/favoritesMedia',data);
		},
		favoritesSongs:function(){
			return $http.get('/favoritesSongs');
		},
		searchMedia:function(data){
			return $http.post('/searchMedia',data);
		},
		searchSongs:function(data){
			return $http.post('/searchSongs',data);
		},
		popularMedia:function(data){
			return $http.post('/popular',data);
		},
		persons: function (data) {
			return $http.post('/persons',data);
		},
		searchVideos:function(search){
			return $http.post('/searchVideos',search);
		},
		genres: function () {
			return $http.get('/genres');
		},
		videoById: function (id) {
			return $http.get('/video/'+id);
		},
		albumById:function(id){
			return $http.get('/album/'+id)
		},
		like: function (data) {
			return $http.post('/like/',data);
		},
		watch: function (id) {
			return $http.get('/watch/'+id);
		},
		favorites: function (data) {
			return $http.post('/favorites',data);
		},
		comment: function (data) {
			return $http.post('/comment/',data);
		},
		login: function (user) {
			return $http.post('/login',user);
		},
		registration: function (user) {
			return $http.post('/registration',user);
		},
		authorized:function(){
			return $http.get('/authorized');
		},
		checkUsernames:function(user){
			return $http.post('/checkUsernames',user);
		}
	}
}])

app.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});