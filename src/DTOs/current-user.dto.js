// export default class CurrentUserDTO {
//   constructor(user) {
//     this.id = user.id;
//     this.first_name = user.first_name;
//     this.last_name = user.last_name;
//     this.role = user.role;
//   }
// }

import HTTP_RESPONSES from "../constants/http-responses.contant.js";
import HttpError from "../utils/HttpError.js";

export default class CurrentUserDTO {
  constructor(user) {
    if (!user) {
      throw new HttpError(
        HTTP_RESPONSES.NOT_FOUND,
        "User data is missing"
      );
    }

    this.id = user.id;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.role = user.role;
  }
}

