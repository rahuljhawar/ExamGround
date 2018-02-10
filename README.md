# ExamGround, A Live Test Taking System

https://limitless-stream-31809.herokuapp.com

## Assumption

* Register with email as 'admin@examground.com', to get the admin access of the system.
* For Heroku-
     * email: admin@examground.com
     * pass : rahul


## Project Description

```
A Multiple choice test taking system in which tests are tracked live and analytics are generated based on that. 

```

## Features
	
	1) User Management System -

		a) Ability to sign up using email, gmail and facebook.
		b) Ability to login to the system through email and password combination or using Gmail/Facebook
		c) Forgot password functionality to reset password

	2) User Testing management system -

		a) Once the user logs into the system, a dashboard containing the statistics of all tests he has taken is displayed. The statistics includes the number of tests taken, average score,best and the least score.
		b) A particular test can only be taken once by the user.The User will be apprised of which tests he/she had already taken. 
		c) “Take Test” button is displayed, from which user can go to test taking page on clicking the button for a particular test.

	3) User test taking system -

		a) Once user starts the test, he first see an instructions screen containing. It may also contain the rules of the test.
		b) Once the user reads the instructions and accepts the rules (single accept button), The test timer will start and the screen should display the test questions and options associated with it.
		c) User can be able to choose only one option as answer for every question.
    d) User can revisit the questions again with the help of the question pallette which apprises of the questions attempted by the user.
		e) The test will have a time limit. The test window must automatically close once the timeout occurs irrespective of how many questions have been answered. The system submits the answers automatically.
		f) If the user completes the test before the time ends, he can see a submit window which will submit his all answers. In case of timeouts, this window must appear automatically.
		g) The system keeps a track of how much time a user is taking for answering each question. 
		h) On submission of test, result is shown to student. 

	4) Test listing Admin

		a) Admin can be able to create tests in the system
		b) Each test has a set of questions, each question containing at least 4 options and overall time limit of the test. 
		c) Admin can create, edit, delete and view any tests, questions or option.
		d) While creating options for any question, admin is be able to set a correct answer. 

	5) User analytics in admin

		a) Admin can be able to view details of users registered in the system
		b) Admin can be able to view overall performance of the user in all his tests.
    c) Admin can be able to see all the users who have attempted the test.

	6) Single Page Application
	
## Extra features

	1) List of students who attempted the test is shown with their details,scores & ranks.
	2) Chart js used to show pie chart.
	3) Secured with JWT. Default JWT expiry time is set to 30 minutes.
	4) Test statistics are also calculated.
	

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

	1) Nodejs
	2) Mongodb
	3) NPM
	4) Git

### Installing

Setting Prerequisites

```
1) Start mongodb by running mongod

```

Setting up the local server

```
1) Clone the repository from https://github.com/rahuljhawar/ExamGround
2) Open terminal and change its location the where you cloned the repo
3) Run command npm install
4) After all dependencies are installed. Run command : node app.js, in your terminal
5) let the server start
```

Getting started

```
1) Visit http://localhost:3000 on your browser
2) Select signup to create a new account

```

## Built With

* Angular Js
* Bootstrap
* Node Js
* Postman
* VS Code Editor


## Authors

* **Rahul Jhawar** 
