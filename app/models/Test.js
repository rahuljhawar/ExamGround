const mongoose = require('mongoose'),
     Question = require('./Question.js'),
     QuestionSchema = mongoose.model('Question').schema;

     
const Schema  =  mongoose.Schema;


const testSchema = new Schema({

    testid: {
        type: String
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    time: {
        type: String
    },
    instructions: {
        type: String
    },
    testAttemptedBy: [],
    questions: [QuestionSchema],
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Test', testSchema);