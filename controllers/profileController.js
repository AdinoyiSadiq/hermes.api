import models from '../models';

class Profile {
  constructor() {
    this.profileModel = models.profile;
  }

  async createProfile(profileDetails) {
    const userProfile = await this.profileModel.create(profileDetails);
    return userProfile;
  }

  async getProfile(userId) {
    const userProfile = await this.profileModel.findOne({ where: { userId } });
    if (!userProfile) {
      const error = new Error('user profile does not exist');
      error.code = 409;
      throw error;
    }
    return userProfile;
  }

  async updateProfile(profileDetails) {
    const {
      location,
      user: { userId },
    } = profileDetails;
    const userProfile = await this.profileModel.findOne({ where: { userId } });
    if (!userProfile) {
      const error = new Error('user profile does not exist');
      error.code = 409;
      throw error;
    }
    const updatedProfile = await userProfile.update({
      location: location || userProfile.location,
    });
    return updatedProfile;
  }
}

export default Profile;
