export const authorize = (roles = []) => (req, res, next) => {
  if (typeof roles === 'string') roles = [roles];
  if (!roles.length) return next();
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden - insufficient role' });
  }
  return next();
};
