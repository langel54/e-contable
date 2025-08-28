const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const prisma = require("../config/database");

const authService = {
  async login(email, password) {
    const user = await prisma.usuario.findFirst({
      where: { usuario: email },
      select: {
        id_usuario: true,
        usuario: true,
        password: true, // Asegúrate de traer la contraseña cifrada para validarla
        personal: {
          // Incluir los detalles relacionados con 'personal'
          select: {
            id_personal: true,
            nombres: true, // Aquí puedes incluir los campos que necesites
            apellidos: true,
            // otros campos relacionados con personal que necesites
          },
        },
        tipo_usuario: {
          // Incluir los detalles relacionados con 'tipo_usuario'
          select: {
            id_tipo: true,
            descripcion: true, // Otros campos que consideres necesarios
          },
        },
      },
    });
    if (!user) {
      throw new Error("User not found");
    }

    // Validar la contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid password");
    }

    // Crear el payload del token con la información del usuario
    const token = jwt.sign(
      {
        id: user.id_usuario,
        email: user.usuario,
        personal: user.personal, // Agregar información de 'personal'
        tipo_usuario: user.tipo_usuario, // Agregar información de 'tipo_usuario'
      },
      process.env.JWT_SECRET, // La clave secreta para firmar el token
      { expiresIn: "1d" } // Definir la expiración del token
    );

    // Retornar el token y la información del usuario
    return {
      token,
      user: {
        id: user.id_usuario,
        email: user.usuario,
        personal: user.personal, // Información adicional sobre 'personal'
        tipo_usuario: user.tipo_usuario, // Información adicional sobre 'tipo_usuario'
      },
    };
  },

  async register(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await prisma.usuario.create({
      data: {
        usuario: userData.email,
        password: hashedPassword,
        id_personal: userData.id_personal,
        id_tipo: userData.id_tipo,
      },
    });
    return user;
  },
};

module.exports = authService;
