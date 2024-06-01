// Manejar de forma centralizada los códigos y mensajes de error
const HTTP_RESPONSES = {
  SUCCESS_CONTENT: "Operation successful",
  CREATED: 201,
  CREATED_CONTENT: "Resource created successfully",
  UPDATED: 200,
  UPDATE_CONTENT: "Item updated successfully",
  DELETED: 204,
  DELETE_CONTENT: "Item deleted successfully",
  BAD_REQUEST: 400,
  BAD_REQUEST_CONTENT: "Bad request",
  UNAUTHORIZED: 401,
  UNAUTHORIZED_CONTENT: "Unauthorized",
  FORBIDDEN: 403,
  FORBIDDEN_CONTENT: "Forbidden",
  NOT_FOUND: 404,
  NOT_FOUND_CONTENT: "Item not found",
  CONFLICT: 409,
  CONFLICT_CONTENT: "Conflict",
  INTERNAL_SERVER_ERROR: 500,
  INTERNAL_SERVER_ERROR_CONTENT: "Internal Server Error",
};

export default HTTP_RESPONSES;
