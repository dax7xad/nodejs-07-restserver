const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { verificaToken  } = require('../middlewares/autenticacion');

const app = express();

app.get('/usuario', verificaToken,  (req, res) => {

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    desde = Number(desde);
    limite = Number(limite);
    Usuario.find({ estado:true }, 'nombre email role google img estado')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            // en caso que el callback devuelva un error
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }


            Usuario.count({ estado:true }, (err, conteo) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                // En caso exitoso
                return res.json({
                    ok: true,
                    usuarios,
                    total: conteo
                });
            });
        });

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
    const body = _.pick(req.body, ['nombre', 'img', 'role', 'estado']);


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

app.delete('/usuario/:id', function (req, res) {
    let id = req.params.id;
    const cambiaEstado = {
        estado:false
    };
    // Usuario.findByIdAndRemove(id , (err, usuarioBorrado ) => {
    Usuario.findByIdAndUpdate(id, cambiaEstado,{ new: true },  (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        return res.json({
            ok: true,
            usuario: usuarioBorrado

        });

    });

});

module.exports = app;