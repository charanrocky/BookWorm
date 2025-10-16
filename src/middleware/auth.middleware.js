import jwt from "jsonwebtoken";

import User from "../models/User.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer", "");
    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized Token Invaild access denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ message: "User not found!" });
    req.user = user;
    next();
  } catch (error) {
    console.log("Error found: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default protectRoute;
