import bcrypt from "bcryptjs";


export const signup =(app,user)=>{
    app.post('/signup',async(req,res)=>{
    let {role,email,username,password,ConfirmPassword} =req.body
    
    if (!role || !email || !username || !password || !ConfirmPassword) {
        return res.status(400).json({ success: false, message: "Please provide all required fields (role, email, username, password, ConfirmPassword)" });
    }

    try {
        if(password !== ConfirmPassword ){
            return res.json({success: false ,message : "Both password is mismathed"})
        }
            else if(await user.findOne({username})){
                return res.json({success: false ,message :"Acount is Already exists!"})
            }else{
                const hashedPassword = bcrypt.hashSync(password, 10);

                await user.create({role:role,email:email ,username : username , password :hashedPassword})
                // let AllUsers = await user.find()
                res.status(200).json({success: true ,message : `Dear ${username} your Account is created`})
                // console.log(AllUsers)       
            }

    } catch (error) {
        console.log(error)
        res.status(500).json("Error occured")
    }


})

}