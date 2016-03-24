var app = angular.module('chirpApp', ['ngRoute', 'ngResource']).run(function($rootScope, $http) {
  $rootScope.authenticated = false;
  $rootScope.current_user = '';
  $rootScope.current_menu = '';

  $rootScope.signout = function(){
    $http.get('auth/signout');
    $rootScope.authenticated = false;
    $rootScope.current_user = '';
  };
});

app.config(function($routeProvider){
	$routeProvider
		//the timeline display
		.when('/', {
			templateUrl: 'main.html',
			controller: 'mainController'
		})
		//the login display
		.when('/login', {
			templateUrl: 'login.html',
			controller: 'authController'
		})
		//the signup display
		.when('/register', {
			templateUrl: 'register.html',
			controller: 'authController'
		})
        //the admin user display
		.when('/user', {
			templateUrl: 'adminuser.html',
			controller: 'adminUserController'
		});
});

app.factory('postService', function($resource){
  return $resource('/api/posts/:id');
});

app.factory('userService', function($resource){
  return $resource('/user/:id');
});
/*
app.factory('postService', function($http){
  var baseUrl = "/api/posts";
  var factory = {};
  factory.getAll = function(){
    return $http.get(baseUrl);
  };
  return factory;
});*/

app.controller('mainController', function($rootScope, $scope, postService){
	$scope.posts = postService.query();
	$scope.newPost = {created_by: '', text: '', created_at: ''};
	$rootScope.current_menu = 'timeline';
   /* postService.getAll().success(function(data){
        $scope.posts = data;
    });
     */   
	$scope.post = function() {
	  $scope.newPost.created_by = $rootScope.current_user;
	  $scope.newPost.created_at = Date.now();
	  postService.save($scope.newPost, function(){
	    $scope.posts = postService.query();
	    $scope.newPost = {created_by: '', text: '', created_at: ''};
	  });
	};
});

app.controller('adminUserController', function($rootScope, $scope, userService){
    $scope.users = userService.query();
    
    $rootScope.current_menu = 'adminuser';
	/*$scope.newPost = {created_by: '', text: '', created_at: ''};
	
   
	$scope.post = function() {
	  $scope.newPost.created_by = $rootScope.current_user;
	  $scope.newPost.created_at = Date.now();
	  postService.save($scope.newPost, function(){
	    $scope.posts = postService.query();
	    $scope.newPost = {created_by: '', text: '', created_at: ''};
	  });
	};*/ 
});



app.controller('authController', function($scope, $http, $rootScope, $location){
  $scope.user = {username: '', password: ''};
  $scope.error_message = '';

  $scope.login = function(){
    $http.post('/auth/login', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
  };

  $scope.register = function(){
    $http.post('/auth/signup', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
  };
});

