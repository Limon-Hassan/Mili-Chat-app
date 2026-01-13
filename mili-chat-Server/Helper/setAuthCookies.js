function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 15 * 60 * 1000,
  });

  if (refreshToken) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
    });
  }
}

module.exports = setAuthCookies;
