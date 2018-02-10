//Including Mongoose model...
const 	mongoose = require('mongoose');
		
//creating object 
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
                    question: { type: String, require:true},
                    optionA: { type: String, require:true },
                    optionB: { type: String, require:true},
                    optionC: { type: String, require:true },
                    optionD: { type: String, require:true},
                    answer  :{type:Number, require:true}
});

 module.exports = mongoose.model('Question', QuestionSchema);