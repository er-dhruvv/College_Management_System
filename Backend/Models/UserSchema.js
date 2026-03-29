import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    profilePic :{
      type: String,
      default :""
    },
    fullname: {
      type: String,
      trim: true,
    },

    Enrollno: {
      type: Number,
      unique: true,
    },

    rollno: Number,

    DOB: Date,

    Category: String,

    Address: String,

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    sem: Number,

    class: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
      enum: ["admin", "faculty", "Student"],
    },

    Aadhar: {
      type: Number,
      unique: true,
    },

    MONOstd: Number,

    MONOsparent: Number,
  },
  { timestamps: true }
);

const user = mongoose.model("User", userSchema);

export default user;
