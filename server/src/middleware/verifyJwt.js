import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/utils.js';
import { User } from '../model/user.model.js';

export const verifyJwt = async (req, res, next) => {
  try {
    const token = req.cookies?.access_token;
    if (!token) {
      return next(errorHandler(404, 'unAuthorized Access!!'));
    }
    const decodeToken = jwt.decode(token, process.env.JWT_SECRET);
    const user = await User.findById(decodeToken.id).select("-password");
    if (!user) {
      return next(errorHandler(404, 'invalid access token'));
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};
