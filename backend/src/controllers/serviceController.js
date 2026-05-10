const prisma = require('../prisma');

const getAll = async (req, res) => {
  const services = await prisma.service.findMany({ orderBy: { orderIndex: 'asc' } });
  res.json(services);
};

const create = async (req, res) => {
  const { title, description, icon, orderIndex } = req.body;
  const s = await prisma.service.create({ data: { title, description, icon, orderIndex: parseInt(orderIndex) || 0 } });
  res.status(201).json(s);
};

const update = async (req, res) => {
  const { title, description, icon, orderIndex } = req.body;
  const s = await prisma.service.update({ where: { id: req.params.id }, data: { title, description, icon, orderIndex: parseInt(orderIndex) || 0 } });
  res.json(s);
};

const remove = async (req, res) => {
  await prisma.service.delete({ where: { id: req.params.id } });
  res.json({ message: 'Deleted' });
};

module.exports = { getAll, create, update, remove };
