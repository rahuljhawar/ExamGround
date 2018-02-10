myApp.controller('resultsController',['$http','$window','$scope','$stateParams','$filter','apiService','authService','$rootScope','$location','$state',function($http,$window,$scope,$stateParams,$filter,apiService,authService,$rootScope,$location,$state){

var result=this;
var testid=$stateParams.tid;

// get the result of the user
this.getResult=()=>{
	apiService.getusertestdetails(testid).then(function successCallBack(response){

			result.performance=response.data.data;
			result.email=result.performance.userEmail ;
			//evualuating the no. of wrong answers and the percentile
			result.wrongAns = result.noOfQuestions - ( result.performance.totalCorrectAnswers + result.performance.totalSkipped );
			result.percentile=(result.performance.score/(result.noOfQuestions*2))*100;
			//console.log(result.performance);

			// chart.js configurations
			result.options={
				legend : { display : true,position : 'bottom'}
			};
			result.labels =[ result.performance.totalCorrectAnswers + " Correct Answers" , result.wrongAns + " Wrong Answers", result.performance.totalSkipped +" Skipped"];
 			result.data=[result.performance.totalCorrectAnswers,result.wrongAns,result.performance.totalSkipped ];

 			// evaluating the rank of the user
 			var sorted = result.testAttemptedBy.slice().sort(function(a,b){return b.score-a.score});
			result.rank = sorted.findIndex(x => x.email===result.email) + 1;
		},
		function errorCallback(response) {
			alert("some error occurred. Check the console.");
			console.log(response); 
		}); 
	
};
// getting the testtime and other required values
this.getTestTime=()=>{
	apiService.viewTest(testid).then(function successCallBack(response){
			result.testname=response.data.data.title;
			result.testtime=response.data.data.time;	
			result.noOfQuestions=response.data.data.questions.length;
			result.testAttemptedBy=response.data.data.testAttemptedBy;
			result.noOfStudents = result.testAttemptedBy.length;

			
		});
	
//call the function
	result.getResult();


};


//call the function
this.getTestTime();



}]);


