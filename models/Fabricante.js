// CHAMADA DO MONGOOSE
const mongoose = require("mongoose");
// CHAMADA DA VARIAVEL DO MONGOOSE
const Schema = mongoose.Schema;

const Fabricante = new Schema({
    nomeFabricante: {
        type: String,
        required: true
    },
    telefoneFabricante: {
        type: String,
        required: true
    },
    emailFabricante: {
        type: String,
        required: true
    }
});

mongoose.model("fabricantes", Fabricante);
