module.exports = {
    eAdm: function(req, res, next) {
        // Verifica se o usuário está autenticado
        if(req.isAuthenticated()) {
            // Verifica se o usuário possui permissão de administrador
            if(req.user.eAdm === 1) {
                return next();
            } else {
                req.flash("error_msg", "Permissão negada");
                return res.redirect("/");
            }
        } else {
            req.flash("error_msg", "Você precisa estar logado para acessar esta página");
            return res.redirect("/usuarios/login");
        }
    }
}
