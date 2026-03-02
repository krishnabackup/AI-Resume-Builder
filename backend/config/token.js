import jwt from "jsonwebtoken";

export const genrateToken = (payload, rememberMe) => {
  try {
    let token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: rememberMe ? "30d" : "2h",
    });

    return token;
  } catch (error) {
    console.log("Token error");
  }
};
