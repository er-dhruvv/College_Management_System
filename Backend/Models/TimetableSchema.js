import mongoose from "mongoose";

const timetable = new mongoose.Schema({
    weekday:{
        type :Number,
        required :true
    },
    slot:{
        type :Number,
        required :true
    },
    facultyId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'FacultySchema',
        required :true
    },
    subject:{
        type :String,
        required :true
    },
    location:{
        type :String,
        required :true
    },
    class: {
        type: String,
        trim: true,
    },
    batch: {
        type: String,
        trim: true,
    },
    sem: {
        type: Number,
        required: true
    },
    IsLab :{
        type:Boolean,
        required:true,
        default: 'false'
    }
})

let TimeTableSchema = mongoose.model('Timetable',timetable)

export default TimeTableSchema;
