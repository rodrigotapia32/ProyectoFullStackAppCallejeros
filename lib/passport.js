// const passport = require('passport');
// const conexion = require('../database/db');
// const LocalStrategy = require('passport-local').Strategy;


// passport.use('local.register', new LocalStrategy({
//   usernameField: 'email',
//   passwordField: 'password',
//   passReqToCallback: true
// }, async (req, email, password, done) => {
//   const { first_name, last_name, phone } = req.body
//   conexion.query(
//     `INSERT INTO users (first_name, last_name, password, phone, email)
//     VALUES ($1, $2, $3, $4, $5)`, [first_name, last_name, password, phone, email], (err, results) => {
//       if (err){
//         throw err
//       }
//       console.log(results)
//     }
//   )
//   console.log(req.body.id)
// }))
