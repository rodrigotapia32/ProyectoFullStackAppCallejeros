const conexion = require('../database/db.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { errorInsert, errorUserIncorrect, connectionOk } = require('../sweetalert.js')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'desafiolatamprueba@gmail.com',
    pass: 'Alejandro32',
  },
})

exports.registerUser = async (req, res) => {
  try {
    const { user, pass, first_name, last_name, phone, email } = req.body;
    const passHash = await bcrypt.hash(pass, 8);
    conexion.query(`INSERT INTO users(usuario, pass, first_name, last_name, phone, email) 
        VALUES ($1, $2, $3, $4, $5, $6)`, [user, passHash, first_name, last_name, phone, email], (error, results) => {
      if (error) { console.log(error) }
    })
    // const mailOptions = {
    //   from: 'desafiolatamprueba@gmail.com',
    //   to: email,
    //   subject: 'Bienvenido a callejeros',
    //   html: `<h1>Bienvenido ${first_name} ${last_name}</h1> 
    //         <img src="https://cdn2.melodijolola.com/media/files/field/image/istock-1134106600.jpg" alt="">
    //         `
    // }
    // transporter.sendMail(mailOptions, (err, data) => {
    //   if (err) console.log(err)
    //   if (data) console.log(data)
    // })
    res.redirect('/login')
  } catch (error) {
    console.log("Error al registrar usuario ", error)
  }
}

exports.login = async (req, res) => {
  try {
    const { user, pass } = req.body;
    // Primer filtro del login, si el usuario no ingresa datos, enviar SA error
    if (!user || !pass) {
      res.render('login', errorInsert)
    } else {
      conexion.query(`SELECT * FROM users WHERE usuario='${user}'`, async (error, results) => {
        // Segundo filtro del login, si el usuario no esta en la base de datos, enviar SA error
        if (results.rows.length == 0 || !(await bcrypt.compare(pass, results.rows[0].pass))) {
          res.render('login', errorUserIncorrect)
        } else {
          //Inicio de session OK
          const id = results.rows[0].id;
          const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRESIN
          })
          console.log(`TOKEN ${token} generado para el usuario ${id} ${user}`)
          const rows = results.rows
          console.log(rows)
          res.render('profile', { rows })
        }
      })
    }
  }
  catch (e) {
    console.error(e);
  }
};

