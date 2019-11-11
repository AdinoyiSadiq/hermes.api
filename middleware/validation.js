import validator from 'validator';

const inputValidators = {
  signup({ username, email, password }) {
    const errors = [];
    if (
      validator.isEmpty(username)
      || !validator.isAlphanumeric(username)
      || !validator.isLength(username, { min: 3 })
    ) {
      errors.push({
        field: 'username',
        message: 'the user name can only contain letters and numbers',
      });
    }
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
      || !validator.isLength(password, { min: 8 })
    ) {
      errors.push({
        field: 'password',
        message: 'password should be greater than 8 charaters long',
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
