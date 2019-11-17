import { verify } from 'jsonwebtoken';

import dotenv from 'dotenv';

dotenv.config();

const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    try {
      const decodedToken = verify(token, process.env.SESSION_SECRET);
      req.user = {
        userId: decodedToken.userId,
        isAuth: true,
      };
      next();
    } catch (error) {
      next();
    }
  } else {
    next();
  }
};

const isAuth = (user) => {
  if (!user || !user.userId || !user.isAuth) {
    const error = new Error('unauthorized request, please login');
    error.code = 401;
    throw error;
  }
};

export { auth, isAuth };
