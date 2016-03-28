var app = angular.module('chirpApp', ['ngRoute', 'ngResource', 'ngTable']).run(function($rootScope, $http) {
  $rootScope.authenticated = false;
  $rootScope.current_user = '';
  $rootScope.current_menu = '';

  $rootScope.signout = function(){
    $http.get('auth/signout');
    $rootScope.authenticated = false;
    $rootScope.current_user = '';
  };
});

  function ngReallyClick(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                var message = attrs.ngReallyMessage;
                if (message && confirm(message)) {
                    scope.$apply(attrs.ngReallyClick);
                }
            });
        }
    }
}
app.directive('ngReallyClick', ngReallyClick);


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
  return $resource('/user/:id', {id: "@id"});
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


app.controller('adminUserController', function($rootScope, $scope, $filter, userService, ngTableParams){
   $scope.users = userService.query();
  //$scope.users = [];
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

   /* $scope.usersTable = new ngTableParams({},
    { 
                // page size buttons (right set of buttons in demo)
        counts: [],
                        page: 1,
                count: 3,
        // determines the pager buttons (left set of buttons in demo)
        paginationMaxBlocks: 13,
        paginationMinBlocks: 2,
        dataset: $scope.users
    });
    */    
      $scope.editTableParams = function (id) {
        var result = userService.get({id: id});
        alert("Result " + result.username);
        alert("Id " + id);
      };
    
      $scope.deleteTableParams = function (id) {
         userService.delete({id: id});
      };
    

        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 3           // count per page
          //  sorting: {
           //     username : 'desc' // initial sorting
           // }
        }, {
            getData: function($defer, params) {
                userService.query(function(users) {
                         console.log("Users " + users);
                          console.log("$scope.users.length " + users.length);
                      // var orderedRecentActivity = params.sorting() ?
                     //                           $filter('orderBy')(users, params.orderBy()):
                     //                           username;
           
                     users = users.slice((params.page() - 1) * params.count(), params.page() * params.count());
                     params.total( users.length);
                     console.log("$scope.users.length 2 " + users.length);
                      $defer.resolve(users.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                                           console.log("$scope.users.length 3 " + users.length);
                });
            }
        })

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

