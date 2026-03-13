import { verifyToken } from "./middleware/middleware.js";
import user from "./Models/UserSchema.js";
import FacultySchema from "./Models/FacultySchema.js";

export let getInfo=(app)=>{
    app.get('/getInfo', verifyToken,async(req,res)=>{
        try {
            
            let userInfo
            if(req.user.role === 'Student'){
                 userInfo =await user.findById(req.user.id).select('username')
            }
            if(req.user.role === 'faculty'){
                 userInfo =await FacultySchema.findById(req.user.id).select('username')
            }

            // console.log(userInfo);

            if(!userInfo){
                    return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json({
                username:userInfo.username,
                success:true
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({message:"server error"})
        }
    })
}