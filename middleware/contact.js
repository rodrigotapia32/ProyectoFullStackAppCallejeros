module.exports = {
  // Middleware que valida el ingreso de datos de contacto
  validateRegisterContact: (req, res, next) => {
    const { first_name, email, subject, message } = req.body;
    const errors = [];
    if (!first_name || !email || !subject || !message) {
      errors.push({ message: "Por favor ingresa todos los datos" })
      res.render('contact', { errors })
    }
    //si no hay errores
    next()
  }
};