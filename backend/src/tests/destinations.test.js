const request = require('supertest');
const app = require('../index');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
let token;
let destinationId;

beforeAll(async () => {
  await prisma.destination.deleteMany({});
  await prisma.user.deleteMany({});

  const registerRes = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Dest Tester',
      email: 'dest@example.com',
      password: 'password123'
    });

  token = registerRes.body.token;

  const destRes = await request(app)
    .post('/api/destinations')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Tokyo',
      country: 'Japan',
      continent: 'Asia',
      estimatedCost: 2500,
      priority: 5,
      visited: false,
      notes: 'Cherry blossom season'
    });

  destinationId = destRes.body.id;
}, 30000);

afterAll(async () => {
  await prisma.destination.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
}, 30000);

const validDestination = {
  name: 'Tokyo',
  country: 'Japan',
  continent: 'Asia',
  estimatedCost: 2500,
  priority: 5,
  visited: false,
  notes: 'Cherry blossom season'
};

describe('Destinations - Auth protection', () => {
  it('should reject requests without token', async () => {
    const res = await request(app).get('/api/destinations');
    expect(res.status).toBe(401);
  });

  it('should reject requests with invalid token', async () => {
    const res = await request(app)
      .get('/api/destinations')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.status).toBe(401);
  });
});

describe('Destinations - Create', () => {
  it('should create a destination successfully', async () => {
    const res = await request(app)
      .post('/api/destinations')
      .set('Authorization', `Bearer ${token}`)
      .send(validDestination);

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Tokyo');
    expect(res.body.country).toBe('Japan');
    expect(res.body.continent).toBe('Asia');
    expect(res.body.estimatedCost).toBe(2500);
  });

  it('should not create with missing name', async () => {
    const res = await request(app)
      .post('/api/destinations')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validDestination, name: '' });

    expect(res.status).toBe(400);
  });

  it('should not create with invalid continent', async () => {
    const res = await request(app)
      .post('/api/destinations')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validDestination, continent: 'Narnia' });

    expect(res.status).toBe(400);
  });

  it('should not create with negative cost', async () => {
    const res = await request(app)
      .post('/api/destinations')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validDestination, estimatedCost: -100 });

    expect(res.status).toBe(400);
  });

  it('should not create with priority out of range', async () => {
    const res = await request(app)
      .post('/api/destinations')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validDestination, priority: 10 });

    expect(res.status).toBe(400);
  });
});

describe('Destinations - Read', () => {
  it('should get all destinations with pagination', async () => {
    const res = await request(app)
      .get('/api/destinations')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.total).toBeGreaterThan(0);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should get a single destination by id', async () => {
    const res = await request(app)
      .get(`/api/destinations/${destinationId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(destinationId);
    expect(res.body.name).toBe('Tokyo');
  });

  it('should return 404 for non-existent destination', async () => {
    const res = await request(app)
      .get('/api/destinations/99999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it('should filter by continent', async () => {
    const res = await request(app)
      .get('/api/destinations?continent=Asia')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    res.body.data.forEach(d => expect(d.continent).toBe('Asia'));
  });

  it('should filter by visited status', async () => {
    const res = await request(app)
      .get('/api/destinations?visited=false')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    res.body.data.forEach(d => expect(d.visited).toBe(false));
  });

  it('should paginate correctly', async () => {
    const res = await request(app)
      .get('/api/destinations?page=1&limit=1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeLessThanOrEqual(1);
    expect(res.body.pagination.limit).toBe(1);
  });
});

describe('Destinations - Stats', () => {
  it('should return stats', async () => {
    const res = await request(app)
      .get('/api/destinations/stats')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.total).toBeDefined();
    expect(res.body.visited).toBeDefined();
    expect(res.body.notVisited).toBeDefined();
    expect(res.body.byContinent).toBeDefined();
    expect(res.body.cost).toBeDefined();
  });
});

describe('Destinations - Update', () => {
  it('should update a destination successfully', async () => {
    const res = await request(app)
      .put(`/api/destinations/${destinationId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validDestination, name: 'Kyoto', visited: true });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Kyoto');
    expect(res.body.visited).toBe(true);
  });

  it('should not update non-existent destination', async () => {
    const res = await request(app)
      .put('/api/destinations/99999')
      .set('Authorization', `Bearer ${token}`)
      .send(validDestination);

    expect(res.status).toBe(404);
  });

  it('should not update with invalid data', async () => {
    const res = await request(app)
      .put(`/api/destinations/${destinationId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validDestination, continent: 'InvalidPlace' });

    expect(res.status).toBe(400);
  });
});

describe('Destinations - Delete', () => {
  it('should delete a destination successfully', async () => {
    const res = await request(app)
      .delete(`/api/destinations/${destinationId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(204);
  });

  it('should return 404 after deletion', async () => {
    const res = await request(app)
      .get(`/api/destinations/${destinationId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it('should not delete non-existent destination', async () => {
    const res = await request(app)
      .delete('/api/destinations/99999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});