import jwt from 'jsonwebtoken';

const userMiddleware = {
  
  //verificar si el usuario tiene un Token válido
  isLoggedIn: (req, res, next) => {
    try {

      // formato estandar  "Bearer asdasdiojasio ..." bearer = portador
      const authHeader = req.headers.authorization;

      //verifica que exista el token o que tenga el formato correcto
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
          mensaje: "Acceso denegado. Falta el token o el formato es incorrecto." 
        });
      }

      // Extraemos solo el token, separando la palabra "Bearer"
      const token = authHeader.split(' ')[1];

      // Verificamos el token usando la clave secreta del .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Si el token es válido, guardamos los datos del usuario dentro del objeto 'req' 
      req.userData = decoded;

      // si todo está bien, le decimos a Express que continúe a la ruta
      next();
      
    } catch (error) {
      return res.status(401).json({ 
        mensaje: "Tu sesión es inválida o ha expirado." 
      });
    }
  },

  // verificar si el usuario es Administrador
  isAdmin: (req, res, next) => {

    if (req.userData && req.userData.rol === 'admin') {
      next();
    } else {
      return res.status(403).json({ 
        mensaje: "Acceso prohibido." 
      });
    }
  }

};

export default userMiddleware;