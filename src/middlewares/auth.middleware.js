import jwtService from '../services/jwt.service.js';
import User from '../models/user.model.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message: 'Missing token' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwtService.verify(token);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Invalid token - user not found' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token', error: err.message });
  }
};
