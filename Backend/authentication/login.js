import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import FacultySchema from "../Models/FacultySchema.js";
import user from "../Models/UserSchema.js";

const SecretKey =process.env.SecretKey

export const login = (app)=>{

    app.post('/login',async(req,res)=>{
        let {role,username,password} =req.body

        if (!role || !username || !password) {
            return res.status(400).json({ success: false, message: "Role, username, and password are required" });
        }

        let userExist
        
         if(role=='faculty'){
            userExist  = await FacultySchema.findOne({ username });
        }
        
        if(role == 'Student'){
            userExist  = await user.findOne({ username });
        }
        // console.log('users:',userExist)
    
        if(!userExist){
            return res.json({success: false ,message : "Account is not found"})
        }

        
    
        if(!(bcrypt.compareSync(password, userExist.password)) || userExist.role !==role){
            return res.json({success: false ,message : "Incorrect username or password"})
    
        }
        
        const token = jwt.sign(
            { role:userExist.role , id: userExist._id, username: userExist.username },
            SecretKey,
            { expiresIn: "1h" }
        );

        // console.log(token)
    
        res.cookie("secure-token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 24 * 60 * 60 * 1000,
        });
    
        
        res.status(200).json({
                success: true ,
                role:userExist.role,
                message : `Welcome , ${username}`
        })
        
    })
    
}

