import { verifyToken } from "../middleware/middleware.js"

export let Isloggedin=(app)=>{
    app.get('/Isloggedin',verifyToken,async(req,res)=>{

        try{
            res.status(200).json({
                message:"Authorized",
                success:true,
                role: req.user.role 
            })

        }catch(err){
            console.log(err)
            res.status(401).json({
                message:"unAuthorized",
                success:false
            })
        }
    })
}