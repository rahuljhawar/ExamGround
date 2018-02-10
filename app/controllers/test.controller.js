const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const events = require('events');
const nodemailer = require('nodemailer');
const passport = require('passport');

const userRouter  = express.Router();
const testRouter  = express.Router();
const userModel = mongoose.model('User');
const socialModel = mongoose.model('SocialUser');
const testModel = mongoose.model('Test');
const questionModel = mongoose.model('Question');
const performanceModel = mongoose.model('Performance');
 
//libraries and middlewares
const config = require('./../../config/config.js');
const responseGenerator = require('./../../libs/responseGenerator');
const auth = require("./../../middlewares/auth");
const random = require("randomstring");


// *********** ALL API'S ********************//



module.exports.controller = (app)=>{
	//route to get the current user
	testRouter.get('/currentUser',(req,res)=>{
		    let user=req.user;
		    res.send(user);
	});

	//route to get the all  users
	testRouter.get('/allusers',(req,res)=>{
		userModel.find({},(err,users)=>{
			if (err) {
				let response = responseGenerator.generate(true, "Some Internal Error", 500, null);
				res.send(response);
			} else if (!users) {
				let response = responseGenerator.generate(false, "No Users registered in the system:(", 200, result);
				res.send(response);
			} else {
				let response = responseGenerator.generate(false, "Users Available", 200, users);
				res.send(response);
			}

		});
	});

	//route to get the all the social logged users
	testRouter.get('/allsocialusers',(req,res)=>{
		socialModel.find({},(err,users)=>{
			if (err) {
				let response = responseGenerator.generate(true, "Some Internal Error", 500, null);
				res.send(response);
			} else if (!users) {
				let response = responseGenerator.generate(false, "No Social Users registered in the system:(", 200, result);
				res.send(response);
			} else {
				let response = responseGenerator.generate(false, "Users Available", 200, users);
				res.send(response);
			}

		});
	});

	//Api to create a new Test By Admin
	testRouter.post('/admin/createTest',  (req, res) =>{
		let newTest = new testModel({
	        testid: random.generate({
	            length: 10,
	            charset: 'numeric'
	        }),
	        title: req.body.title,
	        description: req.body.description,
	        time: req.body.time,
	        instructions: req.body.instructions
    });

		newTest.save( (err, test) => {
			if (err) {
				let error = responseGenerator.generate(true, "Some Error Ocurred, error : " + err, 500, null);
				res.send(error);
			} else {
				let response = responseGenerator.generate(false, "Successfully Created A Test", 200, test);
				res.send(response);
			}
		});

	});//end test creation

	// API to get all tests in DB
	testRouter.get('/allTests',  (req, res) =>{

	    testModel.find({},  (err, result)=> {
	    	if (err) {
	    		let response = responseGenerator.generate(true, "Some Internal Error", 500, null);
	    		res.send(response);
	    	} else if (!result) {
	    		let response = responseGenerator.generate(false, "No Tests Available", 200, result);
	    		res.send(response);
	    	} else {
	    		let response = responseGenerator.generate(false, "Tests Available", 200, result);
	    		res.send(response);
	    	}
	    });
	});


	// API to get a complete details of test
	testRouter.get('/test/:tid', function (req, res) {
		    //console.log(req);
		    testModel.findOne({
		    	'testid': req.params.tid
		    },  (err, result) =>{
		    	if (err) {
		    		let response = responseGenerator.generate(true, "Some Internal Error", 500, null);
		    		res.send(response);
		    	} else {
		    		let response = responseGenerator.generate(false, "Test Details", 200, result);
		    		res.send(response);
		    	}
		    });
		});

			// API to delete test
		testRouter.post('/test/delete/:id',  (req, res)=> {
		    testModel.findOneAndRemove({
		        'testid': req.params.id
		    },  (err)=> {
		        if (err) {
		            let response = responseGenerator.generate(true, "Some Internal Error", 500, null);
		            res.send(response);
		        } else {
		            let response = responseGenerator.generate(false, "Test Deleted", 200, null);
		            res.send(response);
		        }
		    });
		});


		// API to add questions to test created
		testRouter.post('/test/:tid/addQuestion',  (req, res) =>{
		   
		    testModel.findOneAndUpdate({
		    	'testid': req.params.tid
		    }, {
		    	'$push': {
		    		questions: req.body
		    	}
		    },  (err) =>{
		    	if (err) {
		    		let response = responseGenerator.generate(true, "Some Internal Error", 500, null);
		    		res.send(response);
		    	} else {
		            //console.log(result);
		            let response = responseGenerator.generate(false, "Question added Successfully", 200, null);
		            res.send(response);
		        }
		    });
		});


		//API to delete a question in particular test
		testRouter.post('/deleteQuestion/:tid/:qid',  (req, res) =>{
			testModel.findOneAndUpdate({
				'testid': req.params.tid
			}, {
				"$pull": {
					"questions": {
						_id: req.params.qid
					}
				}
			},  (err, result) =>{
				if (err) {
					let response = responseGenerator.generate(true, "Some Internal Error", 500, null);
					res.send(result);
				} else {
					let response = responseGenerator.generate(false, "Question Deleted Successfully", 200, result);
					res.send(response);
				}
			});
		});


			// API to edit question
			testRouter.put('/test/editQuestion/:qid',  (req, res) =>{
			    testModel.findOneAndUpdate({
			        "questions._id": req.params.qid
			    }, {
			        "$set": {
			            "questions.$.question": req.body.question,
			            "questions.$.optionA": req.body.optionA,
			            "questions.$.optionB": req.body.optionB,
			            "questions.$.optionC": req.body.optionC,
			            "questions.$.optionD": req.body.optionD,
			            "questions.$.answer": req.body.answer
			        }
			    },  (err) =>{
			        if (err) {
			            let response = responseGenerator.generate(true, "Some Internal Error", 500, null);
			            res.send(response);
			        } else {
			            let response = responseGenerator.generate(false, "Question Edited Successfully", 200, null);
			            res.send(response);
			        }
			    });
			});


			// API to edit test details
			testRouter.put('/test/edit/:tid',  (req, res) =>{
			   
			    testModel.findOneAndUpdate({
			        "testid": req.params.tid
			    }, req.body,  (err,test) =>{
			        if (err) {
			            let response = responseGenerator.generate(true, "Some Internal Error", 500, null);
			            res.send(response);
			        } else {
			            let response = responseGenerator.generate(false, "Test Edited Successfully", 200, null);
			            res.send(response);
			        }
			    });
			});


			//to get all questions by User as well as Admin
			testRouter.get('/test/:tid/getQuestions',  (req, res)=> {
			    testModel.find({
			        testid: req.params.tid
			    },  (err, test)=> {
			        if (err) {
			            let error = responseGenerator.generate(true, "Something is not working, error : " + err, 500, null);
			            res.send(error);
			        } else if (test === null || test === undefined || test === []) {
			            let error = responseGenerator.generate(false, "No Question added in this test!", 204, null);
			            res.send(error);
			        } else {
			            let response = responseGenerator.generate(false, "All Questions fetched successfully", 200, test[0].questions);
			            res.send(response);
			        }
			    })
			});

			// api to store test attempted 	by users 
			testRouter.post('/tests/:tid/attemptedby',  (req, res) =>{
			    var data={
			    	email:req.body.email,
			    	score:req.body.score
			    }
			    testModel.findOneAndUpdate({
			        'testid': req.params.tid
			    }, {
			        '$push': {
			            testAttemptedBy: data
			        }
			    }, (err)=> {
			        if (err) {
			            let response = responseGenerator.generate(true, "Some Error Ocurred, error : " + err, 500, null);
			            res.send(response);
			        } else {
			            let response = responseGenerator.generate(false, "Successfully Updated The Test", 200, null);
			            res.send(response);
			        }
			    });
			});


		//API to get tests attempted by a user
			testRouter.get('/usertests/:tid',  (req, res) =>{
			    
			    testModel.find({
			        testid: req.params.tid
			    },  (err, result)=> {
			        if (err) {
			            response = responseGenerator.generate(true, "Some Internal Error", 500, null);
			            res.send(response);
			        } else if (result === null || result === undefined || result === []) {
			            let error = responseGenerator.generate(false, "No users attempted the test!", 204, null);
			            res.send(error);
			        }
			        else {
			            response = responseGenerator.generate(false, "Tests Taken By User", 200, result.testAttemptedBy);
			            res.send(response);
			        }
			    });
			});

		//API to get the performances of all users
		testRouter.get('/all/performances',  (req, res) =>{
   			 //api to get  performance user specific
		    performanceModel.find({},  (err, Performances)=> {
		        if (err) {
		            let error = responseGenerator.generate(true, "Something is not working, error : " + err, 500, null);
		            res.send(error);
		  
		        } else {
		            let response = responseGenerator.generate(false, "Performances fetched successfully!!!", 200, Performances);
		            res.send(response);
		        }
		    });
		});

		//API to get the performance of all users in a particular test

		testRouter.get('/all/performance/:tid',  (req, res) =>{
   			 //api to get  performance user specific
		    performanceModel.find({
		       	 testId:req.params.tid
		    },  (err, Performance)=> {
		        if (err) {
		            let error = responseGenerator.generate(true, "Something is not working, error : " + err, 500, null);
		            res.send(error);
		  
		        } else {
		            let response = responseGenerator.generate(false, "TotalPerformance of user in all Tests fetched successfully!!!", 200, Performance);
		            res.send(response);
		        }
		    });
		});


		//API to get the performance of a single user in a particular test

		testRouter.get('/performance/:tid',  (req, res) =>{
   			 //api to get  performance user specific
		    performanceModel.findOne({
		       	$and:[{userEmail: req.user.email} , {testId:req.params.tid}]
		    },  (err, Performance) =>{
		        if (err) {
		            let error = responseGenerator.generate(true, "Something is not working, error : " + err, 500, null);
		            res.send(error);
		  
		        } else {
		            let response = responseGenerator.generate(false, "TotalPerformance of user in all Tests fetched successfully!!!", 200, Performance);
		            res.send(response);
		        }
		    });
		});


		//API to add the performance of the user
	testRouter.post('/addPerformance',  (req, res) =>{
	    
	    let performance = new performanceModel({
	        userEmail: req.body.email,
	        testId: req.body.testid,
	        score: req.body.score,
	        questionCount: req.body.noOfQuestions,
	        timeTaken:req.body.timetaken,
	        totalCorrectAnswers:req.body.totalCorrectAnswers,
	        totalSkipped:req.body.totalSkipped
	       });
	    //console.log(taker);
	    performance.save( (err, result) =>{
	        if (err) {
	            response = responseGenerator.generate(true, "Some Internal Error", 500, null);
	            res.send(response);
	        } else {
	            response = responseGenerator.generate(false, "Added Test Performance Successfully", 200, performance);
	            res.send(response);
	        }
	    });
	});


	app.use('/user',auth.verifyToken,testRouter);		


}


