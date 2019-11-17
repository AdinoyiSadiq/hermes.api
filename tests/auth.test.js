import request from 'supertest';
import app from '../server';
import { resetDB, closeDbConnection } from './helpers/testDbHelper';
import { userOneSignupMutation, userTwoSignupMutation, userThreeSignupMutation } from './helpers/testMutations';
import { userTwoSigninQuery } from './helpers/testQueries';

describe('user authentication', () => {
  afterAll(async (done) => {
    await resetDB();
    await closeDbConnection();
    done();
  });

  it('should create and signup a user successfully', async (done) => {
    const response = await request(app)
      .post('/graphql')
      .send({ query: userOneSignupMutation });
    const { data: { signup }}  = response.body;
    expect(response.status).toEqual(200);
    expect(signup.token).toBeTruthy();
    done();
  }); 

  it('should signin a user using username and password', async (done) => {
    await request(app)
      .post('/graphql')
      .send({query: userTwoSignupMutation });
    const response = await request(app)
      .post('/graphql')
      .send({ query: userTwoSigninQuery });
    const { data: { signin }}  = response.body;
    expect(response.status).toEqual(200);
    expect(signin.token).toBeTruthy();
    done();
  });

  it('should return an error message when the user tries to sign up with an already existing email', async (done) => {
    await request(app)
      .post('/graphql')
      .send({query: userThreeSignupMutation })

    const response = await request(app)
      .post('/graphql')
      .send({query: userThreeSignupMutation })

    const { message, status }  = response.body.errors[0];
    expect(status).toEqual(409);
    expect(message).toEqual('user with this email already exits');
    done();
  });
})