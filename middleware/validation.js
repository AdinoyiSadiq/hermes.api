import validator from 'validator';

const inputValidators = {
  signup(userDetails) {
    const errors = [];
    if (
      validator.isEmpty(userDetails.firstname)
      || !validator.isAlphanumeric(userDetails.firstname)
    ) {
      errors.push({
        field: 'firstname',
        message: 'please enter a valid firstname',
      });
    }
    if (
      validator.isEmpty(userDetails.lastname)
      || !validator.isAlphanumeric(userDetails.lastname)
    ) {
      errors.push({
        field: 'lastname',
        message: 'please enter a valid lastname',
      });
    }
    if (
      validator.isEmpty(userDetails.username)
      || !validator.isAlphanumeric(userDetails.username)
      || !validator.isLength(userDetails.username, { min: 3 })
    ) {
      errors.push({
        field: 'username',
        message: 'the user name can only contain letters and numbers',
      });
    }
    if (
      validator.isEmpty(userDetails.email)
      || !validator.isEmail(userDetails.email)
    ) {
      errors.push({
        field: 'email',
        message: 'enter a valid email',
      });
    }
    if (
      validator.isEmpty(userDetails.password)
      || !validator.isLength(userDetails.password, { min: 8 })
    ) {
      errors.push({
        field: 'password',
        message: 'password should be greater than 8 charaters long',
      });
    }
    if (validator.isEmpty(userDetails.location)) {
      errors.push({
        field: 'location',
        message: 'enter a valid location',
      });
    }
    return errors;
  },
  signin({ email, password }) {
    const errors = [];
    if (
      validator.isEmpty(email)
      || !validator.isEmail(email)
    ) {
      errors.push({
        field: 'email',
        message: 'enter a valid email',
      });
    }
    if (
      validator.isEmpty(password)
    ) {
      errors.push({
        field: 'password',
        message: 'enter a valid password',
      });
    }
    return errors;
  },
};

const validate = (name, userInput) => {
  const errors = inputValidators[name](userInput);
  if (errors.length > 0) {
    const error = new Error('invalid user input');
    error.data = errors;
    error.code = 400;
    throw error;
  }
};

export default validate;
