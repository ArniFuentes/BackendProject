const HTTP_RESPONSES = {
  CREATED: 201,  // Se creó exitosamente un producto
  UPDATED: 200,
  DELETED: 204,  // Se eliminó exitosamente un producto
  DELETE_SUCCESS: "Item deleted successfully",
  UPDATE_SUCCESS: "Item updated successfully",
  // Error del cliente
  BAD_REQUEST: 400,
  // Error del servidor
  INTERNAL_SERVER_ERROR: 500,
  BAD_REQUEST_CONTENT: "Bad request",
};

module.exports = HTTP_RESPONSES;
