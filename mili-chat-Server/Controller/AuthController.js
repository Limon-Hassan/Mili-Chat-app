const user = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function registation({ name, email, password }) {
  if (!name || !email || !password) {
    throw new Error('All fields are required');
  }

  let existingUser = await user.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  try {
    let hashedPassword = await bcrypt.hash(password, 10);
    let User = new user({
      name,
      email,
      password: hashedPassword,
    });
    await User.save();
    return User;
  } catch (error) {
    console.error('Error during registration:', error);
    throw new Error('Error during registration:', error.message);
  }
}

async function login({ email, password }) {
  if (!email || !password) {
    throw new Error('All fields are required');
  }
  let existingUser = await user.findOne({ email });
  if (!existingUser) {
    throw new Error('Invalid email or password');
  }
  let isPasswordMatch = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordMatch) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign(
    { userId: existingUser._id },
    process.env.REFRESH_SECRET,
    { expiresIn: '1d' }
  );

  return {
    token,
    refreshToken,
    user: {
      id: existingUser._id.toString(),
      name: existingUser.name,
      email: existingUser.email,
    },
  };
}
module.exports = {
  registation,
  login,
};
