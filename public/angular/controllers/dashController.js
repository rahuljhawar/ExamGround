myApp.controller('dashController',['$http','$q','apiService','authService','$rootScope','$location','$filter',function($http,$q,apiService,authService,$rootScope,$location,$filter){
	var dash = this;

	//check whether the user is logged in
	this.loggedIn=()=>{
		if(authService.isLoggedIn()){
			return 1;

		}
		else{
			return 0;
		}
	};
	//getting the user detail and checking whether the user is admin or not
	this.getUserDetail=()=>{
		if(authService.isLoggedIn()){
			apiService.getUser().then(function successCallBack(response){
				if(response.data.error){
					alert("Authentication failed! Token Expired");
					dash.logout();

				}else{
				//console.log(response);
				$rootScope.name=response.data.name;
				$rootScope.email=response.data.email;
				if(response.data.email === 'admin@examground.com'){
					$rootScope.admin = true;
					
				}else{
					$rootScope.admin = false;
					
				}
				
		
			}
		});
		}	
	};

	//get the no. of tests
	
	this.getNoOfTests = ()=>{
		apiService.getTests().then(function successCallBack(response){
			//console.log(response);
			//store the no. of available test
			dash.testArrayLength = response.data.data.length;

			
		},
		function errorCallback(response) {
			alert("some error occurred. Check the console.");
			console.log(response); 
		});

	};

	//get the no of questions in a particular test
	this.noOfQuestions = (testid)=>{
		test.testid=parseInt(testid);
		test.questions = [];
		apiService.viewQuestions(testid).then(function successCallBack(response){
			//console.log(response);
			response.data.data.forEach(function(q){
				test.questions.push(q);

			});

		},
		function errorCallback(response) {
			alert("some error occurred. Check the console.");
			console.log(response); 
		});

	};

	//get all the users to display in the admin panel
	
	this.allusers = ()=>{
	
		$q.all([
			apiService.getLocalUsers(),
			apiService.getSocialUsers()
			]).then(function(users) {
				var localusers=users[0].data.data;
				var socialusers=users[1].data.data;
				dash.alluser=localusers.concat(socialusers);
			});

	};

	// get my overall performance for all the test	
	this.myPerformance=()=>{
		apiService.getallperformances().then(function successCallBack(response){
			
			var myperformances = response.data.data;
			// filtering my performances from all the performances
			dash.myfilteredPerformances=$filter('filter')(myperformances,{userEmail:$rootScope.email});
			// Counting percentages for each test 
			var mytestPercentages = dash.myfilteredPerformances.map(a => ((a.score/(a.questionCount * 2)).toFixed(2))/1 );
			var total=0;
			//finding the average of all the test
			for(let i = 0; i < mytestPercentages.length; i++) {
				total += mytestPercentages[i];
			}
			
			dash.myavgPerformance = (total / mytestPercentages.length).toFixed(2);
			dash.mybestPerformance = Math.max.apply(Math, mytestPercentages);
			dash.myworstPerformance = Math.min.apply(Math, mytestPercentages);
		},
		function errorCallback(response) {
			alert("some error occurred. Check the console.");
			console.log(response); 
		});
	};

	//getting overall performances of all the users for admin panel
	this.userPerformances=(email)=>{

		apiService.getallperformances().then(function successCallBack(response){
			
			var performances = response.data.data;

			dash.filteredPerformances=$filter('filter')(performances,{userEmail:email});

			var testPercentages = dash.filteredPerformances.map(a => ((a.score/(a.questionCount * 2)).toFixed(2))/1 );
			var total=0;
			for(let i = 0; i < testPercentages.length; i++) {
				total += testPercentages[i];
			}
		
			dash.avgPerformance = (total / testPercentages.length).toFixed(2);
			dash.bestPerformance = Math.max.apply(Math, testPercentages);
			dash.worstPerformance = Math.min.apply(Math, testPercentages);

		 $('#performanceModal').modal('show');
		},
		function errorCallback(response) {
			alert("some error occurred. Check the console.");
			console.log(response); 
		});
	};

		//function to logout the user
  	this.logout=()=>{
  		//clear the local storage
  		delete $rootScope.admin;
  		delete $rootScope.name;
  		authService.setToken();
  		$location.path('/login');
  	}


  }]);