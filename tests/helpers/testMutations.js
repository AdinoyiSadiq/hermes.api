export const userOneSignupMutation = `
  mutation {
    signup(
      firstname: "firstname", 
      lastname: "lastname",
      username: "userOne",
      email: "userOne@email.com",
      password: "password",
      location: "location",
      ) {
      userId
      token
    }
  }
`;

export const userTwoSignupMutation = `
  mutation {
    signup(
      firstname: "firstname", 
      lastname: "lastname",
      username: "userTwo",
      email: "userTwo@email.com",
      password: "password",
      location: "location",
      ) {
      userId
      token
    }
  }
`;

export const userThreeSignupMutation = `
  mutation {
    signup(
      firstname: "firstname", 
      lastname: "lastname",
      username: "userThree",
      email: "userThree@email.com",
      password: "password",
      location: "location",
      ) {
      userId
      token
    }
  }
`;
