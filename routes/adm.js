// Chamada do Router
const router = require('express').Router()
// Chamada do banco de dados
const mongoose = require ("mongoose")
// Require da Model de Categoria
require ("../models/Categoria")
// Chamando o exports do model
const Categoria = mongoose.model ("categorias")
// Chamada do Multer
const multer = require ('multer');
// Chamada da Pasta Uploads
const upload = multer ({ dest: 'public/img/' })
// Require da Model de Medicamento
require("../models/Medicamento")
// CHAMADA DO BANCO POSTAGEM 2.0
const Medicamento = mongoose.model("medicamentos")

// Rota Principal 
router.get('/', function (req, res) {
    res.send("Rota Principal ")
})
// Rota do Formulario = Adicionar os Remédios
router.get('/categorias/add', function (req, res) {
    res.render('adm/addcategorias')
})

// Rota de categorias | Dashtboard
router.get('/categorias', async (req, res) => {
    try {
        const totalCategorias = await Categoria.countDocuments();
        const totalCategoriasMed = await Medicamento.countDocuments();
        res.render('adm/categorias', { totalCategoriasMed, totalCategorias, erros: req.flash('error_msg') });
    } catch (err) {
        console.error('Erro ao carregar o dashboard:', err);
        req.flash('error_msg', 'Houve um erro ao carregar o dashboard.');
        res.redirect('/adm');
    }
});

// Rota de Formulario de cadastro de categorias
router.post('/categorias/nova', upload.single('img'), function (req, res) {

    var erros = [];

    if (!req.body.categoria) {
        erros.push({ texto: "Categoria Inválida!" })
    }

    if (!req.body.descricao) {
        erros.push({ texto: "Descricão Inválida!" })
    }

    if (erros.length > 0) {
        res.render("adm/addcategorias", { erros: erros })
    } 
    else {
        const novaCategoria = {
            categoria: req.body.categoria,
            descricao: req.body.descricao,
            observacoesAdicionais: req.body.observacoesAdicionais,
            img: req.file.filename,
        }
        new Categoria(novaCategoria).save().then(() => {
            console.log("Formulario enviado com Sucesso")
            req.flash("success_msg", "Categoria Cadastrada com Sucesso!")
            res.redirect("/adm/categorias")
        }).catch((err) => {
            console.log(`Erro ao cadastrar a categoria ${err}`)
        })
    }
})

// Rota de Visualização das Categorias Cadastradas
router.get('/vercategorias', function(req, res) {
    Categoria.find().sort({date: 'desc'}).lean().then((categorias) =>{
        res.render("adm/vercategorias", {categorias: categorias})
    }).catch((err) =>{
        req.flash("error_msg", "ERRROR")
        res.redirect("/adm")
    })
})

// Rota de edição de categoria
router.get("/categorias/edit/:id", function(req, res) {
    Categoria.findOne({_id: req.params.id}).lean().then(function(categoria){
        res.render("adm/editcategorias", {categoria: categoria})
    }).catch((err) =>{
        req.flash("error_msg", "esta categoria não existe")
        res.redirect("adm/categorias")
    })
})

// Rota post do formulario de edição
router.post("/categorias/edit", function(req, res) {
    Categoria.findOne({_id: req.body.id }).then((categoria) =>{
        categoria.categoria = req.body.categoria
        categoria.descricao = req.body.descricao
        categoria.observacoesAdicionais = req.body.observacoesAdicionais

        categoria.save().then(() =>{
            req.flash("success_msg", "Categoria editada com sucesso!")
            res.redirect("/adm/vercategorias")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar a edição!")
            res.redirect("/adm/vercategorias")
        })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar a categoria!")
        res.redirect("/adm/categorias")
    })
})

// Rota para deletar a categoria
router.post("/categorias/deletar", function(req, res) {
    Categoria.deleteOne({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Categoria deletada com sucesso!")
        res.redirect("/adm/categorias") 
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar a categoria!")
        res.redirect("/adm/categorias")
    })
})


// PARTE DOS MEDICAMENTOS

// ROTA GET DE MEDICAMENTOS
router.get("/vermedicamentos", function (req, res) {
    Medicamento.find().populate("categoria").sort({ data: "desc" }).lean().then((medicamentos) => {
        res.render("adm/vermedicamentos", { medicamentos: medicamentos })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao mostrar os medicamentos!")
        res.redirect("/adm/addmedicamentos")
    })
})

// ROTA GET DE MEDICAMENTO = ADD
router.get("/medicamentos/add", function(req, res) {
    Categoria.find().lean().then((categorias) => {
        res.render("adm/addmedicamentos", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o form!")
        res.redirect("/adm/addmedicamentos")
    })
})

// ROTA POST DE MEDICAMENTOS
router.post("/medicamentos/nova", function (req, res) {
    var erros = []

    if (req.body.categoria == "0") {
        erros.push({ texto: "Categoria invalida, resgistre uma categoria" })
    }

    if (erros.length > 0) {
        res.render("adm/addmedicamentos", { erros: erros })
    } else {
        const novoMedicamento = {
            nomeGenerico: req.body.nomeGenerico,
            codigoBarras: req.body.codigoBarras,
            // fabricante: req.body.fabricante,
            // fornecedor: req.body.fornecedor,
            precoCompra: req.body.precoCompra,
            precoVenda: req.body.precoVenda,
            observacoesAdicionais: req.body.observacoesAdicionais,
            categoria: req.body.categoria
        }
        new Medicamento(novoMedicamento).save().then(() => {
            req.flash("success_msg", "Medicamento adicionado com sucesso!")
            res.redirect("/adm/categorias")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao adicionar o medicamento!")
            res.redirect("/adm/categorias")
        })
    }
})

// ROTA DE EDIÇÃO DE POSTS
router.get("/medicamentos/edit/:id", function (req, res) {
    Medicamento.findOne({ _id: req.params.id}).lean().then((medicamentos) => {
        Categoria.find().lean().then((categorias) => {
            res.render("adm/editmedicamentos", {categorias: categorias, medicamentos: medicamentos})
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar as categorias!")
            res.redirect("/adm/categorias")
        })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulario de edição!")
        res.redirect("/adm/categorias")
    })
})

// ROTA POST DE EDIÇÃO DE POSTS
router.post("/medicamentos/edit", function (req, res) {
    Medicamento.findOne({ _id: req.body.id }).then((medicamentos) => {
        medicamentos.nomeGenerico = req.body.nomeGenerico,
        medicamentos.codigoBarras = req.body.codigoBarras,
        medicamentos.precoCompra = req.body.precoCompra,
        medicamentos.precoVenda = req.body.precoVenda,
        medicamentos.precoVenda = req.body.precoVenda,
        medicamentos.categoria = req.body.categoria

            medicamentos.save().then(() => {
                req.flash("success_msg", "Medicamento editado com sucesso!")
                res.redirect("/adm/vermedicamentos")
            }).catch((err) => {
                req.flash("error_msg", "error interno!")
                res.redirect("/adm/vermedicamentos")
            })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar a postagem!")
        console.log(err)
        res.redirect("/adm/vermedicamentos")
    })
})

// Rota para deletar os medicamentos
router.post("/medicamentos/deletar", function (req, res) {
    Medicamento.deleteOne({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Medicamento deletado com sucesso!")
        res.redirect("/adm/vermedicamentos")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar o medicamento!")
        res.redirect("/adm/vermedicamentos")
    })
})

// Rota de perfil
router.get("/perfil", function(req, res) {
    res.render("adm/perfil")
})


module.exports = router