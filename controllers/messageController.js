import { Op } from 'sequelize';
import models from '../models';
import ActiveUserController from './activeuserController';


class Message {
  constructor() {
    this.messageModel = models.message;
  }

  async createMessage(messageDetails) {
    const newMessage = { ...messageDetails };
    const { senderId, receiverId } = newMessage;
    if (senderId === receiverId) {
      const error = new Error('sender and receiver Id cannot be the same');
      error.code = 422;
      throw error;
    }
    if (newMessage.quoteId) {
      const message = await this.messageModel.findOne({ where: { id: newMessage.quoteId } });
      if (!message) {
        const error = new Error('message to be quoted was not found');
        error.code = 404;
        throw error;
      }
      newMessage.quote = true;
    }
    const activeuserController = new ActiveUserController();
    await activeuserController.createActiveUser(senderId, receiverId);
    // Note: deconstruct the newMessage object
    const message = await this.messageModel.create(newMessage);
    return message;
  }

  async updateMessages(messageDetails) {
    const { messageIds, state } = messageDetails;
    await this.messageModel.update(
      { state, edited: true },
      { where: { id: messageIds } },
    );
    const updatedMessages = await this.messageModel.findAll({ where: { id: messageIds } });
    return updatedMessages;
  }

  async getMessage({ messageId, quote }) {
    const message = await this.messageModel.findOne({ where: { id: messageId } });
    if (!message) {
      if (quote) {
        return [];
      }
      const error = new Error('message was not found');
      error.code = 404;
      throw error;
    }
    return [message];
  }

  async getMessages({
    senderId, receiverId, cursor, limit,
  }) {
    const options = {
      where: {
        [Op.or]: [
          {
            senderId: {
              [Op.eq]: senderId,
            },
            receiverId: {
              [Op.eq]: receiverId,
            },
          },
          {
            senderId: {
              [Op.eq]: receiverId,
            },
            receiverId: {
              [Op.eq]: senderId,
            },
          },
        ],
      },
      limit: limit || 15,
      order: [['createdAt', 'DESC']],
    };

    if (cursor) {
      options.where.createdAt = {
        [Op.lt]: new Date(new Date(parseInt(cursor, 10)) - 24 * 60 * 60 * 1000),
      };
    }

    const messages = await this.messageModel.findAll(options);
    return messages;
  }

  async getUnreadMessages({ senderId, receiverId }) {
    const messages = await this.messageModel.findAll({
      where: { senderId, receiverId, state: 'sent' },
    });
    return messages.length;
  }

  async deleteMessage({ messageId, userId }) {
    const message = await this.messageModel.findOne({ where: { id: messageId } });
    if (!message) {
      const error = new Error('message was not found');
      error.code = 404;
      throw error;
    }
    if (message.senderId !== userId) {
      const error = new Error('unable to delete message of another user');
      error.code = 422;
      throw error;
    }
    await message.destroy(messageId);
    return message;
  }

  async getLastMessage({ userOneId, userTwoId }) {
    const lastMessage = await this.messageModel.findOne({
      limit: 1,
      where: {
        [Op.or]: [
          {
            senderId: {
              [Op.eq]: userOneId,
            },
            receiverId: {
              [Op.eq]: userTwoId,
            },
          },
          {
            senderId: {
              [Op.eq]: userTwoId,
            },
            receiverId: {
              [Op.eq]: userOneId,
            },
          },
        ],
      },
      order: [['createdAt', 'DESC']],
    });
    return lastMessage;
  }
}

export default Message;
