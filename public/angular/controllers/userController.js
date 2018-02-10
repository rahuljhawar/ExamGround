myApp.controller('userController',['$http','apiService','$rootScope','authService','$location','$window',function($http,apiService,$rootScope,authService,$location,$window){

	var user = this;
	this.notify='';
	this.show=true;
	this.showOtpForm=false;
	this.showPasswordResetForm=false;
	//clear the form after submit
	this.resetForm=()=>{
		user.firstname='';
		user.lastname='';
		user.email='';
		user.mnumber='';
		user.password='';
	};
	//function to register user
	this.registerUser=()=>{

		user.notify='';
		var userData={
      name      : user.firstname+' '+user.lastname,
      email     : user.email,
      mnumber 	: user.mnumber,
      password  : user.password
    };
    apiService.signUp(userData).then( function successCallback(response){
				//console.log(response);
				user.notify=response.data.message;
				user.resetForm();


			},

      function errorCallback(response) {
       alert("some error occurred. Check the console.");
       console.log(response); 
     });


};
  	//function to login user
  	this.loginUser=()=>{
  		user.notify='';
  		var userData={
  			email     	: user.email,
  			password     : user.password

  		};
      apiService.login(userData).then( function successCallback(response){
				//console.log(response);
				if(!response.data.error){
					
					authService.setToken(response.data.token);
					$location.path('/dashboard');
				}
				user.notify=response.data.message;
			},

			function errorCallback(response) {
       alert("some error occurred. Check the console.");
       console.log(response); 
     });

    };

	//function to send resetpassword request
 this.sendOtpToEmail=()=>{
  user.notify='';
  var userData={email:user.email};

  apiService.forgotPasswordOtpSend(userData).then(function successCallback(response){
  			//console.log(response);
  			if(!response.data.error){
  				user.showOtpForm=true;

  			}

  			user.notify=response.data.message;
  			//userData.$setPristine();

  		},
  		function errorCallback(response) {
  			alert("some error occurred. Check the console.");
  			console.log(response); 
  		});


};

  	//function to verify otp
  	this.verifyOtp=()=>{
  		var otp={otp:user.otp};
  		user.notify='';
  		apiService.verifySentOtp(otp).then(function successCallback(response){
  			if(!response.data.error){
  				user.show=false;
  				user.showPasswordResetForm=true;
  			}

  			user.notify=response.data.message;
  			//otp.$setPristine();

  		},
  		function errorCallback(response) {
  			alert("some error occurred. Check the console.");
  			console.log(response); 
  		});


  	};

  	 	//function to reset password 
     this.resetPassword=()=>{
      user.notify='';
      var newPassword={password : user.password,cpassword:user.cpassword};
      apiService.resetPassword(newPassword).then(function successCallback(response){

       console.log(response);
       user.notify=response.data.message;
  			//newPassword.$setPristine();

  		},
  		function errorCallback(response) {
  			alert("some error occurred. Check the console.");
  			console.log(response); 
  		});


    };


  }]);

//Social login controller
myApp.controller('socialLoginController',['$stateParams','authService','$location',function($stateParams,authService, $location){
  //console.log($routeParams.token);
  authService.setToken($stateParams.token);
  $location.path('/dashboard');
}]);