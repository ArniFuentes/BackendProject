class CustomError {
  static createError({ name = "Error", message, code = 1000 }) {
    const error = new Error(message);
    error.name = name;
    error.code = code;
    throw error;
  }
}

module.exports = CustomError;
