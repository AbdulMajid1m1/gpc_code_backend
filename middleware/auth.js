import jwt from "jsonwebtoken";
import { createError } from "../utils/createError.js";
import { jwtKey } from "../config/config.js";

export const auth = (req, res, next) => {
  const token = req.cookies.accessToken || req.headers.authorization || req.headers["x-access-token"];
  if (!token) return next(createError(401, "You are not authenticated!"))


  jwt.verify(token, jwtKey, async (err, payload) => {
    if (err) return next(createError(403, "Token is not valid!"))
    req.user = payload
    next()
  });
};
