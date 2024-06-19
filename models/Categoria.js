// Chamada do mongoose
const mongoose = require("mongoose")
// Chamada da variavel Schema
const Schema = mongoose.Schema;

const Categoria = new Schema({
    categoria: {
        type: String,
        required: true
    },
    descricao:{
        type: String,
        required: true
    },
    observacoesAdicionais:{
        type: String,
        required: true
    },
    img:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model("categorias", Categoria)