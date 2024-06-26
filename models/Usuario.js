// Chamada do mongoose
const mongoose = require("mongoose")
// Chamada da variavel Schema
const Schema = mongoose.Schema;

const Usuario = new Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    eAdm: {
        type: Number,
	    default: 0 // 1 é adm ou 0 e usuario comum  
    },
    senha: {
        type: String,
        required: true
    }
})

mongoose.model("usuarios", Usuario)