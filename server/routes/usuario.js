const express = require('express');
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
        password: body.password,
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
            ok:true,
            usuario:usuarioDB
        });
    });
});

app.put('/usuario/:id', function (req, res) {
    const id = req.params.id;

    res.json({
        id,
    });
});

app.delete('/usuario', function (req, res) {
    res.json('delete Usuario');
});

module.exports = app;