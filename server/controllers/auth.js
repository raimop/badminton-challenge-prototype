const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { status } = require('../helpers/status');
const { createNotification } = require('../helpers/utils');
const { MESSAGES } = require('../helpers/messages');
const nodemailer = require("../nodemailer");

exports.login = async (req, res) => {
  const {
    email,
    password
  } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) throw Error(MESSAGES.USER.INVALID_CREDENTIALS);

    //if (user.status !== "active") throw Error(MESSAGES.USER.PLEASE_CONFIRM_EMAIL)

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw Error(MESSAGES.USER.INVALID_CREDENTIALS);

    const userTemplate = {
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      preferences: {
        showHistory: user.preferences.showHistory,
        emailNotif: user.preferences.emailNotif
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

    const confirmationToken = jwt.sign({ email }, process.env.JWT_SECRET);

    const newUser = new User({
      firstName,
      lastName,
      gender,
      email,
      password: hash,
      confirmationCode: confirmationToken
    });

    const savedUser = await newUser.save();
    if (!savedUser) throw Error(MESSAGES.USER.ERROR_SAVING);
    
    nodemailer.sendConfirmationEmail(firstName, email, confirmationToken)
    createNotification(newUser._id, `Tere tulemast ${firstName} ja aitäh, et liitusid sulgpalli väljakutsete rakenduse keskkonnaga.`)

    res.status(status.success).json({ msg: MESSAGES.USER.CREATED_SUCCESSFULLY });
  } catch (e) {
    res.status(status.bad).json({ msg: e.message });
  }
}

exports.verifyUser = async (req, res, next) => {
  try {
    const { confirmationCode } = req.params;

    const user = await User.findOne({ confirmationCode })

    if (!user) throw Error(MESSAGES.USER.INCORRECT_TOKEN);
    if (user.status === "active") throw Error(MESSAGES.USER.ALREADY_ACTIVATED);

    user.status = "active"

    const savedUser = await user.save();
    if (!savedUser) throw Error(MESSAGES.USER.ERROR_SAVING);

    res.status(status.success).json({ msg: MESSAGES.USER.CONFIRMED_SUCCESSFULLY });
  } catch (e) {
    res.status(status.bad).json({ msg: e.message });
  }
};