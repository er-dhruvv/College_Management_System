let logout= (app) =>{
    app.post("/logout", (req, res) => {
    res.clearCookie("secure-token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false, 
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
})

}

export default logout