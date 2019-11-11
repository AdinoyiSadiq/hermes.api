import request from 'supertest';
import app from '../server';
import { resetDB, closeDbConnection } from './testDbHelper';
import { signupMutation } from './testMutations';
import { signinQuery } from './testQueries';

describe('user controller', () => {
  afterAll(async (done) => {
    await resetDB();
    closeDbConnection();
    done();
  });

  afterEach(async (done) => {
    await resetDB();
    done();
  });

  describe('Signup a new user', () => {
    it('should create a user successfully', async (done) => {
      const response = await request(app)
        .post('/graphql')
        .send({ query: signupMutation })
      const { data: { signup }}  = response.body;
      expect(response.status).toEqual(200);
      expect(signup.token).toBeTruthy();
      done();
    }); 

    it('Should return an error message when the user tries to sign up with an already existing email', async (done) => {
      await request(app)
        .post('/graphql')
        .send({query: signupMutation })

      const response = await request(app)
        .post('/graphql')
        .send({query: signupMutation })

      const { message, status }  = response.body.errors[0];
      expect(status).toEqual(409);
      expect(message).toEqual('user with this email already exits');
      done();
    });

    it('Should return an error message when the user tries to sign up with a missing email field', async (done) => {
      const response = await request(app)
        .post('/graphql')
        .send({query: `
          mutation {
            signup(username: "testname" email: "", password: "password") {
              userId
              token
            }
          }
        `
        });
      const { status, data }  = response.body.errors[0];
      const { message } = data[0];
      expect(status).toEqual(400);
      expect(message).toEqual('enter a valid email');
      done();
    });

    it('Should return an error message when the user tries to sign up with a missing username field', async (done) => {
      const response = await request(app)
        .post('/graphql')
        .send({query: `
          mutation {
            signup(username: "" email: "test@email.com", password: "password") {
              userId
              token
            }
          }
        `
        })
      const { status, data }  = response.body.errors[0];
      const { message } = data[0];
      expect(status).toEqual(400);
      expect(message).toEqual('the user name can only contain letters and numbers');
      done();
    });

    it('Should return an error message when the user tries to sign up with a missing password field', async (done) => {
      const response = await request(app)
        .post('/graphql')
        .send({query: `
          mutation {
            signup(username: "testname" email: "test@email.com", password: "") {
              userId
              token
            }
          }
        `
        })
      const { status, data }  = response.body.errors[0];
      const { message } = data[0];
      expect(status).toEqual(400);
      expect(message).toEqual('password should be greater than 8 charaters long');
      done();
    });
  });

  describe('Signin a user', () => {
    it('should authenticate a user using username and password', async (done) => {
      await request(app)
        .post('/graphql')
        .send({query: signupMutation });
      const response = await request(app)
        .post('/graphql')
        .send({ query: signinQuery });
      const { data: { signin }}  = response.body;
      expect(response.status).toEqual(200);
      expect(signin.token).toBeTruthy();
      done();
    });

    it('Should return an error message when the user tries to sign in with an invalid email', async (done) => {
      const response = await request(app)
        .post('/graphql')
        .send({ query: `
          {
            signin(email: "test@email", password: "password") {
              userId
              token
            }
          }`
        })
        const { status, data }  = response.body.errors[0];
        const { message } = data[0];
        expect(status).toEqual(400);
        expect(message).toEqual('enter a valid email');
        done();
    });

    it('Should return an error message when the user tries to sign in with an invalid password', async (done) => {
      const response = await request(app)
        .post('/graphql')
        .send({ query: `
          {
            signin(email: "test@email.com", password: "") {
              userId
              token
            }
          }`
        })
        const { status, data }  = response.body.errors[0];
        const { message } = data[0];
        expect(status).toEqual(400);
        expect(message).toEqual('enter a valid password');
        done();
    });
  })
});