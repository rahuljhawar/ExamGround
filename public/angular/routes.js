myApp.config(['$stateProvider','$urlRouterProvider','$locationProvider', function($stateProvider,$urlRouterProvider,$locationProvider) {


    $stateProvider
    .state('main',{
        url:'/',
        templateUrl	: 'views/main.html'

    })
    .state('login',{
      url           :'/login',
      templateUrl    : 'views/login.html',
      controller     : 'userController as userCtrl',
      resolve: {
        "check": function ($location,authService) {
            if (authService.getToken()) {

                $location.path('/dashboard');

            } else {
                $location.path('/login');

            }
        }
    }

})

    .state('signup',{
        url            : '/signup',
        templateUrl    : 'views/signup.html',
        controller     : 'userController as userCtrl'

    })
    .state('forgotpass',{
        url            : '/forgotpass',
        templateUrl    : 'views/forgot-pass.html',
        controller     : 'userController as userCtrl'

    })
    .state('dashboard',{
        url            : '/dashboard',
        templateUrl    : 'views/dashboard.html',
        controller     : 'dashController as dashCtrl',
        resolve: {
            "check": function ($location,authService) {
                if (authService.getToken()) {

                    $location.path('/dashboard/index');

                } else {
                    $location.path('/login');

                }
            }
        }
    })
    .state('dashboard.index',{
        url            : '/index',
        templateUrl    : 'views/index.html',
        controller     : 'dashController as dashCtrl'
    })
    .state('dashboard.createtest',{
        url            : '/createtest',
        templateUrl    : 'views/create-test.html',
        controller   : 'testController as testCtrl'     
    })
    .state('dashboard.edittest',{
        url            : '/edittest/:tid',
        templateUrl    : 'views/edit-test.html',
        controller   : 'testController as testCtrl'  
    })
    .state('dashboard.quesoperation',{
        url            : '/quesops',
        templateUrl    : 'views/question-operations.html',
        controller   : 'testController as testCtrl'  
    })
    .state('dashboard.allusers',{
        url            : '/allusers/:tid',
        templateUrl    : 'views/allusers.html',
        controller   : 'testController as testCtrl'  
    })
    .state('dashboard.userperformances',{
        url            : '/userperformances',
        templateUrl    : 'views/userperformances.html',
        controller   : 'dashController as dashCtrl'  
    })
    .state('dashboard.livetest',{
        url            : '/livetest/:tid',
        templateUrl    : 'views/live-test.html',
        controller     : 'livetestController  as liveCtrl'  
    })
    .state('dashboard.result',{
        url            : '/result/:tid',
        templateUrl    : 'views/result.html',
        controller     : 'resultsController  as resultCtrl'  
    })
    .state('dashboard.tests',{
        url            : '/tests',
        templateUrl    : 'views/available-tests.html',
        controller     : 'testController as testCtrl',
        resolve: {
            "check": function ($location,authService) {
                if (authService.getToken()) {

                    $location.path('/dashboard/tests');

                } else {
                    $location.path('/login');

                }
            }
        }
    })

    .state('facebook',{
        url            : '/facebook/:token',
        templateUrl    : 'views/dashboard.html',
        controller     : 'socialLoginController as socialCtrl'
    })
    .state('google',{ 
        url            : '/google/:token',
        templateUrl    : 'views/dashboard.html',
        controller     : 'socialLoginController as socialCtrl'
    })

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);

    
}]);