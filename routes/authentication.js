// Rutas para manipular registro, login y autorizacion
const router = require('express').Router();
const bcrypt = require('bcrypt');
const conexion = require('../database/db.js');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { isLoggedIn, validateRegister } = require('../middleware/users');

// Configuracion nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'desafiolatamprueba@gmail.com',
    pass: 'Alejandro32',
  },
})

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
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { first_name, last_name, password, phone, email } = req.body
    const mailOptions = {
      from: 'desafiolatamprueba@gmail.com',
      to: email,
      subject: 'Bienvenido a callejeros',
      html: `<h1>Bienvenido ${first_name} ${last_name}</h1> 
            <img src="https://cdn2.melodijolola.com/media/files/field/image/istock-1134106600.jpg" alt="">
            `
    }
    transporter.sendMail(mailOptions, (err, data) => {
      if (err) console.log(err)
      if (data) console.log(data)
    })
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
  } catch (error) {
    console.log(error)
  }
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

// Ruta que muestra un formulario para ditar un usuario
// http://localhost:3000/auth/edit 
router.get('/edit', isLoggedIn, async (req, res) => {
  const { id } = req.user;
  await conexion.query(`SELECT * FROM users WHERE id='${id}'`, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      const rows = result.rows[0]
      res.render('auth/edit', { rows })
    }
  })
})

// Ruta que recibe los datos para editar un usuario
// http://localhost:3000/auth/edit 
router.post('/edit', isLoggedIn, async (req, res) => {
  const errors = []
  const ok = []
  const id = req.user.id
  const { first_name, last_name, phone, email } = req.body
  try {
    if (!first_name || !last_name || !phone || !email) {
      errors.push({ message: "Debes ingresar los nuevos datos" })
      await conexion.query(`SELECT * FROM users WHERE id='${id}'`, (err, result) => {
        const rows = result.rows[0]
        res.render('auth/edit', { errors, rows })
      })
    } else {
      await conexion.query(`SELECT * FROM users WHERE email='${email}'`, async (err, result) => {
        const rows = result.rows[0]
        if(err){
          console.log(err)
        }else{
          if(result.rows[0]) {
            errors.push({message: "El correo ya existe"})
            res.render('auth/edit', { rows, errors })
          }else{
            await conexion.query(`UPDATE users SET first_name='${first_name}', 
            last_name='${last_name}', 
            phone='${phone}', 
            email='${email}'
            WHERE id='${id}'`)
            ok.push({ message: "Datos actualizados" })
            res.render('auth/profile', { ok })
          }
        }
      })
    }
  } catch (error) {
  }
})

// Ruta que elimina la cuenta de un usuario
// http://localhost:3000/auth/edit
 router.get('/delete/:id', async (req, res) => {
   const errors = []
   const id = req.params.id
   try {
     await conexion.query(`DELETE FROM users WHERE id='${id}'`, (err, result) => {
       if (err){
         console.log(err)
       }else{
        errors.push({ message: "Usuario eliminado" })
        res.render('auth/login', { errors })
       }
     })
   } catch (error) {
     console.log(error)
   }
 })

// Ruta que muestra un formulario para cambiar una password
// http://localhost:3000/auth/edit 
router.get('/password', isLoggedIn,  (req, res) => {
  res.render('auth/changePass')
})

// Ruta que recibe los datos para cambiar una password
// http://localhost:3000/auth/edit 
router.post('/password', isLoggedIn, (req, res) => {
  console.log(req.body)
  console.log(req.user)
  res.send('Archivos recibidos')
})

module.exports = router;