exports.errorInsert = {
  alert:true,
  alertTitle: "Advertencia",
  alertMesagge: "Ingrese un usuario y password",
  alertIcon: 'warning',
  ruta: 'login'
}

exports.errorUserIncorrect = {
  alert:true,
  alertTitle: "Error",
  alertMesagge: "Usuario y/o password incorrectas",
  alertIcon: 'error',
  ruta: 'login'
}

exports.connectionOk = {
  alert:true,
  alertTitle: "Conexion exitosa",
  alertMesagge: "LOGIN CORRECTO!",
  alertIcon: 'success',
  showConfirmButton: false,
  timer: 800,
  ruta: 'profile'
}