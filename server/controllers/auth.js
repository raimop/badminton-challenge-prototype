const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { status } = require('../helpers/status');
const { MESSAGES } = require('../helpers/messages');

exports.login = async (req, res) => {
  const {
    email,
    password
  } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) throw Error(MESSAGES.USER.INVALID_CREDENTIALS);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw Error(MESSAGES.USER.INVALID_CREDENTIALS);

    const userTemplate = {
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      preferences: {
        showHistory: user.preferences.showHistory
      }
    }

    const token = jwt.sign(userTemplate, process.env.JWT_SECRET);
    if (!token) throw Error(MESSAGES.USER.ERROR_SIGN_JWT);

    res.status(status.success).json({
      token,
      user: userTemplate
    });
  } catch (e) {
    res.status(status.bad).json({ msg: e.message });
  }
}

exports.signup = async (req, res) => {
  const {
    firstName,
    lastName,
    gender,
    email,
    password
  } = req.body;

  try {
    const user = await User.findOne({
      email
    });
    if (user) throw Error(MESSAGES.USER.EMAIL_ALREADY_EXISTS);

    const salt = await bcrypt.genSalt(10);
    if (!salt) throw Error(MESSAGES.USER.ERROR_BCRYPT);

    const hash = await bcrypt.hash(password, salt);
    if (!hash) throw Error(MESSAGES.USER.ERROR_HASING);

    const newUser = new User({
      firstName,
      lastName,
      gender,
      email,
      password: hash
    });

    const savedUser = await newUser.save();
    if (!savedUser) throw Error(MESSAGES.USER.ERROR_SAVING);    

    const userTemplate = {
      _id: savedUser._id,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      gender: savedUser.gender,
    }

    const token = jwt.sign(userTemplate, process.env.JWT_SECRET);

    res.status(status.success).json({
      token,
      user: userTemplate
    });
  } catch (e) {
    res.status(status.bad).json({ msg: e.message });
  }
}