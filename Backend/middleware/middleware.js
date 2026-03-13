import jwt from "jsonwebtoken";

const SecretKey = process.env.SecretKey;

export function verifyToken(req, res, next) {

  const token = req.cookies["secure-token"];

  // console.log("COOKIE TOKEN:", token);

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  } 

  try {
    const decoded = jwt.verify(token, SecretKey);

    req.user = decoded; // { id, username, role }

    // console.log("DECODED USER:", decoded);

    next();

  } catch (err) {
    console.error("JWT ERROR:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
}
