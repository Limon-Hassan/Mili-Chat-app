function setAuthCookies(res, accessToken, refreshToken) {
  if (!res) return;
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 15 * 60 * 1000,
    path: '/',
  });

  if (refreshToken) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });
  }
}

module.exports = setAuthCookies;
