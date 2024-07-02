// CHAMADAS

// Chamada do Router
const router = require('express').Router()
// Chamada do banco de dados
const mongoose = require("mongoose")
// Chamada do Multer
const multer = require('multer');

// PASTAS

// Chamada da Pasta Helpers
const {eAdm} = require("../helpers/eAdm")
// Chamada da Pasta Uploads
const upload = multer({ dest: 'public/img/' })

// MODELS

// Require da Model de Categoria
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
// Require da Model de Medicamento
require("../models/Medicamento")
const Medicamento = mongoose.model("medicamentos")
// Require da Model de Fabricante
require("../models/Fabricante")
const Fabricante = mongoose.model("fabricantes")
// Require da Model de Fornecedor
require("../models/Fornecedor")
const Fornecedor = mongoose.model("fornecedores")
// Require da Model de Usuario
require("../models/Usuario");
const Usuario = mongoose.model("usuarios");

// Rota principal ADM 
router.get('/', eAdm, function (req, res) {
    res.send("Rota Principal ")
})

// ROTAS
// CATEGORIAS

// ROTA "CATEGORIAS" = DASHTBOAD 
router.get('/categorias', eAdm, async (req, res) => {
    try {
        const totalCategorias = await Categoria.countDocuments();
        const totalCategoriasMed = await Medicamento.countDocuments();
        const totalCategoriasFab = await Fabricante.countDocuments();
        const totalCategoriasFor = await Fornecedor.countDocuments();
        res.render('adm/categorias', { totalCategoriasMed, totalCategorias, totalCategoriasFab, totalCategoriasFor, erros: req.flash('error_msg') });
    } catch (err) {
        console.error('Erro ao carregar o dashboard:', err);
        req.flash('error_msg', 'Houve um erro ao carregar o dashboard.');
        res.redirect('/adm');
    }
});

// ROTA GET DE CADASTRO DAS CATEGORIAS
router.get('/categorias/add', eAdm, function (req, res) {
    res.render('adm/addcategorias')
})

