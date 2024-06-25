// Chamada do mongoose
const mongoose = require("mongoose");
// Chamada da variavel Schema
const Schema = mongoose.Schema;

const Medicamento = new Schema({
    nomeGenerico: {
        type: String,
    },
    codigoBarras: {
        type: String,
    },
    fabricante: {
        type: Schema.Types.ObjectId,
        ref: "fabricantes",
    },
    fornecedor: {
        type: Schema.Types.ObjectId,
        ref: "fornecedores",
    },
    precoCompra: {
        type: Number,
        required: true
    },
    precoVenda: {
        type: Number,
        required: true
    },
    observacoesAdicionais: {
        type: String,
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: "categorias",
        required: true
    },
    data: {
        type: Date,
        default: Date.now
    }
});

// Registrando o modelo no mongoose
mongoose.model("medicamentos", Medicamento);
