// MySQL User 모델
class User {
  constructor({ id, profile_image, name, nickname }) {
    this.id = id;
    this.profile_image = profile_image;
    this.name = name;
    this.nickname = nickname;
  }
}

module.exports = User;
