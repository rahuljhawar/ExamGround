myApp.controller('livetestController',['$http','$timeout','$scope','$stateParams','$filter','apiService','authService','$rootScope','$location','$state',function($http,$timeout,$scope,$stateParams,$filter,apiService,authService,$rootScope,$location,$state){
var live=this;
this.score=0;
this.wrongAns=0;
this.skipped=0;
this.useroptions=[];
this.testid=$stateParams.tid;


this.currentPage = 0;
this.pageSize = 1;
this.numberOfPages=Math.ceil(live.questions.length/live.pageSize);  

//get the user detail
this.getUserDetail=()=>{
			apiService.getUser().then(function successCallBack(response){
				live.email=response.data.email;
		});
	};
this.getUserDetail();

//get the timing of a particular test
this.getTestTime=()=>{
	apiService.viewTest(live.testid).then(function successCallBack(response){
			live.testtime=response.data.data.time;	
		});
};
this.getTestTime(live.testid);

//get all the live questionss
this.getLiveQuestions=()=>{
	
		live.questions = [];
		apiService.viewQuestions(live.testid).then(function successCallBack(response){
			//console.log(response);
			response.data.data.forEach(function(q){
				live.questions.push(q);
			});
		},
		function errorCallback(response) {
			alert("some error occurred. Check the console.");
			console.log(response); 
		});
};
this.getLiveQuestions();


// push the user performance data to the attemptedBy array in test model
this.pushToAttemptedUsers=()=>{
	var data = {
		testId:live.testid,
		email:live.email,
		score:live.score
	}
	apiService.testAttempted(data).then(function(response){
		$state.go('dashboard.result', {tid: live.testid}) ;
	});
};
//go to a particular question
this.gotoQues=(qno)=>{
	live.currentPage=qno;
}
//store the user answer into an array before submitting
this.answers=(qno,option,qid)=>{
	live.useroptions[qno]={
		qid:qid,
		option:option

}
};
///Configuration for dispalying questions one by one
this.currentPage = 0;
this.pageSize = 1;
this.numberOfPages=Math.ceil(live.questions.length/live.pageSize);  

//show a modal 
this.showModal=()=>{
	$('#alertModal').modal('show');
};

//submit the questions answers given by the user
this.submitAnswers=()=>{

	var performanceInfo={
		email:live.email,
		testid:live.testid,
		score:live.score,
		noOfQuestions:live.questions.length,
		timetaken:live.timetaken,
		totalCorrectAnswers:live.correctAns,
		totalSkipped:live.skipped
	}

	apiService.submitTest(performanceInfo).then(function successCallBack(response){
			live.pushToAttemptedUsers();
		},
		function errorCallback(response) {
			alert("some error occurred. Check the console.");
			console.log(response); 
		});

	//console.log(live.useroptions);

};


// calculating the performance of the test based on the answers provided by the user
// checking the useranswers in the useroptions array with the answers in the db
this.calculatePerformance=()=>{
	console.log("calculatePerformance");
	for(i=0;i<live.questions.length;i++){
		for(j=0;j<live.useroptions.length;j++){
			if (typeof live.useroptions[j] !== 'undefined' && live.useroptions[j] !== null) {

			if(live.questions[i]._id==live.useroptions[j].qid){
		
				 if(live.questions[i].answer==live.useroptions[j].option){
				 	//each answer is worth 2 marks
					live.score=live.score + 2;
				}
	
			}
		}
		}
	}
	//if the length of the attempted questions by the user is less than the total no
	//questions then we will get no. of skipped questions
	if(live.useroptions.length <live.questions.length){
		live.skipped=live.questions.length - live.useroptions.length;
	}else{
		//taking care for corner cases of skipping questions
		var i=live.useroptions.length;
		while (i--) {
			if (typeof live.useroptions[i] === "undefined")
				live.skipped++;
		}

	}
	//console.log(live.score);
	live.correctAns=live.score/2;
	live.wrongAns=live.questions.length-(live.correctAns + live.skipped);
	
	live.submitAnswers();


};

//broadcast an event when the timer stops
this.stopTimer = function (){
	//console.log("broadcast")
	$scope.$broadcast('timer-stop');
}; 

//listen to the timer-stop event 
 $scope.$on('timer-stopped', function (event, data){
 	//console.log("timer-stopped");
 			//checking if the test time was completed 
 			//if it is true then timetaken will be equal to test time
 				if(data.minutes == 0 && data.seconds==0){
 					live.timetaken=live.testtime*60;
 					live.timesup = true;
 					live.showModal();
 					
 					// else store the time taken
 				}else{
 					live.timetaken=data.minutes*60+data.seconds;
 					live.calculatePerformance();
 				}
            
                
           });    


    
}]);


