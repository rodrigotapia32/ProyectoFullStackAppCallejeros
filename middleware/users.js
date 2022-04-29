const jwt = require('jsonwebtoken');

module.exports = {
  // Middleware que valida el registro de un usuario
  validateRegister: (req, res, next) => {
    const { first_name, last_name, password, password2, phone, email } = req.body
    const errors = [];
    if (!first_name || !last_name || !password || !phone || !email) {
      errors.push({ message: "Por favor ingresa todos los datos" })
      res.status(400)
    }
    if (password.length <= 3) {
      errors.push({ message: "La contraseña debe tener mas de 3 caracteres" })
      res.status(400)
    }
    if (password != password2) {
      errors.push({ message: "La contraseña no coincide" })
      res.status(400)
    }
    if (errors.length > 0) {
      res.render('auth/register', { errors })
    //si no hay errores 
    }
    next()
  },

  isLoggedIn: (req, res, next) => {
    if (!req.session.token) return res.redirect('/auth/login');
    jwt.verify(req.session.token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.redirect('/auth/login');
      req.user = decoded.user;
      res.locals.user = req.user;
      next();
    });
  }
};