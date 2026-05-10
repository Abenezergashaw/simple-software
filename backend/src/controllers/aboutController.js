const prisma = require('../prisma');

const get = async (req, res) => {
  let about = await prisma.aboutContent.findFirst();
  res.json(about || null);
};

const update = async (req, res) => {
  const { mission, vision, companyDescription, foundedYear, teamSize, contactEmail, contactPhone, location } = req.body;
  const existing = await prisma.aboutContent.findFirst();
  const data = { mission, vision, companyDescription, foundedYear: parseInt(foundedYear), teamSize: parseInt(teamSize), contactEmail: contactEmail || null, contactPhone: contactPhone || null, location: location || null };
  const about = existing
    ? await prisma.aboutContent.update({ where: { id: existing.id }, data })
    : await prisma.aboutContent.create({ data });
  res.json(about);
};

module.exports = { get, update };
