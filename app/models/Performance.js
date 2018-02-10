const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PerformanceSchema = new Schema({

        userEmail: {
         type: String, required:true
        },
        testId:{
          type: String
        },
        score: {
          type: Number,
          default: 0
        },
        questionCount:{
          type: Number,
          default: 0
        },
        timeTaken: {
          type: Number,
          default: 0
        },
        totalCorrectAnswers: {
          type: Number,
          default: 0
        },
         totalSkipped: {
          type: Number,
          default: 0
        }


})
module.exports = mongoose.model('Performance', PerformanceSchema)
