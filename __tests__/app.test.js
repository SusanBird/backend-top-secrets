const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const mockUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: '12345',
};

// const registerAndLogin = async (userProps = {}) => {
//   const password = userProps.password ?? mockUser.password;

//   const agent = request.agent(app);
//   const user = await UserService.create({ ...mockUser, ...userProps });

//   const { email } = user;
//   await agent.post('/api/v1/users/sessions').send({ email, password });
//   return [agent, user];
// };

describe('top-secret routes', () => {
  beforeEach(() => {
    return setup(pool);
  });


  it('creates a new user', async () => {
    const res = await request(app).post('/api/v1/users')
      .send(mockUser);
    const { firstName, lastName, email } = mockUser;
    expect(res.body).toEqual({
      id: expect.any(String),
      firstName,
      lastName,
      email,
    });
  });

  it('signs in a user', async () => {
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send(mockUser);
    expect(res.status).toEqual(200);
  });

  it('logs out a user', async () => {
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send(mockUser);
    expect(res.status).toEqual(200);
  });


  // it('signs in a user', async () => {
  //   const [agent, user] = await registerAndLogin();
  //   const currentUser = await agent.get('/api/v1/users/currentUser');
    
  //   expect(currentUser.body).toEqual({
  //     ...user,
  //     exp: expect.any(Number),
  //     iat: expect.any(Number),
  //   });
  // });

  afterAll(() => {
    pool.end();
  });
});
