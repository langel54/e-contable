const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  // Validación básica de email
  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // if (!emailRegex.test(email)) {
  //   return res.status(400).json({
  //     message: "Invalid email format",
  //   });
  // }

  // Validación de longitud de contraseña
  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters long",
    });
  }

  next();
};

const validateRegister = (req, res, next) => {
  const { email, password, id_personal, id_tipo } = req.body;

  if (!email || !password || !id_personal || !id_tipo) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  // Validación de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format",
    });
  }

  // Validación de contraseña
  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters long",
    });
  }

  // Validación de id_personal e id_tipo
  if (!Number.isInteger(id_personal) || !Number.isInteger(id_tipo)) {
    return res.status(400).json({
      message: "Invalid id_personal or id_tipo",
    });
  }

  next();
};

// Middleware para validar IDs en rutas parametrizadas
const validateId = (req, res, next) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      message: "Invalid ID parameter",
    });
  }

  next();
};

// Middleware para validar paginación
const validatePagination = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search?.trim();

  if (page < 1 || limit < 1 || limit > 100) {
    return res.status(400).json({
      message: "Invalid pagination parameters",
    });
  }

  // Validar el parámetro de búsqueda
  if (search !== undefined && search.length < 2) {
    return res.status(400).json({
      message: "Search term must be at least 2 characters long",
    });
  }

  req.pagination = {
    page,
    limit,
    skip: (page - 1) * limit,
    search,
  };

  next();
};

module.exports = {
  validateLogin,
  validateRegister,
  validateId,
  validatePagination,
};
