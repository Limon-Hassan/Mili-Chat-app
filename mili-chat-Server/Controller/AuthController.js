const axios = require('axios');
const user = require('../models/user');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const setAuthCookies = require('../Helper/setAuthCookies');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

async function login({ email, password }, context) {
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

  setAuthCookies(context.res, token, refreshToken);

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

async function googleLogin({ token }, context) {
  if (!token) {
    throw new Error('Token is required');
  }

  try {
    let ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    let payload = ticket.getPayload();
    let { email, name, sub, picture } = payload;
    let loggedInUser = await user.findOne({ email });
    if (!loggedInUser) {
      loggedInUser = await user.create({
        name,
        email,
        avatar: picture,
        googleId: sub,
        provider: 'google',
      });
    }

    const accessToken = jwt.sign(
      { userId: loggedInUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: '15m',
      }
    );

    const refreshToken = jwt.sign(
      { userId: loggedInUser._id },
      process.env.REFRESH_SECRET,
      { expiresIn: '1d' }
    );

    setAuthCookies(context.res, accessToken, refreshToken);

    return {
      token: accessToken,
      refreshToken,
      user: {
        id: loggedInUser._id.toString(),
        name: loggedInUser.name,
        email: loggedInUser.email,
      },
    };
  } catch (error) {
    console.error('Google login error:', error);
    throw new Error('Google login failed');
  }
}

async function facebookLogin({ accessToken }, context) {
  if (!accessToken) {
    throw new Error('Token is required');
  }
  try {
    const fbResponse = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
    );

    const { id: facebookId, name, email, picture } = fbResponse.data;

    let loggedInUser = await user.findOne({ email });
    if (!loggedInUser) {
      loggedInUser = await user.create({
        name,
        email,
        avatar: picture?.data?.url || '',
        facebookId,
        provider: 'facebook',
      });
    }

    const token = jwt.sign(
      { userId: loggedInUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: '15m',
      }
    );

    const refreshToken = jwt.sign(
      { userId: loggedInUser._id },
      process.env.REFRESH_SECRET,
      { expiresIn: '1d' }
    );

    setAuthCookies(context.res, token, refreshToken);

    return {
      token,
      refreshToken,
      user: {
        id: loggedInUser._id.toString(),
        name: loggedInUser.name,
        email: loggedInUser.email,
      },
    };
  } catch (error) {
    console.log(error);
    console.log(error.message);
    console.error(
      'Facebook login error:',
      error.response?.data || error.message
    );
    throw new Error('Facebook login failed');
  }
}

async function refreshToken({ refreshToken }) {
  if (!refreshToken) {
    throw new Error('Refresh token is required');
  }
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
  let existingUser = await user.findById(decoded.userId);
  if (!existingUser) {
    throw new Error('User not found');
  }

  let newAccessToken = jwt.sign(
    {
      userId: existingUser._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  return {
    token: newAccessToken,
    user: {
      id: existingUser._id.toString(),
      name: existingUser.name,
      email: existingUser.email,
    },
  };
}

async function logout(context) {
  if (context.res && context.res.clearCookie) {
    context.res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
  }

  return { message: 'Logged out successfully' };
}

module.exports = {
  registation,
  login,
  googleLogin,
  refreshToken,
  facebookLogin,
  logout,
};
