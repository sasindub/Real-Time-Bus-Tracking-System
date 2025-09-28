import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import jwtService from '../services/jwt.service.js';

const SALT_ROUNDS = 10;

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name, email, password: hashed, role });
    const token = jwtService.sign({ id: user._id, role: user.role });
    return res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    return res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwtService.sign({ id: user._id, role: user.role });
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    return res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
