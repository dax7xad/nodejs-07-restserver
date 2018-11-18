const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const roleValidos ={
    values:['ADMIN_ROLE','USER_ROLE'],
    message:'{VALUE} no es un rol válido'
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique:true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,        
        required: [true, 'la contraseña es obligatorio'],
        hide:true

    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: roleValidos
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

// la contraseña nunca se regresa en la respuesta
usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
};


usuarioSchema.plugin(uniqueValidator, {
    message:'{PATH} debe de ser único'
});

module.exports = mongoose.model('Usuario',usuarioSchema);