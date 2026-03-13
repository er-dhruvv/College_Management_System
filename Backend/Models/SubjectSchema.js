import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({

    subject : {
        type : String,
    },
    subject_code :{
        type : String,
        unique: true,
          required: true
    },
    credit:{
        type:Number,        
    },
    maxmarks:{
        Midsem :{
            type:Number,
        },
        SEE :{
            type:Number,
        },
        PracticalExam :{
            type:Number,
        },
        RegularAssesment :{
            type:Number,
        }
    }
})

const subjectDetails = mongoose.model("SubjectSchema", SubjectSchema);

export default subjectDetails;