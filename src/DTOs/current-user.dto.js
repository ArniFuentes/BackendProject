export default class CurrentUserDTO {
  constructor(user) {
    this.id = user.id;
    this.first_name = user.first_name;
    this.role = user.role;
  }
}



