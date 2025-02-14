import { User } from '../model/user.model.js';
import { errorHandler } from '../utils/utils.js';

const deleteAccount = async (req, res, next) => {
  if (req.user._id.toString() !== req.params.userId) {
    return next(errorHandler(401, 'you can delete only your account'));
  }
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.status(200).json('user has been deleted');
  } catch (error) {
    next(error);
  }
};
export { deleteAccount };
