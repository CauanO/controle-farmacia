// CHAMADA DO MONGOOSE
const mongoose = require("mongoose");
// CHAMADA DA VARIAVEL DO MONGOOSE
const Schema = mongoose.Schema;

const Fornecedor = new Schema({
    nomeFornecedor: {
        type: String,
        required: true
    },
    telefoneFornecedor: {
        type: String,
        required: true
    },
    emailFornecedor: {
        type: String,
        required: true
    }
});

mongoose.model("fornecedores", Fornecedor);
