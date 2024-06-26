const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require("../models/Usuario");
const Usuario = mongoose.model("usuarios");
const bcrypt = require("bcryptjs");
const passport = require("passport")

// Rota de cadastro
router.get("/cadastro", function (req, res) {
    res.render("usuarios/cadastro");
});

router.post("/cadastro/nova", function (req, res) {
    var erros = [];

    if (!req.body.nome) {
        erros.push({ texto: "Nome inválido" });
    }
    if (!req.body.email) {
        erros.push({ texto: "E-mail inválido" });
    }
    if (!req.body.senha) {
        erros.push({ texto: "Senha inválida" });
    }
    if (req.body.senha.length < 4) {
        erros.push({ texto: "Senha muito curta" });
    }
    if (req.body.senha != req.body.senha2) {
        erros.push({ texto: "Senhas diferentes!" });
    }
    if (erros.length > 0) {
        res.render("usuarios/cadastro", { erros: erros });
    } else {
        Usuario.findOne({ email: req.body.email }).lean().then((usuario) => {
            if (usuario) {
                req.flash("error_msg", "Já existe uma conta com esse email");
                res.redirect("/usuarios/cadastro");
            } else {
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email, 
                    senha: req.body.senha,
                    // eAdm: 1
                });
                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if (erro) {
                            req.flash("error_msg", "Houve um erro durante o salvamento do usuário");
                            res.redirect("/");
                        }
                        novoUsuario.senha = hash;

                        novoUsuario.save().then(() => {
                            req.flash("success_msg", "Usuário cadastrado com sucesso!");
                            res.redirect("/usuarios/cadastro");
                        }).catch((err) => {
                            req.flash("error_msg", "Houve um erro ao cadastrar o usuário!");
                            res.redirect("/usuarios/cadastro");
                        });
                    });
                });
            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno");
            res.redirect("/");
        });
    }
})

// Rota de login
router.get("/login",function (req, res) {
    res.render("usuarios/login")
})

router.post("/login", function(req, res, next) {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/usuarios/login",
        failureFlash: true
    })(req, res, next)
})

module.exports = router;
