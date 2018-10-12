const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const app = express();

app.get('/usuario', function (req, res) {
    res.json('get Usuario');
});

app.post('/usuario', function (req, res) {
    const body = req.body;

    const usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    // Intentando guardar los datos
    usuario.save((err, usuarioDB) => {

        // Respuesta del callback que ocurrio un error
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // Respuesta que todo salio exitoso
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.put('/usuario/:id', function (req, res) {
    const id = req.params.id;
    const body = _.pick(req.body,['nombre','img','role','estado'])


    Usuario.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.delete('/usuario', function (req, res) {
    res.json('delete Usuario');
});

module.exports = app;