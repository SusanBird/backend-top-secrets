const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const mockUser = {
  email: 'test@example.com',
  password: '12345',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;
  const agent = request.agent(app);
  const user = await UserService.create({ ...mockUser, ...userProps });

  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
}

describe('top-secret routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('creates a new user', async () => {
    const res = await request(app).post('/api/v1/users')
      .send(mockUser);
    const { email } = mockUser;
    expect(res.body).toEqual({
      id: expect.any(String),
      email,
    });
  })

  it('signs in a user', async () => {
    await request(app).post('/api/v1/users').send(mockUser);
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send(mockUser);
    expect(res.status).toEqual(200);
  })

  it('logs out a user', async () => {
    const res = await request(app)
      .delete('/api/v1/users/sessions');
    expect(res.status).toEqual(200);
    expect(res.body.message).toBe('Signed out successfully!');
  })

  it('returns a list of secrets for logged in user', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.get('/api/v1/secrets');

    expect(res.body[0]).toEqual({
      title: 'Secret 1',
      description: 'Top secret information',
      created_at: expect.any(String),
    });
  })

  it('logged in user can create new secrets', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.post('/api/v1/secrets').send({
      title: 'Secret 1',
      description: 'Top secret information',
    });
    expect(res.status).toEqual(200);
  });

  afterAll(() => {
    pool.end();
  });
});










  // it('should return a 403 when signed in but not admin and listing all users', async () => {
  //   const [agent] = await registerAndLogin();
  //   const res = await agent.get('/api/v1/users');

  //   expect(res.body).toEqual({
  //     message: 'You do not have access to view this page',
  //     status: 403,
  //   });
  // });

  // it('should return a list of users if signed in as admin', async () => {
  //   const [agent, user] = await registerAndLogin({ email: 'admin' });
  //   const res = await agent.get('/api/v1/users');

  //   expect(res.body).toEqual([{ ...user }]);
  // });


  // it('signs in a user', async () => {
  //   const [agent, user] = await registerAndLogin();
  //   const currentUser = await agent.get('/api/v1/users/currentUser');
    
  //   expect(currentUser.body).toEqual({
  //     ...user,
  //     exp: expect.any(Number),
  //     iat: expect.any(Number),
  //   });
  // });
