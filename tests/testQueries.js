export const signinQuery = `
  {
    signin(email: "test@email.com", password: "password") {
      userId
      token
    }
  }
`;
