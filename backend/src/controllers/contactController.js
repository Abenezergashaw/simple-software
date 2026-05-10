const prisma = require('../prisma');

const submit = async (req, res) => {
  const { name, email, telegramUsername, message } = req.body;
  if (!name || !message) return res.status(400).json({ message: 'Name and message are required' });
  if (!telegramUsername && !email) return res.status(400).json({ message: 'Please provide a Telegram username or email so we can reach you' });
  const contact = await prisma.contactSubmission.create({ data: { name, email: email || null, telegramUsername: telegramUsername || null, message } });
  res.status(201).json({ message: 'Message received!', id: contact.id });
};

const getAll = async (req, res) => {
  const { unread } = req.query;
  const where = unread === 'true' ? { isRead: false } : {};
  const contacts = await prisma.contactSubmission.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json(contacts);
};

const markRead = async (req, res) => {
  const c = await prisma.contactSubmission.update({ where: { id: req.params.id }, data: { isRead: true } });
  res.json(c);
};

const remove = async (req, res) => {
  await prisma.contactSubmission.delete({ where: { id: req.params.id } });
  res.json({ message: 'Deleted' });
};

module.exports = { submit, getAll, markRead, remove };
