// Chamada do express
const express = require('express')
const app = express()
// Chamada do handlebars
const { engine } = require('express-handlebars');
// Chamada do body-parser
const bodyParser = require('body-parser')
// Chamada do Session
const session = require("express-session")
// Chamada do Flash = alerts
const flash = require("connect-flash")
// Chamada do Banco de Dados
const mongoose = require("mongoose")

// Config handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Config do body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Config do Session
app.use(session({
    secret: "cursodenode",
    resave: true,
    saveUninitialized: true
}))

// Config do Flash
app.use(flash())

// Config Banco de Dados
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/controleFarmacia").then(function() {
    console.log("Conexão = True")
}).catch((err) =>{
    console.log("Conexão = False")
})

// Criação das mensagens Alerts = Midware
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash("success_msg") //ESSE LOCALS É PARA A CRIAÇÃO DE UMA VAR GLOBAL
    res.locals.error_msg = req.flash("error_msg")
    next()
})

// Chamada da Pasta public
app.use(express.static('./public'));

// Chamada do Routes de ADM
const adm = require('./routes/adm')
app.use('/adm', adm) // Usando o arquivo adm.js 


// Servidor
app.listen(8081,function(req, res) {
    console.log("Servidor OK")
}) 