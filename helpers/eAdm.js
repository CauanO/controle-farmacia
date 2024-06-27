// Config do controle de acesso de Administrador < Usuario
module.exports = {
    eAdm: function(req, res, next) {
        // Verifica se o usuário está autenticado
        if(req.isAuthenticated()) {
            // Verifica se o usuário possui permissão de administrador
            if(req.user.eAdm === 1) {
                return next();
            } else { //Caso não for
                req.flash("error_msg", "Permissão negada, voce não é um administrador");
                return res.redirect("/usuarios/login");
            }
        } else { //Caso não tiver logado
            req.flash("error_msg", "Você precisa estar logado para acessar esta página");
            return res.redirect("/usuarios/login");
        }
    }
}
