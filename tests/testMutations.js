export const signupMutation = `
  mutation {
    signup(username: "testname" email: "test@email.com", password: "password") {
      userId
      token
    }
  }
`;
