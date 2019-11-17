export const userOneSigninQuery = `
  {
    signin(email: "userOne@email.com", password: "password") {
      userId
      token
    }
  }
`;

export const userTwoSigninQuery = `
  {
    signin(email: "userTwo@email.com", password: "password") {
      userId
      token
    }
  }
`;

export const userThreeSigninQuery = `
  {
    signin(email: "userThree@email.com", password: "password") {
      userId
      token
    }
  }
`;
