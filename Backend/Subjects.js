import { verifyToken } from "./middleware/middleware.js";
import subjectDetails from "./Models/SubjectSchema.js";

export let subjects = (app) => {
  app.get("/getSubjects", verifyToken, async (req, res) => {
    try {
      //console.log('hello')
      let Info = await subjectDetails.find({});
      console.log(Info)

      res.status(200).json({
        success: true,
        Info,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "server Error",
      });
    }
  });
  app.post("/AddSubject", verifyToken, async (req, res) => {
      try {
        console.log(req.body)
        let { formData } = req.body;

         if (!formData.subject || !formData.code || formData.credit === undefined || formData.SEE === undefined || formData.mid === undefined || formData.practical === undefined || formData.Assesment === undefined) {
      return res.status(400).json({
        message: "Subject, Code, Credit, and all exam marks (SEE, mid, practical, Assesment) are required",
        success: false,
      });
    }

    let d= await subjectDetails.create({
      subject: formData.subject,
      subject_code: formData.code,
      credit: Number(formData.credit),
      maxmarks: {
        SEE: Number(formData.SEE),
        Midsem: Number(formData.mid),
        PracticalExam: Number(formData.practical),
        RegularAssesment: Number(formData.Assesment),
      },
    });
    console.log(d)

    res.status(201).json({
        message : "subject is Added Successfully",
        success : true,
    })
    } catch (error) {
          console.log("AddSubject Error:", error);
        res.status(500).json({
        message : "server Error",
        success : false,
    })
    }
    
  });
};
