// Rutas para manipular callejeros
const router = require('express').Router();
const conexion = require('../database/db');
const { v4: uuidv4 } = require('uuid');


// Ruta para mostrar el formulario de registro de un callejero
//http://localhost:3000/report/add
router.get('/add', (req, res) => {
  res.render('posts/post')
})

// Ruta que permite agregar un callejero
// http://localhost:3000/report/add
router.post('/add', async (req, res) => {
  const errors = []
  try {
    const id = req.user.id
    const { address, description } = req.body;
    if (!address || !description || !req.files || !req.files.foto) {
      errors.push({ message: "Debes ingresar todos los datos" })
      res.render('posts/post', { errors })
    } else {
      const file = req.files.foto;
      const fotoUuid = uuidv4() + '.jpg'
      file.mv(`${__dirname}/../public/img/callejeros/${fotoUuid}`, (err) => {
        if (err) {
          console.log(err)
        } else {
          console.log("Archivo Subido con exito")
        }
      })
      await conexion.query(`INSERT INTO posts(photo, address, description, userId)
    VALUES($1, $2, $3, $4)`, [fotoUuid, address, description, id], (error, results) => {
        if (error) { console.log(error) }
      });
      res.redirect('/report')
    }
  } catch (error) {
    console.log(error)
  }
})

// Ruta que permite mostrar todos los callejeros reportados por id
// http://localhost:3000/report/
router.get('/', async (req, res) => {
  const results = await conexion.query(`SELECT * FROM posts WHERE userId='${req.user.id}'`);
  const posts = results.rows;
  res.render('posts/list', { posts });
})

// Ruta que permite eliminar un callejero
// http://localhost:3000/report/delete/:id
router.get('/delete/:id', async (req, res) => {
  const { id } = req.params
  await conexion.query(`DELETE FROM posts WHERE id='${id}'`)
  res.redirect('/report')
})

// Ruta que permite mostrar un posts para editar un callejero
// http://localhost:3000/report/edit/:id
router.get('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const results = await conexion.query(`SELECT * FROM posts WHERE id='${id}'`)
  const posts = results.rows
  res.render('posts/edit', { posts: posts[0] })
})

// Ruta que permite editar un post en base a su id
// http://localhost:3000/report/edit/:id
router.post('/edit/:id', async (req, res) => {
  const errors = []
  try {
    const { id } = req.params;
    const { address, description } = req.body;
    if (!address || !description || !req.files || !req.files.foto) {
      errors.push({ message: "Debes ingresar todos los datos"})
      const results = await conexion.query(`SELECT * FROM posts WHERE id='${id}'`)
      const posts = results.rows
      res.render('posts/edit', { errors, posts: posts[0] })
    }else{
      const file = req.files.foto;
      const fotoUuid = uuidv4() + '.jpg'
      file.mv(`${__dirname}/../public/img/callejeros/${fotoUuid}`, (err) => {
        if (err) {
          console.log(err)
        } else {
          console.log("Archivo Subido con exito")
        }
      })
      await conexion.query(`UPDATE posts SET photo='${fotoUuid}', address='${address}', description='${description}' 
      WHERE id='${id}'`)
      res.redirect('/report')
    }
  } catch (error) {
    console.log(error)
  }
})


module.exports = router;