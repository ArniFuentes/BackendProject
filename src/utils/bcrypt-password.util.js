import bcrypt from "bcrypt";

export const createHash = (password) => {
  const salt = bcrypt.genSaltSync();
  // Hashear la clave
  return bcrypt.hashSync(password, salt);
};

// Comparar la clave encriptada con la que se ingresó en el login y devuelve true o false
export const useValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