// ROTA POST DE CADASTRO DAS CATEGORIAS
router.post('/categorias/nova', upload.single('img'), eAdm, function (req, res) {

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

// ROTA DE VISUALISAÇÃO DAS CATEGORIAS CADASTRADAS
router.get('/vercategorias' , eAdm, function (req, res) {
    Categoria.find().sort({ date: 'desc' }).lean().then((categorias) => {
        res.render("adm/vercategorias", { categorias: categorias })
    }).catch((err) => {
        req.flash("error_msg", "ERRROR")
        res.redirect("/adm")
    })
})

// ROTA GET DE EDIÇÃO DE CATEGORIAS
router.get("/categorias/edit/:id", eAdm, function (req, res) {
    Categoria.findOne({ _id: req.params.id }).lean().then(function (categoria) {
        res.render("adm/editcategorias", { categoria: categoria })
    }).catch((err) => {
        req.flash("error_msg", "esta categoria não existe")
        res.redirect("adm/categorias")
    })
})

// ROTA POST DE EDIÇÃO DAS CATEGORIAS
router.post("/categorias/edit", eAdm, function (req, res) {
    Categoria.findOne({ _id: req.body.id }).then((categoria) => {
        categoria.categoria = req.body.categoria
        categoria.descricao = req.body.descricao
        categoria.observacoesAdicionais = req.body.observacoesAdicionais

        categoria.save().then(() => {
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

// ROTA PARA DELETAR AS CATEGORIAS
router.post("/categorias/deletar", eAdm, function (req, res) {
    Categoria.deleteOne({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Categoria deletada com sucesso!")
        res.redirect("/adm/vercategorias")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar a categoria!")
        res.redirect("/adm/vercategorias")
    })
})

// ROTAS
// MEDICAMENTOS

// ROTA GET DE MEDICAMENTOS
router.get("/vermedicamentos", eAdm, function (req, res) {
    Medicamento.find().populate("categoria").populate("fabricante").populate("fornecedor").sort({ data: "desc" }).lean().then((medicamentos) => {
        res.render("adm/vermedicamentos", { medicamentos: medicamentos })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao mostrar os medicamentos!")
        res.redirect("/adm/addmedicamentos")
    })
})

// ROTA GET DE MEDICAMENTO = ADD
router.get("/medicamentos/add", eAdm, function (req, res) {
    Categoria.find().lean().then((categorias) => {
        Fabricante.find().lean().then((fabricantes) => {
            Fornecedor.find().lean().then((fornecedores) => {
                res.render("adm/addmedicamentos", { categorias: categorias, fabricantes: fabricantes,fornecedores: fornecedores
                });
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro ao carregar os fornecedores!");
                res.redirect("/adm/categorias");
            });
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao carregar os fabricantes!");
            res.redirect("/adm/categorias");
        });
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar as categorias!");
        res.redirect("/adm/categorias");
    });
});


// ROTA POST DE MEDICAMENTOS
router.post("/medicamentos/nova", eAdm, function (req, res) {
    var erros = []

    if (req.body.nomeGenerico == "0") {
        erros.push({ texto: "Nome invalido, resgistre um novo nome!" })
    }

    if (erros.length > 0) {
        res.render("adm/addmedicamentos", { erros: erros })
    } else {
        const novoMedicamento = {
            nomeGenerico: req.body.nomeGenerico,
            codigoBarras: req.body.codigoBarras,
            fabricante: req.body.fabricante,
            fornecedor: req.body.fornecedor,
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

// ROTA GET DE EDIÇÃO DE MEDICAMENTOS
router.get("/medicamentos/edit/:id", eAdm, function (req, res) {
    Medicamento.findOne({ _id: req.params.id }).lean().then((medicamentos) => {
        Categoria.find().lean().then((categorias) => {
            res.render("adm/editmedicamentos", { categorias: categorias, medicamentos: medicamentos })
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar as categorias!")
            res.redirect("/adm/categorias")
        })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulario de edição!")
        res.redirect("/adm/categorias")
    })
})

// ROTA POST DE EDIÇÃO DE MEDICAMENTOS
router.post("/medicamentos/edit", eAdm, function (req, res) {
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

// ROTA PARA DELETAR OS MEDICAMENTOS
router.post("/medicamentos/deletar", eAdm, function (req, res) {
    Medicamento.deleteOne({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Medicamento deletado com sucesso!")
        res.redirect("/adm/vermedicamentos")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar o medicamento!")
        res.redirect("/adm/vermedicamentos")
    })
})

// ROTAS
// FABRICANTE

// ROTA GET DE FABRICANTE
router.get("/verfabricante", eAdm, (req, res) => {
    Fabricante.find().sort({ data: "desc" }).lean().then((fabricantes) => {
        res.render("adm/verfabricante", { fabricantes: fabricantes });
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao mostrar os fabricantes!");
        res.redirect("/adm/addfabricante");
    });
});

// ROTA GET DE FABRICANTE = ADD
router.get("/fabricante/add", eAdm, (req, res) => {
    Categoria.find().lean().then(() => {
        res.render("adm/addfabricante");
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o form!");
        res.redirect("/adm/categorias");
    });
});

// ROTA POST PARA ADICIONAR OS FABRICANTES
router.post("/fabricante/nova", eAdm, (req, res) => {
    var erros = [];

    if (!req.body.nomeFabricante) {
        erros.push({ texto: "Nome invalido, registre um novo nome" });
    }

    if (erros.length > 0) {
        res.render("adm/addfabricante", { erros: erros });
    } else {
        const novoFabricante = {
            nomeFabricante: req.body.nomeFabricante,
            telefoneFabricante: req.body.telefoneFabricante,
            emailFabricante: req.body.emailFabricante
        };
        new Fabricante(novoFabricante).save().then(() => {
            req.flash("success_msg", "Fabricante adicionado com sucesso!");
            res.redirect("/adm/categorias");
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao adicionar o fabricante!");
            res.redirect("/adm/categorias");
        });
    }
});

// ROTA GET DE EDIÇÃO DE FABRICANTES
router.get("/fabricantes/edit/:id", eAdm, function (req, res) {
    Fabricante.findOne({ _id: req.params.id }).lean().then(function (fabricante) {
        res.render("adm/editfabricante", { fabricante: fabricante })
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria não existe")
        res.redirect("adm/categorias")
    })
})

// ROTA POST DE EDIÇÃO DE FABRICANTES
router.post("/fabricantes/edit", eAdm, function (req, res) {
    Fabricante.findOne({ _id: req.body.id }).then((fabricante) => {
            fabricante.nomeFabricante = req.body.nomeFabricante,
            fabricante.telefoneFabricante = req.body.telefoneFabricante,
            fabricante.emailFabricante = req.body.emailFabricante
            
        fabricante.save().then(() => {
            req.flash("success_msg", "Fabricante editado com sucesso!")
            res.redirect("/adm/verfabricante")
        }).catch((err) => {
            req.flash("error_msg", "error interno!")
            res.redirect("/adm/verfabricante")
        })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar o fabricante!")
        res.redirect("/adm/verfabricante")
    })
})

// ROTA PARA DELETAR OS FABRICANTES
router.post("/fabricantes/deletar", eAdm, function (req, res) {
    Fabricante.deleteOne({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Fabricante deletado com sucesso!")
        res.redirect("/adm/verfabricante")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar o fabricante!")
        res.redirect("/adm/verfabricante")
    })
})


// ROTAS
// FORNECEDOR

// ROTA GET DE FORNECEDOR
router.get("/verfornecedor", eAdm, (req, res) => {
    Fornecedor.find().sort({ data: "desc" }).lean().then((fornecedores) => {
        res.render("adm/verfornecedor", { fornecedores: fornecedores });
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao mostrar os fabricantes!");
        res.redirect("/adm/addfornecedor");
    });
});

// ROTA GET DE FORNECEDOR = ADD
router.get("/fornecedor/add", eAdm, (req, res) => {
    Categoria.find().lean().then(() => {
        res.render("adm/addfornecedor");
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o form!");
        res.redirect("/adm/categorias");
    });
});

// ROTA POST PARA ADICIONAR OS FORNECEDOR
router.post("/fornecedor/nova", eAdm, (req, res) => {
    var erros = [];

    if (!req.body.nomeFornecedor) {
        erros.push({ texto: "Nome invalido, registre um novo nome" });
    }

    if (erros.length > 0) {
        res.render("adm/addfornecedor", { erros: erros });
    } else {
        const novoFornecedor = {
            nomeFornecedor: req.body.nomeFornecedor,
            telefoneFornecedor: req.body.telefoneFornecedor,
            emailFornecedor: req.body.emailFornecedor
        };
        new Fornecedor(novoFornecedor).save().then(() => {
            req.flash("success_msg", "Fornecedor adicionado com sucesso!");
            res.redirect("/adm/categorias");
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao adicionar o fornecedor!");
            res.redirect("/adm/categorias");
        });
    }
});

// ROTA GET DE EDIÇÃO DE FORNECEDORES
router.get("/fornecedor/edit/:id", eAdm, function (req, res) {
    Fornecedor.findOne({ _id: req.params.id }).lean().then(function (fornecedores) {
        res.render("adm/editfornecedor", { fornecedores: fornecedores })
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria não existe")
        res.redirect("adm/categorias")
    })
})

// ROTA POST DE EDIÇÃO DE FORNECEDORES
router.post("/fornecedor/edit", eAdm, function (req, res) {
    Fornecedor.findOne({ _id: req.body.id }).then((fornecedores) => {
        fornecedores.nomeFornecedor = req.body.nomeFornecedor,
        fornecedores.telefoneFornecedor = req.body.telefoneFornecedor,
        fornecedores.emailFornecedor = req.body.emailFornecedor
            
        fornecedores.save().then(() => {
            req.flash("success_msg", "Fornecedor editado com sucesso!")
            res.redirect("/adm/verfornecedor")
        }).catch((err) => {
            req.flash("error_msg", "error interno!")
            res.redirect("/adm/verfornecedor")
        })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar o fornecedor!")
        res.redirect("/adm/verfornecedor")
    })
})

// ROTA PARA DELETAR OS FORNECEDORES
router.post("/fornecedor/deletar", eAdm, function (req, res) {
    Fornecedor.deleteOne({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Fornecedor deletado com sucesso!")
        res.redirect("/adm/verfornecedor")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar o fornecedor!")
        res.redirect("/adm/verfornecedor")
    })
})


// PERFIL

// Rota de perfil
router.get("/perfil", eAdm, function (req, res) {
    res.render("adm/perfil")
})

// EXPRTAÇÃO DO ROUTER = ADM
module.exports = router