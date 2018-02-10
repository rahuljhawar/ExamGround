myApp.controller('testController',['$http','$window','$stateParams','$filter','apiService','authService','$rootScope','$location','$state',function($http,$window,$stateParams,$filter,apiService,authService,$rootScope,$location,$state){
	
	var test = this;
	this.tests=[];

	// to reset the form after submission
	this.resetForm=()=>{
		test.testid='',
		test.question='',
		test.optionA='',
		test.optionB='',
		test.optionC='',
		test.optionD='',
		test.answer=''
	};

	// to show test time in instruction modal
	this.showTestTimeInModal=(tid)=>{
		//as well as make them global so that it can be used by the livetestcontroller
		test.testtime=$window.time;
		$rootScope.testid=tid;
		$('#instructionModal').modal('show');
	};

	// directing to the run test page
	this.runTest = ()=>{
		$location.path('/dashboard/livetest/'+$rootScope.testid);
	}

	// function to create the test
	this.createTest=()=>{
		test.notify='';
		var testData={
			title      : test.testName,
			description : test.testDesc,
			time   		: test.testTime,
			instructions  : test.testInstructions
		};
		apiService.createTest(testData).then( function successCallback(response){
			//console.log(response);
			alert(response.data.message);
			$location.path('/dashboard/tests');
			
		},

		function errorCallback(response) {
			alert("some error occurred. Check the console.");
			console.log(response); 
		});

	};

	//get the testid from the parameter
 	var tid=$stateParams.tid;

 	// function to edit test
	this.editTest=()=>{
		apiService.viewTest(tid).then( function successCallback(response){
			console.log(response);
			 test.testName=response.data.data.title;
			 test.testDesc=response.data.data.description;
			 test.testTime=response.data.data.time;
			 test.testInstructions=response.data.data.instructions;


	});
	};
	//function to submit the edited test
	this.submitEditedTest=()=>{
		//console.log(tid);
		var testData={
			id		   : tid,	
			title      : test.testName,
			description : test.testDesc,
			time	   	: test.testTime,
			instructions  : test.testInstructions
		};

		apiService.updateTest(testData).then( function successCallback(response){
			//console.log(response);
			alert(response.data.message);
			$location.path('/dashboard/tests');
			
		},

		function errorCallback(response) {
			alert("some error occurred. Check the console.");
			console.log(response); 
		});
	}

	//function to delete the test
	this.deleteTest=(testid)=>{
		if(confirm("Are You Sure you want to delete the test?")){
		apiService.deleteTest(testid).then( function successCallback(response){
			alert(response.data.message);
			$state.reload();
		},
		function errorCallback(response) {
			alert("some error occurred. Check the console.");
			console.log(response); 
		});
	}
	};


	//get the available tests
	
	this.viewTests = ()=>{
		apiService.getTests().then(function successCallBack(response){
			//console.log(response);
			response.data.data.forEach(function(t){
				test.tests.push(t);

			});
			test.testArrayLength = test.tests.length;
			
		},
		function errorCallback(response) {
			alert("some error occurred. Check the console.");
			console.log(response); 
		});

	};
	this.viewTests();

	// function to create question 
	this.createQuestion=()=>{
		test.notify='';
		var questionData={
			id		: test.testid,
			question: test.question,
			optionA : test.optionA,
			optionB : test.optionB,
			optionC : test.optionC,
			optionD : test.optionD,
			answer	: test.answer
		};
		apiService.createQuestion(questionData).then( function successCallback(response){
			//console.log(response);
			alert(response.data.message);
			test.resetForm();
			
		},

		function errorCallback(response) {
			alert("some error occurred. Check the console.");
			console.log(response); 
		});

	};

	//function to view questions present in the test
	this.viewQuestions = (testid)=>{
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

	//function to delete a question
	this.deleteQuestion=(qid)=>{
	
		if(confirm("Are You Sure you want to delete the question?")){
		apiService.deleteQuestion(test.testid,qid).then( function successCallback(response){
			alert(response.data.message);
			test.viewQuestions(test.testid);
		},
		function errorCallback(response) {
			alert("some error occurred. Check the console.");
			console.log(response); 
		});
	}
	};

	// function to edit a question
	this.editQuestion=(qid)=>{
		apiService.viewQuestions(test.testid).then( function successCallback(response){
			//console.log(response);
			var obj = $filter('filter')(response.data.data, {_id: qid}, true)[0];
			test.questionid=obj._id;
			test.question=obj.question;
			test.optionA =obj.optionA;
			test.optionB =obj.optionB;
			test.optionC =obj.optionC;
			test.optionD =obj.optionD;
			test.answer	=obj.answer;


	});
	};

	// function to submit editted question
	this.submitEditedQuestion=()=>{
		test.notify='';
		var questionData={
			question: test.question,
			optionA : test.optionA,
			optionB : test.optionB,
			optionC : test.optionC,
			optionD : test.optionD,
			answer	: test.answer
		};
		apiService.updateQuestion(questionData,test.questionid).then( function successCallback(response){
			//console.log(response);
			alert(response.data.message);
			
		},

		function errorCallback(response) {
			alert("some error occurred. Check the console.");
			console.log(response); 
		});
	};
	//function to get the users who attempted the test
	this.enrolledUsers=()=>{
		test.loading = true;
		apiService.getallusertestdetails(tid).then( function successCallback(response){
			test.testattemptedBy = response.data.data;	
			//console.log(test.testattemptedBy);
			test.loading = false;
		},

		function errorCallback(response) {
			alert("some error occurred. Check the console.");
			console.log(response); 
		});
	};

}]);