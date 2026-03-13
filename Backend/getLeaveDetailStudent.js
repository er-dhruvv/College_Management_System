import { verifyToken } from "./middleware/middleware.js"
import LeaveFormSchema from "./Models/LeaveFormSchema.js"


export let getLeaveDetailStudent=(app)=>{
    app.get('/LeaveDataStudent',verifyToken,async(req,res)=>{
        try {
            let LeaveInfo =await LeaveFormSchema.find({userId:(req.user.id)}).select('TypeOfLeave DayDuration FromDate ToDate Remarks status')

            // console.log('from',LeaveInfo)

           res.status(200).json({
            info:LeaveInfo,
            success:true
           })


        } catch (error) {
            console.log(error)
        }
    })
}