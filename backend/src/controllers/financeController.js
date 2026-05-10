const prisma = require('../prisma');

const getReports = async (req, res) => {
  const { from, to, category, paymentStatus } = req.query;
  const where = {};
  if (category && category !== 'ALL') where.project = { category };
  if (paymentStatus && paymentStatus !== 'ALL') where.paymentStatus = paymentStatus;
  if (from || to) {
    where.project = { ...where.project, createdAt: {} };
    if (from) where.project.createdAt.gte = new Date(from);
    if (to) where.project.createdAt.lte = new Date(to);
  }
  const finances = await prisma.projectFinance.findMany({
    where,
    include: { project: { select: { id: true, title: true, clientName: true, category: true, status: true, createdAt: true } } },
    orderBy: { project: { createdAt: 'desc' } },
  });
  res.json(finances);
};

const getSummary = async (req, res) => {
  const { from, to } = req.query;
  const projectWhere = {};
  if (from || to) {
    projectWhere.createdAt = {};
    if (from) projectWhere.createdAt.gte = new Date(from);
    if (to) projectWhere.createdAt.lte = new Date(to);
  }
  const finances = await prisma.projectFinance.findMany({ where: { project: projectWhere } });
  const totalRevenue = finances.reduce((s, f) => s + f.totalRevenue, 0);
  const totalExpenses = finances.reduce((s, f) => s + f.totalExpenses, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const activeProjects = await prisma.project.count({ where: { status: 'IN_PROGRESS' } });
  const unreadContacts = await prisma.contactSubmission.count({ where: { isRead: false } });
  res.json({ totalRevenue, totalExpenses, totalProfit, activeProjects, unreadContacts, projectCount: finances.length });
};

const getProjectFinance = async (req, res) => {
  const finance = await prisma.projectFinance.findUnique({ where: { projectId: req.params.projectId } });
  res.json(finance || null);
};

const upsertProjectFinance = async (req, res) => {
  const { budget, totalExpenses, totalRevenue, paymentStatus, notes } = req.body;
  const finance = await prisma.projectFinance.upsert({
    where: { projectId: req.params.projectId },
    update: { budget: parseFloat(budget) || 0, totalExpenses: parseFloat(totalExpenses) || 0, totalRevenue: parseFloat(totalRevenue) || 0, paymentStatus, notes: notes || null },
    create: { projectId: req.params.projectId, budget: parseFloat(budget) || 0, totalExpenses: parseFloat(totalExpenses) || 0, totalRevenue: parseFloat(totalRevenue) || 0, paymentStatus: paymentStatus || 'PENDING', notes: notes || null },
  });
  res.json(finance);
};

module.exports = { getReports, getSummary, getProjectFinance, upsertProjectFinance };
