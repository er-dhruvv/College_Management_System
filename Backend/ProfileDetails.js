import { verifyToken } from "./middleware/middleware.js";
import FacultySchema from "./Models/FacultySchema.js";
import user from "./Models/UserSchema.js";
import { upload } from "./middleware/multerconfig.js";
import path from "path";
import fs from "node:fs";
const __dirname = import.meta.dirname;

export let ProfileStudent = (app) => {
  app.get("/ProfileDetails", verifyToken, async (req, res) => {
    try {
      let userInfo;
      if (req.user.role === "Student") {
        userInfo = await user.findById(req.user.id).select("-password");
      }
      if (req.user.role === "faculty") {
        userInfo = await FacultySchema.findById(req.user.id).select(
          "-password",
        );
      }

      // console.log(userInfo)
      res.status(200).json({
        info: userInfo,
        success: true,
      });

      console.log(userInfo);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "server error" });
    }
  });

  app.post(
    "/upload-profile/:id",
    verifyToken,
    upload.single("profilePic"),
    async (req, res) => {
      try {
        if (!req.file) {
          return res
            .status(400)
            .json({ success: false, message: "No file uploaded" });
        }
        let userId = req.params.id;
        let role = req.query.role;
        let filepath = req.file.path.replace(/\\/g, "/");

        if (!userId || !role) {
            return res.status(400).json({ success: false, message: "User ID and role are required for profile upload" });
        }

        console.log("role:", role);

        let userInfo;
        if (role === "Student") {
          userInfo = await user.findById(userId);
        } else{
          userInfo = await FacultySchema.findById(userId);
        }
        console.log(userInfo);
        if (!userInfo) {
          return res.status(404).json({
            success: false,
            message: "User not found",
          });
        }

        let oldImage = userInfo.profilePic;

        if (oldImage) {
          // 2. Construct the full path to the old image
          const oldPath = path.join(__dirname, "..", "Backend", oldImage);

          // console.log(oldPath)

          // 3. Delete the old file from the server
          if (fs.existsSync(oldPath)) {
            fs.unlink(oldPath, (err) => {
              if (err) console.error("Failed to delete old image:", err);
              else console.log("Old image deleted successfully");
            });
          }
        }

        userInfo.profilePic = filepath;
        await userInfo.save();
        // console.log(userInfo)

        res.status(200).json({
          success: true,
          message: "profile picture uploaded",
          filepath,
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({
          success: false,
        });
      }
    },
  );
};
