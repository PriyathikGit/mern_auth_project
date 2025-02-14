import { User } from '../model/user.model.js';
import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/utils.js';
import jwt from 'jsonwebtoken';
import { isValidObjectId } from 'mongoose';
import { deleteOnCloudinary, uploadOnCloudinary } from '../utils/Cloudinary.js';
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
      .cookie('access_token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        rest,
        message: 'login succesfully',
      });
  } catch (error) {
    next(error);
  }
};

const googleAuth = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: _, ...rest } = user._doc;
      res
        .cookie('access_token', token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json({
          rest,
          message: 'login successfully',
        });
    } else {
      const genratedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(genratedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(' ').join('').toLowerCase() +
          Math.floor(Math.random() * 10000).toString(), // converting the username to lowercase and adding random numbers
        email: req.body.email,
        password: hashedPassword,
        profilePicture: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: _, ...rest } = newUser._doc;
      res
        .cookie('access_token', token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json({
          rest,
          message: 'login successfully',
        });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const uploadDetails = async (req, res, next) => {
  const { profilePicture } = req.user;
  const { userId } = req.params;
  const { email, username, password } = req.body;

  try {
    if (!isValidObjectId(userId)) {
      return next(errorHandler(401, 'Not a valid user ID'));
    }

    // Handle profile picture upload if a file is provided
    if (req.file) {
      const localImagePath = req.file?.path;
      if (!localImagePath) {
        return next(errorHandler(401, 'Cannot find file path'));
      }

      const uploadedImage = await uploadOnCloudinary(localImagePath);
      if (!uploadedImage) {
        return next(
          errorHandler(400, 'Profile picture not uploaded on Cloudinary')
        );
      }

      // Delete previous profile picture if it's not the default one
      if (
        profilePicture &&
        !profilePicture.includes(
          'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
        )
      ) {
        await deleteOnCloudinary(profilePicture);
      }

      req.user.profilePicture = uploadedImage.url;
    }

    // Update user details if provided
    if (username) req.user.username = username;
    if (email) req.user.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      req.user.password = hashedPassword;
    }
    const rest = {
      _id: req.user._id,
      profilePicture: req.user.profilePicture,
      username: req.user.username,
      email: req.user.email,
    };
    await req.user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      rest,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const signOut = async (req, res) => {
  res.clearCookie("access_token").status(200).json("signout succesfully!!")
};

export { signup, signIn, googleAuth, uploadDetails, signOut };
