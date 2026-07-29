import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({

    question: {
        type: String,
        required: true
    },

    options: [{
        type: String,
        required: true
    }],

    correctAnswer: {
        type: Number,
        required: true
    },

    points: {
        type: Number,
        default: 1
    }

});

const quizSchema = new mongoose.Schema({

    title:String,
    
    description:String,
    
    duration:Number,
    
    passingScore:Number,
    
    
    totalPoints:{
    type:Number,
    default:0
    },
    
    
    chapter:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Chapter",
    required:true
    },
    
    
    questions:[questionSchema]
    
},
{
    timestamps: true
});

export default mongoose.model("Quiz", quizSchema);