import { User } from '../model/user.model.js';
import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/utils.js';
import jwt from 'jsonwebtoken';
const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json({
      message: 'user created succesfully',
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, 'user not found'));
    }
    const validPassword = await bcrypt.compareSync(
      password,
      validUser.password
    );
    if (!validPassword) {
      return next(errorHandler(403, 'wrong credentials'));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET); // sending token{if we decode it we will get the user id}
    const { password: _, ...rest } = validUser._doc;
    res
      .cookie('access_token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000})
      .status(200)
      .json({
        rest,
        message: 'login succesfully',
      });
  } catch (error) {
    next(error);
  }
};

export { signup, signIn };
