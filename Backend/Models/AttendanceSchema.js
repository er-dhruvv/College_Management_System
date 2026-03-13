import mongoose from "mongoose";

const Attendance = new mongoose.Schema({
    date:{
        type :Date,
        required :true
    },
    slot:{
        type :Number,
        required :true
    },
    studentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required :true
    },
    facultyId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'FacultySchema',
        required :true
    },
    status : {
        type : String,
    }
    
},{timestamps : true})

let AttendanceSchema=mongoose.model('Attendance',Attendance)

export default AttendanceSchema