const prisma = require('../prisma');
const path = require('path');
const fs = require('fs');

const projectSelect = {
  id: true, title: true, shortDesc: true, fullDesc: true, category: true,
  clientName: true, liveUrl: true, thumbnailUrl: true, status: true,
  completionPercent: true, startDate: true, endDate: true, isPublic: true,
  createdAt: true, updatedAt: true,
  images: true,
  milestones: { orderBy: { dueDate: 'asc' } },
};

const getPublicProjects = async (req, res) => {
  const { category } = req.query;
  const where = { isPublic: true };
  if (category && category !== 'ALL') where.category = category;
  const projects = await prisma.project.findMany({ where, select: projectSelect, orderBy: { createdAt: 'desc' } });
  res.json(projects);
};

const getPublicProject = async (req, res) => {
  const project = await prisma.project.findFirst({ where: { id: req.params.id, isPublic: true }, select: projectSelect });
  if (!project) return res.status(404).json({ message: 'Not found' });
  res.json(project);
};

const getAllProjects = async (req, res) => {
  const { category, status, search } = req.query;
  const where = {};
  if (category && category !== 'ALL') where.category = category;
  if (status && status !== 'ALL') where.status = status;
  if (search) where.title = { contains: search, mode: 'insensitive' };
  const projects = await prisma.project.findMany({
    where, select: { ...projectSelect, finance: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(projects);
};

const getProject = async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { id: req.params.id },
    include: { images: true, milestones: { orderBy: { dueDate: 'asc' } }, notes: { include: { user: { select: { id: true, name: true, avatar: true } } }, orderBy: { createdAt: 'desc' } }, finance: true },
  });
  if (!project) return res.status(404).json({ message: 'Not found' });
  res.json(project);
};

const createProject = async (req, res) => {
  const { title, shortDesc, fullDesc, category, clientName, liveUrl, status, completionPercent, startDate, endDate, isPublic } = req.body;
  const thumbnailUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const project = await prisma.project.create({
    data: {
      title, shortDesc, fullDesc, category, clientName,
      liveUrl: liveUrl || null, thumbnailUrl,
      status: status || 'PLANNING',
      completionPercent: parseInt(completionPercent) || 0,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      isPublic: isPublic === 'true' || isPublic === true,
      finance: { create: {} },
    },
    include: { finance: true },
  });
  res.status(201).json(project);
};

const updateProject = async (req, res) => {
  const { title, shortDesc, fullDesc, category, clientName, liveUrl, status, completionPercent, startDate, endDate, isPublic } = req.body;
  const data = {
    title, shortDesc, fullDesc, category, clientName,
    liveUrl: liveUrl || null, status,
    completionPercent: parseInt(completionPercent) || 0,
    startDate: startDate ? new Date(startDate) : null,
    endDate: endDate ? new Date(endDate) : null,
    isPublic: isPublic === 'true' || isPublic === true,
  };
  if (req.file) data.thumbnailUrl = `/uploads/${req.file.filename}`;
  const project = await prisma.project.update({ where: { id: req.params.id }, data });
  res.json(project);
};

const deleteProject = async (req, res) => {
  await prisma.project.delete({ where: { id: req.params.id } });
  res.json({ message: 'Deleted' });
};

const addImages = async (req, res) => {
  const images = req.files.map((f) => ({ projectId: req.params.id, imageUrl: `/uploads/${f.filename}`, caption: '' }));
  await prisma.projectImage.createMany({ data: images });
  const updated = await prisma.project.findUnique({ where: { id: req.params.id }, include: { images: true } });
  res.json(updated.images);
};

const deleteImage = async (req, res) => {
  const img = await prisma.projectImage.findUnique({ where: { id: req.params.imageId } });
  if (img) {
    const filePath = path.join(__dirname, '../../src/uploads', path.basename(img.imageUrl));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await prisma.projectImage.delete({ where: { id: req.params.imageId } });
  }
  res.json({ message: 'Deleted' });
};

const getMilestones = async (req, res) => {
  const milestones = await prisma.milestone.findMany({ where: { projectId: req.params.id }, orderBy: { dueDate: 'asc' } });
  res.json(milestones);
};

const createMilestone = async (req, res) => {
  const { title, description, status, dueDate } = req.body;
  const m = await prisma.milestone.create({ data: { projectId: req.params.id, title, description, status: status || 'PENDING', dueDate: dueDate ? new Date(dueDate) : null } });
  res.status(201).json(m);
};

const updateMilestone = async (req, res) => {
  const { title, description, status, dueDate } = req.body;
  const m = await prisma.milestone.update({ where: { id: req.params.mid }, data: { title, description, status, dueDate: dueDate ? new Date(dueDate) : null } });
  res.json(m);
};

const deleteMilestone = async (req, res) => {
  await prisma.milestone.delete({ where: { id: req.params.mid } });
  res.json({ message: 'Deleted' });
};

const getNotes = async (req, res) => {
  const notes = await prisma.projectNote.findMany({
    where: { projectId: req.params.id },
    include: { user: { select: { id: true, name: true, avatar: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(notes);
};

const createNote = async (req, res) => {
  const { content } = req.body;
  const note = await prisma.projectNote.create({
    data: { projectId: req.params.id, userId: req.user.id, content },
    include: { user: { select: { id: true, name: true, avatar: true } } },
  });
  res.status(201).json(note);
};

const deleteNote = async (req, res) => {
  const note = await prisma.projectNote.findUnique({ where: { id: req.params.nid } });
  if (!note) return res.status(404).json({ message: 'Not found' });
  if (note.userId !== req.user.id && req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });
  await prisma.projectNote.delete({ where: { id: req.params.nid } });
  res.json({ message: 'Deleted' });
};

module.exports = { getPublicProjects, getPublicProject, getAllProjects, getProject, createProject, updateProject, deleteProject, addImages, deleteImage, getMilestones, createMilestone, updateMilestone, deleteMilestone, getNotes, createNote, deleteNote };
