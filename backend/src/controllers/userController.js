const bcrypt = require('bcryptjs');
const prisma = require('../prisma');

const safeUser = { id: true, name: true, email: true, role: true, avatar: true, createdAt: true };

const getProfile = async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: safeUser });
  res.json(user);
};

const updateProfile = async (req, res) => {
  const { name, password } = req.body;
  const data = { name };
  if (password) data.passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.update({ where: { id: req.user.id }, data, select: safeUser });
  res.json(user);
};

const getAll = async (req, res) => {
  const users = await prisma.user.findMany({ select: safeUser, orderBy: { createdAt: 'asc' } });
  res.json(users);
};

const create = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password required' });
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ message: 'Email already in use' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, passwordHash, role: role || 'DEVELOPER' }, select: safeUser });
  res.status(201).json(user);
};

const update = async (req, res) => {
  const { name, email, role, password } = req.body;
  const data = { name, email, role };
  if (password) data.passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.update({ where: { id: req.params.id }, data, select: safeUser });
  res.json(user);
};

const remove = async (req, res) => {
  if (req.params.id === req.user.id) return res.status(400).json({ message: 'Cannot delete yourself' });
  await prisma.user.delete({ where: { id: req.params.id } });
  res.json({ message: 'Deleted' });
};

module.exports = { getProfile, updateProfile, getAll, create, update, remove };
