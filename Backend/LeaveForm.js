import { verifyToken } from "./middleware/middleware.js";
import LeaveFormSchema from "./Models/LeaveFormSchema.js";

export const LeaveForm =(app)=>{
    app.post('/LeaveFormStudent',verifyToken,async(req,res)=>{
        
        let {TypeOfLeave,DayDuration,FromDate,ToDate,Remarks} =req.body

        if (!TypeOfLeave || !DayDuration || !FromDate || !ToDate) {
            return res.status(400).json({ success: false, message: "Please provide all required fields" });
        }

        if(FromDate > ToDate){
            return(
                res.status(400).json({
                    success : false,
                    message : "Plese Enter Valid date!"
                })
            )
                
        }

        try {
            await LeaveFormSchema.create({
                username: req.user.username,userId: req.user.id,
                TypeOfLeave,DayDuration,FromDate,ToDate,Remarks
            })
                    
            res.status(201).json({success: true ,message : `Dear ${req.user.username} your Leave is send to HOD`})
            
        } catch (error) {
            console.log(error)
            res.status(500).json({message:'Failed to submit '})
        }
    })
}