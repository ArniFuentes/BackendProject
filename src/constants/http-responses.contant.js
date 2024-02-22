const HTTP_RESPONSES = {
  // Se creó exitosamente un producto
  CREATED: 201,
  UPDATED: 200,
  // Se eliminó exitosamente un producto
  DELETED: 204,
  DELETE_SUCCESS: "Item deleted successfully",
  UPDATE_SUCCESS: "Item updated successfully",
  // Error del cliente
  BAD_REQUEST: 400,
  // Error del servidor
  INTERNAL_SERVER_ERROR: 500,
  BAD_REQUEST_CONTENT: "Bad request",
};

module.exports = HTTP_RESPONSES;
