const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma');

const signAccess = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '15m' });

const signRefresh = (user) =>
  jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const accessToken = signAccess(user);
  const refreshToken = signRefresh(user);
  res.json({ accessToken, refreshToken, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
};

const refreshToken = async (req, res) => {
  const { refreshToken: token } = req.body;
  if (!token) return res.status(400).json({ message: 'Refresh token required' });
  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) return res.status(401).json({ message: 'User not found' });
    res.json({ accessToken: signAccess(user) });
  } catch {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

const me = async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { id: true, name: true, email: true, role: true, avatar: true, createdAt: true } });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

module.exports = { login, refreshToken, me };
