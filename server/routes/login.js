const express = require("express");

const bcrypt = require("bcryptjs");

const jwt = require('jsonwebtoken');

const {
    OAuth2Client
} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require("../models/usuario");

const app = express();

app.post("/login", (req, res) => {

    let body = req.body;

    Usuario.findOne({
        email: body.email
    }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }

        const token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, {
            expiresIn: process.env.CADUDAD_TOKEN
        });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });

});


// Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // console.log(payload.name);
    // console.log(payload.email);
    // console.log(payload.picture);
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
        password: ':)'
    };
}


app.post("/google", async (req, res) => {

    let idtoken = req.body.idtoken;

    let googleuser = await verify(idtoken)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });

    // Verificar que no exista el usuario en la base de datos
    Usuario.findOne({
        email: googleuser.email
    }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Usuario existente
        if (usuarioDB) {
            // Usuario que se registro con una autenticacion normal e intenta ahora registrar con google
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar la autenticacion por normal'
                    }
                });
                // El usuario ya existe en la base de datos con autenticacion de google   
            } else {
                const token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {
                    expiresIn: process.env.CADUDAD_TOKEN
                });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            }
        } else {
            // Si el usuario no existe en la base de datos
            let usuario = new Usuario();

            usuario.nombre = googleuser.nombre;
            usuario.email = googleuser.email;
            usuario.img = googleuser.img;
            usuario.google = true;
            usuario.password = googleuser.password;

            usuario.save((err, usuarioDB) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                const token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {
                    expiresIn: process.env.CADUDAD_TOKEN
                });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            });
        }

    });

});

module.exports = app;