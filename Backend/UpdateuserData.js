import user from "./Models/UserSchema.js";
import FacultySchema from "./Models/FacultySchema.js";
import { verifyToken } from "./middleware/middleware.js";
import bcrypt from "bcryptjs";

export let UpdateuserData = (app) => {
  app.put("/UpdateuserEmail",verifyToken, async (req, res) => {
    try {
        
      let { email } = req.body;
      
      if (!email) {
          return res.status(400).json({ success: false, message: "Email is required" });
      }

      let userId = req.user.id;

      let userupdate
      if(req.user.role === 'Student'){
         userupdate = await user
          .findByIdAndUpdate(userId, { email }, { new: true })
          .select("email");
      }
      if(req.user.role === 'faculty'){
         userupdate = await FacultySchema
          .findByIdAndUpdate(userId, { email }, { new: true })
          .select("email");
      }


      res.json({
        success: true,
        message: "Email updated successfully",
        email: userupdate.email,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  });

  app.put("/UpdateuserPassword",verifyToken, async (req, res) => {
    try {
      let { password ,newpassword ,conpassword } = req.body;

      if (!password || !newpassword || !conpassword) {
          return res.status(400).json({ success: false, message: "Please provide old password, new password, and confirm password" });
      }

      let userId = req.user.id;

      let userexist
      if(req.user.role === 'Student'){
         userexist = await user.findById(userId).select('password')
      }
      if(req.user.role === 'faculty'){
         userexist = await FacultySchema.findById(userId).select('password')
      }

      if(!(bcrypt.compareSync(password, userexist.password))){
            return res.json({success: false ,message : "Old password is incorrect"})          
      }

      if(bcrypt.compareSync(newpassword, userexist.password)){
            return res.json({success: false ,message : "Password can't be same as old password"})          
      }

      
      if(newpassword !== conpassword){
        return res.json({success:false ,message:"Both password is mismatched"})
      }
      let encodepassword =bcrypt.hashSync(newpassword, 10);

      
      if(req.user.role === 'Student'){
        await user
         .findByIdAndUpdate(userId, { password :encodepassword }, { new: true })
         .select("password");
      }
      if(req.user.role === 'faculty'){
        await FacultySchema
         .findByIdAndUpdate(userId, { password :encodepassword }, { new: true })
         .select("password");
      }

      res.json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  });
};
