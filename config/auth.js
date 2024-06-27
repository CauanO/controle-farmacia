// Chamada da estrategia do passport
const localStrategy = require("passport-local").Strategy;
// Chamada do mongooser
const mongoose = require("mongoose");
// Chamada da biblioteca da criptografia da senha
const bcrypt = require("bcryptjs");

// Model de Usuario
require("../models/Usuario");
// Variavel da model
const Usuario = mongoose.model("usuarios");

// Config passport
module.exports = function (passport) {
    passport.use(new localStrategy({ usernameField: 'email', passwordField: 'senha' }, (email, senha, done) => {
        Usuario.findOne({ email: email }).then((usuario) => {
            if (!usuario) {
                return done(null, false, { message: "Esta conta não existe" });
            }
            // Config do bcrypt
            bcrypt.compare(senha, usuario.senha, (erro, certo) => {
                if (certo) {
                    return done(null, usuario);
                } else {
                    return done(null, false, { message: "Senha incorreta" });
                }
            });
        }).catch((err) => {
            return done(err);
        });
    }));
    
    passport.serializeUser((usuario, done) => {
        done(null, usuario.id);
    });

    passport.deserializeUser((id, done) => {
        Usuario.findById(id).then((usuario) => {
            done(null, usuario);
        }).catch((err) => {
            done(err, null);
        });
    });
};
