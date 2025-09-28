import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const sign = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRES_IN || '2h' });
};

const verify = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export default { sign, verify };
