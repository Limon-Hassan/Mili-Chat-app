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
  try {
    if (!email || !password) {
      throw new Error('All fields are required');
    }
    let existingUser = await user.findOne({ email });
    if (!existingUser) {
      throw new Error('Not Account Found!');
    }

    let isPasswordMatch = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordMatch) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign(
      { userId: existingUser._id.toString() },
      process.env.JWT_SECRET,
      {
        expiresIn: '15m',
      },
    );

    const refreshToken = jwt.sign(
      { userId: existingUser._id.toString() },
      process.env.REFRESH_SECRET,
      { expiresIn: '1d' },
    );

    setAuthCookies(context.res, token, refreshToken);

    return {
      token,
      refreshToken,
      user: {
        id: existingUser._id?.toString() || '',
        name: existingUser.name,
        email: existingUser.email,
      },
    };
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
}

async function googleLogin({ accessToken }, context) {
  if (!accessToken) {
    throw new Error('Access token required');
  }

  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch Google user info');
    }

    const data = await res.json();

    const { email, name, picture, sub } = data;
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

    const accessTokenJWT = jwt.sign(
      { userId: loggedInUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' },
    );

    const refreshToken = jwt.sign(
      { userId: loggedInUser._id },
      process.env.REFRESH_SECRET,
      { expiresIn: '1d' },
    );

    setAuthCookies(context.res, accessTokenJWT, refreshToken);

    return {
      token: accessTokenJWT,
      refreshToken,
      user: {
        id: loggedInUser._id.toString(),
        name: loggedInUser.name,
        email: loggedInUser.email,
        avatar: loggedInUser.avatar,
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
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`,
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
      },
    );

    const refreshToken = jwt.sign(
      { userId: loggedInUser._id },
      process.env.REFRESH_SECRET,
      { expiresIn: '1d' },
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
      error.response?.data || error.message,
    );
    throw new Error('Facebook login failed');
  }
}

async function refreshToken(context) {
  if (!context.refreshToken) {
    throw new Error('Refresh token required or invalid');
  }

  let existingUser = await user.findById(context.userId);
  if (!existingUser) {
    throw new Error('User not found');
  }

  let newAccessToken = jwt.sign(
    { userId: existingUser._id },
    process.env.JWT_SECRET,
    { expiresIn: '15m' },
  );
  context.res.cookie('accessToken', newAccessToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000,
    path: '/',
  });

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
