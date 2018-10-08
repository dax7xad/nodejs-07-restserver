const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let usuarioSquema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'la contraseña es obligatorio']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },

});

module.exports = mongoose.model('Usuario',usuarioSquema);