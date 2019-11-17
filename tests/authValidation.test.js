import request from 'supertest';
import app from '../server';
import { closeDbConnection } from './helpers/testDbHelper';

describe('user authentication input validation', () => {
  afterAll(async (done) => {
    await closeDbConnection();
    done();
  });

  describe('user signup validation', () => {
    it('should return an error message when the user tries to sign up with a missing email field', async (done) => {
      const response = await request(app)
        .post('/graphql')
        .send({query: `
          mutation {
            signup(
              firstname: "firstname", 
              lastname: "lastname",
              username: "testname" 
              email: "", 
              password: "password",
              location: "location",
            ) {
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
  
    it('should return an error message when the user tries to sign up with a missing username field', async (done) => {
      const response = await request(app)
        .post('/graphql')
        .send({query: `
          mutation {
            signup(
              firstname: "firstname", 
              lastname: "lastname",
              username: "",
              email: "test@email.com", 
              password: "password",
              location: "location",
            ) {
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
  
    it('should return an error message when the user tries to sign up with a missing password field', async (done) => {
      const response = await request(app)
        .post('/graphql')
        .send({query: `
          mutation {
            signup(
              firstname: "firstname", 
              lastname: "lastname",
              username: "testname",
              email: "test@email.com", 
              password: ""
              location: "location",
            ) {
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
  
    it('should return an error message when the user tries to sign up with a missing firstname field', async (done) => {
      const response = await request(app)
        .post('/graphql')
        .send({query: `
          mutation {
            signup(
              firstname: "", 
              lastname: "lastname",
              username: "testname",
              email: "test@email.com", 
              password: "password"
              location: "location",
            ) {
              userId
              token
            }
          }
        `
        })
      const { status, data }  = response.body.errors[0];
      const { message } = data[0];
      expect(status).toEqual(400);
      expect(message).toEqual('please enter a valid firstname');
      done();
    });
  
    it('Should return an error message when the user tries to sign up with a missing lastname field', async (done) => {
      const response = await request(app)
        .post('/graphql')
        .send({query: `
          mutation {
            signup(
              firstname: "firstname", 
              lastname: "",
              username: "testname",
              email: "test@email.com", 
              password: "password"
              location: "location",
            ) {
              userId
              token
            }
          }
        `
        })
      const { status, data }  = response.body.errors[0];
      const { message } = data[0];
      expect(status).toEqual(400);
      expect(message).toEqual('please enter a valid lastname');
      done();
    });
  
    it('Should return an error message when the user tries to sign up with a missing location field', async (done) => {
      const response = await request(app)
        .post('/graphql')
        .send({query: `
          mutation {
            signup(
              firstname: "firstname", 
              lastname: "lastname",
              username: "testname",
              email: "test@email.com", 
              password: "password"
              location: "",
            ) {
              userId
              token
            }
          }
        `
        })
      const { status, data }  = response.body.errors[0];
      const { message } = data[0];
      expect(status).toEqual(400);
      expect(message).toEqual('enter a valid location');
      done();
    });
  });

  describe('user signin validation', () => {
    it('should return an error message when the user tries to sign in with an invalid email', async (done) => {
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

    it('should return an error message when the user tries to sign in with an invalid password', async (done) => {
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
  });
});