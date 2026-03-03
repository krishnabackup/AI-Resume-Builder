import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const getUserModel = async () => {
  const mod = await import("../Models/User.js");
  return mod.default || mod.User;
};


const isAuth = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Check cookie first
    if (req.cookies.token) {
      token = req.cookies.token;
    }

    // 2️⃣ If not in cookie, check Authorization header
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Token Not Found" });
    }
   console.log("TOKEN RECEIVED:", token);
   console.log("JWT_SECRET:", process.env.JWT_SECRET);
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!verifyToken) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    let tokenId = verifyToken.id;

    if (!mongoose.Types.ObjectId.isValid(tokenId)) {
      const User = await getUserModel();
      const admin = await User.findOne({ isAdmin: true });
      if (admin) tokenId = admin._id;
    }

    req.userId = tokenId;
    next();
  } catch (error) {
    console.log("isAuth error:", error);
    return res.status(401).json({ message: "Authentication Failed" });
  }
};

export default isAuth;
