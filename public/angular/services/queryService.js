myApp.factory('apiService',($http,authService,$window, $q)=>{
	let requests={};

	const baseUrl = "http://localhost:3000";


	 //sign up request
    requests.signUp =  (userData) =>{
        return $http.post('/signup', userData);
    }

    	//login requests
	requests.login=(loginData)=>{
		return $http.post('/login' , loginData);
	};



	//get logged in user
	requests.getUser = ()=>{
		if(authService.getToken()){
			return $http.get('/user/currentUser?token='+authService.getToken() , null);
		}else{
			return $q.reject({data:"User not authorized..."});
		}
	}

    //get all local users
    requests.getLocalUsers=()=>{
        return $http.get('/user/allusers?token='+authService.getToken() , null);
    }
    //get all social users
    requests.getSocialUsers=()=>{
        return $http.get('/user/allsocialusers?token='+authService.getToken() , null);
    }
    
	//reset password requests

	requests.forgotPasswordOtpSend=(userData)=>{
		return $http.post('/forgotpassword' , userData);
	};

	requests.verifySentOtp=(otp)=>{
		return $http.post('/verifyotp' , otp);
	};

	requests.resetPassword=(newPassword)=>{
		return $http.post('/resetpassword' , newPassword);
	};

	 // request to Create a test by admin
    requests.createTest =  (data) =>{
        return $http.post('/user/admin/createTest?token=' + authService.getToken(), data);
    }
     // request to get all the test
    requests.getTests =  () =>{
        return $http.get('/user/allTests?token=' + authService.getToken());
    }

     // request to get a single test
    requests.viewTest =  (tid) =>{
        return $http.get('/user/test/'+tid+'?token=' + authService.getToken());
    }

    // request to Create a Question by Admin
     requests.createQuestion  =  (data) =>{
        console.log(data);
        return $http.post('/user/test/'+data.id+'/addQuestion?token=' + authService.getToken(), data);
    }

     // request to delete a Test by Admin
    requests.deleteTest =  (data) =>{
       // console.log(data);
        return $http.post('/user/test/delete/' + data + '?token=' + authService.getToken());
    }

    // request to get  Questions
    requests.viewQuestions =  (data) =>{
        //console.log(data);
        return $http.get('/user/test/' + data + '/getQuestions?token=' + authService.getToken());
    }

     // request to Update test details by Admin
    requests.updateTest =  (data)=> {
        //console.log(data);
        return $http.put('/user/test/edit/' + data.id + '?token=' + authService.getToken(), data);
    }

      // request to delete question  by Admin
    requests.deleteQuestion =  (tid, qid)=> {
        return $http.post('/user/deleteQuestion/' + tid + '/' + qid + '?token=' + authService.getToken());
    }

    // request to Update question by Admin
    requests.updateQuestion =  (data, qid)=> {
        return $http.put('/user/test/editQuestion/' + qid + '?token=' + authService.getToken(), data);
    }

    //request to get questions for single test
    requests.getQuestionDetail =  (tid,qid) =>{
        //console.log(singleTestId);
        return $http.get('/user/test/getQuestion/' + tid + '/' + qid + '?token=' + authService.getToken());
    }

     //requests to submit answer for single test
    requests.submitAnswer =  (data)=> {
        return $http.post('/test/' + data.testid + '/' + data.questionid + '/userAnswer?token=' + authService.getToken(), data);
    }


    //requests to get questions for single test
    requests.submitTest =  (data) =>{
        return $http.post('/user/addPerformance/?token=' + authService.getToken(), data);
    }

    //requests to post test attempted by
    requests.testAttempted =  (attemptdata) =>{
        return $http.post('/user/tests/' + attemptdata.testId + '/attemptedby?token=' + authService.getToken(), attemptdata);
    }
     //requests to get the entire performances 
    requests.getallperformances =  () =>{
        return $http.get('/user/all/performances/?token=' + authService.getToken());
    }


    //requests to get performance of a user in a particular test
    requests.getusertestdetails =  (tid) =>{
        return $http.get('/user/performance/' + tid + '?token=' + authService.getToken());
    }

    //requests to get performance of all user in a particular test
    requests.getallusertestdetails =  (tid) =>{
        return $http.get('/user/all/performance/' + tid + '?token=' + authService.getToken());
    }

    return requests;

});//end query service