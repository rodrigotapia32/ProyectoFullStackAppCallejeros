const { Client } = require('pg');
require('dotenv').config({path:'./env/.env'})

const connectionData = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
}

const conexion = new Client(connectionData)

conexion.connect((error) => {
    if(error){
        console.log("El error de conexion es: " + error)
        return
    }
    console.log("Conectado a la base de datos!")
})

module.exports = conexion