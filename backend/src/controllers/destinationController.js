const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');

const prisma = new PrismaClient();

const getAll = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const { visited, continent, sortBy = 'createdAt', order = 'desc' } = req.query;

  const where = { userId: req.userId };
  if (visited !== undefined) where.visited = visited === 'true';
  if (continent) where.continent = continent;

  const [destinations, total] = await Promise.all([
    prisma.destination.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: order },
    }),
    prisma.destination.count({ where }),
  ]);

  res.json({
    data: destinations,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};

const getOne = async (req, res) => {
  const destination = await prisma.destination.findFirst({
    where: { id: parseInt(req.params.id), userId: req.userId },
  });

  if (!destination) return res.status(404).json({ error: 'Destination not found' });
  res.json(destination);
};

const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, country, continent, estimatedCost, priority, visited, notes } = req.body;

  const destination = await prisma.destination.create({
    data: {
      name,
      country,
      continent,
      estimatedCost: parseFloat(estimatedCost),
      priority: parseInt(priority),
      visited: visited || false,
      notes,
      userId: req.userId,
    },
  });

  res.status(201).json(destination);
};

const update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const existing = await prisma.destination.findFirst({
    where: { id: parseInt(req.params.id), userId: req.userId },
  });

  if (!existing) return res.status(404).json({ error: 'Destination not found' });

  const { name, country, continent, estimatedCost, priority, visited, notes } = req.body;

  const destination = await prisma.destination.update({
    where: { id: parseInt(req.params.id) },
    data: {
      name,
      country,
      continent,
      estimatedCost: parseFloat(estimatedCost),
      priority: parseInt(priority),
      visited,
      notes,
    },
  });

  res.json(destination);
};

const remove = async (req, res) => {
  const existing = await prisma.destination.findFirst({
    where: { id: parseInt(req.params.id), userId: req.userId },
  });

  if (!existing) return res.status(404).json({ error: 'Destination not found' });

  await prisma.destination.delete({ where: { id: parseInt(req.params.id) } });
  res.status(204).send();
};

const getStats = async (req, res) => {
  const where = { userId: req.userId };

  const [total, visited, byCont, costStats] = await Promise.all([
    prisma.destination.count({ where }),
    prisma.destination.count({ where: { ...where, visited: true } }),
    prisma.destination.groupBy({
      by: ['continent'],
      where,
      _count: { id: true },
      _sum: { estimatedCost: true },
    }),
    prisma.destination.aggregate({
      where,
      _avg: { estimatedCost: true },
      _sum: { estimatedCost: true },
      _max: { estimatedCost: true },
      _min: { estimatedCost: true },
    }),
  ]);

  res.json({
    total,
    visited,
    notVisited: total - visited,
    byContinent: byCont,
    cost: {
      average: costStats._avg.estimatedCost,
      total: costStats._sum.estimatedCost,
      max: costStats._max.estimatedCost,
      min: costStats._min.estimatedCost,
    },
  });
};

module.exports = { getAll, getOne, create, update, remove, getStats };