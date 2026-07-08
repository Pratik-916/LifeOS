export const authEndpoints = {
  login: '/auth/jwt/create/',
  signup: '/auth/users/',
  refresh: '/auth/jwt/refresh/',
  me: '/auth/users/me/',
  verify: '/auth/jwt/verify/',
  // Future endpoints
  resetPassword: '/auth/users/reset_password/',
  resetPasswordConfirm: '/auth/users/reset_password_confirm/',
  verifyEmail: '/auth/users/activation/',
};
