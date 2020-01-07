module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isAlphanumeric: {
          args: true,
          msg: 'the user name can only contain letters and numbers',
        },
        len: {
          args: [3, 25],
          msg: 'the user name must be between 3 and 25 characters long',
        },
      },
    },
    firstname: {
      type: DataTypes.STRING,
      validate: {
        isAlphanumeric: {
          args: true,
          msg: 'the first name can only contain letters and numbers',
        },
      },
    },
    lastname: {
      type: DataTypes.STRING,
      validate: {
        isAlphanumeric: {
          args: true,
          msg: 'the first name can only contain letters and numbers',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: {
          args: true,
          msg: 'invalid email',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [9, 100],
          msg: 'the password must be between than 8 and 100 characters long',
        },
      },
    },
    lastseen: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  user.associate = () => {
    // associations can be defined here
  };
  return user;
};
