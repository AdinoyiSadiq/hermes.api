import { Op } from 'sequelize';
import models from '../models';

class ActiveUser {
  constructor() {
    this.activeuserModel = models.activeuser;
    this.userModel = models.user;
  }

  async createActiveUser(userOneId, userTwoId) {
    const activeUser = await this.getActiveUser({ userOneId, userTwoId });
    if (!activeUser) {
      await this.activeuserModel.create({ userOneId, userTwoId });
    }
  }

  async getActiveUser({ userOneId, userTwoId }) {
    const activeUser = await this.activeuserModel.findOne({
      where: {
        [Op.or]: [
          {
            userOneId: {
              [Op.eq]: userOneId,
            },
            userTwoId: {
              [Op.eq]: userTwoId,
            },
          },
          {
            userOneId: {
              [Op.eq]: userTwoId,
            },
            userTwoId: {
              [Op.eq]: userOneId,
            },
          },
        ],
      },
      include: [
        {
          model: this.userModel,
          as: 'userOne',
        },
        {
          model: this.userModel,
          as: 'userTwo',
        },
      ],
    });
    return activeUser;
  }

  async getActiveUsers(userId) {
    const activeUsers = await this.activeuserModel.findAll({
      where: {
        [Op.or]: [
          {
            userOneId: {
              [Op.eq]: userId,
            },
          },
          {
            userTwoId: {
              [Op.eq]: userId,
            },
          },
        ],
      },
      include: [
        {
          model: this.userModel,
          as: 'userOne',
        },
        {
          model: this.userModel,
          as: 'userTwo',
        },
      ],
    });
    return [...activeUsers];
  }
}

export default ActiveUser;
