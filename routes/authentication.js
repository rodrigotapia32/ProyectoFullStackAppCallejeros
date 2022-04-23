const router = require('express').Router();
const bcrypt = require('bcrypt');
const conexion = require('../database/db.js');
const flash = require('connect-flash');
const jwt = require('jsonwebtoken');

const userMiddleware = require('../middleware/users');
const { isLoggedIn } = require('../middleware/users');

router.use(flash())

router.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next()
})

// RUTAS

// Ruta que muestra el formulario de registro para un usuario
// http://localhost:3000/auth/register
router.get('/register', (req, res) => {
  res.render('auth/register');
})

// Ruta que muestra el login
// http://localhost:3000/auth/login
router.get('/login', (req, res) => {
  res.render('auth/login')
})

// Ruta que recibe los datos del formulario e inserta un usuario en la bd
// http://localhost:3000/auth/register 
router.post('/register', userMiddleware.validateRegister, async (req, res) => {
  const { first_name, last_name, password, phone, email } = req.body
  const errors = [];
  const hashPassword = await bcrypt.hash(password, 8);
  //Consulta para saber si el usuario esta registrado por email
  conexion.query(
    `SELECT * FROM users
      WHERE email = $1`, [email], (err, results) => {
    if (err) {
      throw err
    }
    if (results.rows.length > 0) {
      errors.push({ message: "El email ingresado ya esta registrado" })
      res.render('auth/register', { errors })
      //si el usuario no esta registrado
    } else {
      conexion.query(
        `INSERT INTO users (first_name, last_name, password, phone, email)
            VALUES ($1, $2, $3, $4, $5)`, [first_name, last_name, hashPassword, phone, email], (err, results) => {
        if (err) {
          throw err
        }
        req.session.message = {
          type: 'info',
          intro: 'Bienvenido',
          message: 'ya estas registrado, ahora puedes Iniciar sesión'
        }
        res.redirect('/auth/login')
      }
      )
    }
  }
  )
}
)

// Ruta que recibe los datos de inicio de session
// http://localhost:3000/auth/login
router.post('/login', async (req, res) => {
  // Validacion ingreso de datos
  const errors = [];
  const { email, password } = req.body;
  // si no ingreso datos
  if (!email || !password) {
    errors.push({ message: "Por favor ingresar Email y Password" })
    res.render('auth/login', { errors })
  } else {
    await conexion.query(
      // Si el usuario no esta en la base de datos
      `SELECT * FROM users WHERE email='${email}'`, async (error, result) => {
        if (result.rows.length === 0 || !(await bcrypt.compare(password, result.rows[0].password))) {
          errors.push({ message: "Usuario y/o password incorrectas" })
          res.render('auth/login', { errors })
        } else {
          // Si el usuario esta en la base de datos
          const user = {
            name: result.rows[0].first_name,
            email: result.rows[0].email,
            id: result.rows[0].id
          }
          const id = result.rows[0].id;
          const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "1h" })
          // console.log(`TOKEN ${token} generado para el usuario ${id} ${result.rows[0].first_name}`)
          req.session.token = token;
          req.session.save();
          res.render('auth/profile', { user })
        }
      }
    )
  }
});

// Ruta que muestra el perfil
// http://localhost:3000/auth/login 
router.get('/profile', isLoggedIn, (req, res) => {
  res.render('auth/profile')
})

// LOGOUT
router.get('/logout', isLoggedIn, (req, res) => {
req.session.destroy();
res.redirect('/auth/login');
})

// Editar perfil
router.get('/edit', (req, res) => {
  res.send('editar datos')
})

module.exports = router;