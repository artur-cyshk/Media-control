var app = angular.module('media', [
	'ui.router','btford.socket-io','ngMaterial','ngMessages'
]);

app.config(['$urlRouterProvider', '$stateProvider','$mdThemingProvider', function($urlRouterProvider, $stateProvider,$mdThemingProvider) {
        $mdThemingProvider.theme('myTheme','default')
        .primaryPalette('green',{
            'default':'900'
        })
        .warnPalette('red',{
            'default':'900'
        })
        .backgroundPalette('blue',{
            'default': '900'
        });
        $urlRouterProvider.otherwise('/home');
        $stateProvider
            .state('root',{
                abstract:true,
                templateUrl:'/templates/root.html',
                controller:'RootCtrl'
            })
            .state('root.profile',{
                url:'/profile',
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl'
            })
            .state('root.albumById',{
                url:'/album/:id',
                templateUrl: 'templates/album.html',
                controller: 'AlbumCtrl'
            })
            .state('root.albums',{
                url:'/albums',
                templateUrl: 'templates/albums.html',
                controller: 'AlbumsCtrl'
            })
            .state('root.search',{
                url:'/search/{str}',
                templateUrl:'templates/search.html',
                controller:'SearchCtrl'
            })
            .state('root.home',{
                url: '/home',
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl'
            })
            .state('login',{
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            })
        	.state('root.videos', {
        		url: '/videos',
        		templateUrl: 'templates/videos.html',
        		controller: 'VideosCtrl'
        	})
            .state('root.videoById',{
                url: '/video/:id',
                templateUrl: 'templates/videoById.html',
                controller: 'VideoCtrl'
            })
    }
])