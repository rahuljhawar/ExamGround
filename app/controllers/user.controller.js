const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const events = require('events');
const nodemailer = require('nodemailer');
const passport = require('passport');
// express userRouter used to define routes 
const userRouter  = express.Router();
const userModel = mongoose.model('User');
//libraries and middlewares
const config = require('./../../config/config.js');
const responseGenerator = require('./../../libs/responseGenerator');
const auth = require("./../../middlewares/auth");
const eventEmitter = new events.EventEmitter();
const randomstring = require("randomstring");

eventEmitter.on('forgot-pass',(data)=>{
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: config.username,
			pass: config.pass
		}
	});
	let mailOptions = {
	        from: 'ExamGround <choosemeon@gmail.com>', // sender address
	        to: data.email, // receivers email
	        subject: 'Forgot Password', // Subject line
	        html: `<p> OTP - ${data.otp}
	        		</p>` // plain text body
	        	};

	        	transporter.sendMail(mailOptions,  (err, info)=> {
	        		if (err)
	        			console.log(err);
	        		else
	        			console.log("Mail successfully sent" + info);
	        	});
	        });




module.exports.controller=(app)=>{
	

 //userRouter for user signup
	 userRouter.post('/signup',(req,res)=>{
	 	userModel.findOne({'email': req.body.email},  (err, result)=> {
	 		if (err) {
	 			const myResponse = responseGenerator.generate(true, "Error registering your profile.Please try again!", 500, null);
	 			res.send(myResponse);
	 		} else if (result) {
	 			const myResponse = responseGenerator.generate(true, "User already exists", 409, null);
      			//console.log(result);
      			res.send(myResponse);
      		} 
      		else{


      			const newUser = new userModel({
      				name          		: req.body.name,
      				email               : req.body.email,
      				mobileNumber        : req.body.mnumber,
      				password            : req.body.password

		            });// end new user 

      				//hashing the password using bcrypt
      				bcrypt.genSalt(10,  (err, salt)=> {
      					bcrypt.hash(newUser.password, salt,  (err, hash)=> {
      						newUser.password = hash;
      						newUser.save(function (err) {
      							if (err) {

      								const response = responseGenerator.generate(true, "Error registering your profile.Please try again!", 500, null);
      								res.send(response);
      							} else {

      								const response = responseGenerator.generate(false, "Account created successfully! Now you can Login!!", 200, null);
      								res.send(response);
      							}
      						});
      					});
      				});
      			}

    		});//end signup route
	 });
	 	//route for login with jwt token encapsulation
	 	userRouter.post('/login',(req,res)=>{
	 		userModel.findOne({email:req.body.email},(err,foundUser)=>{
	 			if(foundUser){
	 				bcrypt.compare(req.body.password, foundUser.password, (err, isMatch) =>{
	 					if(err)	throw err;

	 					else if(isMatch){

	 						let payload = foundUser.toObject();
	 						delete payload.password;
	 						let token=jwt.sign(payload, config.jwtsecret, { expiresIn: '2h' });
	 						res.json({
	 							error:false,
	 							token:token
	 						});

	 					}

	 					else{
	 						const myResponse = responseGenerator.generate(true,"Incorrect password",500,null);
	 						res.send(myResponse);
	 					}
	 				});

	 			}else if(foundUser==null || foundUser==undefined || foundUser.email==undefined){
	 				const myResponse = responseGenerator.generate(true,"User does not exist!",404,null);
	 				res.send(myResponse);
	 			}else{

	 				const myResponse = responseGenerator.generate(true,"Error logging you in! Please try again."+err,500,null);
	 				res.send(myResponse);
	 			}


	 		});





	 	});//end of login route

	 	//route to send otp
	 	userRouter.post('/forgotpassword',(req,res)=>{

	 		userModel.findOne({email:req.body.email},(err,foundUser)=>{
	 			if(err){
	 				throw err;
	 			}else if(foundUser == null){
	 				const myResponse = responseGenerator.generate(true,"Email not registered!",404,null);
	 				res.send(myResponse);
	 			}else{
	 				req.session.otp=randomstring.generate({ length: 6,charset: 'numeric '});
	 				req.session.email = foundUser.email;
	 				console.log(req.session.email);
	 				eventEmitter.emit('forgot-pass', {email:req.session.email,otp:req.session.otp});
	 				const myResponse = responseGenerator.generate(false,"OTP sent to the registerd email",200,req.session.otp);
	 				res.send(myResponse);
	 			}
	 		});

	 	});//end otp route

	 	//route to verify otp sent in the mail
	 	userRouter.post('/verifyotp',(req,res)=>{
	 		if(req.body.otp === req.session.otp){
	 			console.log('otp verified');
	 			const myResponse = responseGenerator.generate(false,"Otp verified",200,null);
	 			res.send(myResponse);
	 		}else{
	 			console.log('otp doesnt match');
	 			const myResponse = responseGenerator.generate(true,"Otp does not match!",400,null);
	 			res.send(myResponse);

	 		}
	 	});// end otp verification route

	 	//route to reset the password
	 	userRouter.post('/resetpassword',(req,res)=>{
	 		console.log(req.session.email);
	 		if(req.body.password === req.body.cpassword){
	 			let password = req.body.password;
	 			bcrypt.genSalt(10,  (err, salt)=> {
	 				bcrypt.hash(password, salt,  (err, hash)=> {
	 					password=hash;
	 					userModel.findOneAndUpdate({email: req.session.email}, {$set:{password:password}},{new:true},(err, docs)=> {

	 						if (err)  throw err;
	 						else if(docs){

	 							const response = responseGenerator.generate(false, "Password changed successfully! Now you can Login!!", 200, null);
	 							res.send(response);
	 						}
	 						else{res.send("");}
	 					});
	 				});
	 			});

	 		}

	 		else{
	 			const response = responseGenerator.generate(true, "Passwords didn't match.", 500, null);
	 			res.send(response);
	 		}
	 	});
	 	

	 	//passport google auth
	 	userRouter.get('/auth/google', passport.authenticate('google', {
	 		scope: ['profile', 'email']
	 	}));
	 	//passport facebook auth
	 	userRouter.get('/auth/google/callback', passport.authenticate('google',{ 
            failureRedirect : '/login'
        }),  (req, res)=> {
	 	
	 		//console.log(token);
			res.redirect('/google/' +token);

			 });

	 	userRouter.get('/auth/facebook',
	 		passport.authenticate('facebook', {
	 			scope: ['email']
	 		}));

	 	userRouter.get('/auth/facebook/callback', passport.authenticate('facebook', {
            failureRedirect : '/login'
        }),  (req, res) =>{
      
			//console.log(token);
			res.redirect('/facebook/' +token);
	 	});
	 	app.use('/',userRouter);
	 };

