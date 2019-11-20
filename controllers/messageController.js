import models from '../models';

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
    const message = await this.messageModel.create(newMessage);
    return message;
  }

  async updateMessage(messageDetails) {
    const { userId, messageId, text } = messageDetails;
    const message = await this.messageModel.findOne({ where: { id: messageId } });
    if (!message) {
      const error = new Error('message was not found');
      error.code = 404;
      throw error;
    }
    if (message.senderId !== userId) {
      const error = new Error('unable to update message of another user');
      error.code = 422;
      throw error;
    }
    return message.update({ text, edited: true });
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

  async getMessages({ senderId, receiverId }) {
    const messages = await this.messageModel.findAll({ where: { senderId, receiverId }, order: [['createdAt']] });
    return messages;
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
    return true;
  }
}

export default Message;
