function coletorget(req, res) {    
    const user = req.session.usuario;
    if (!user || user.id !== 'coletor1') return res.redirect('/');
    const usuario = user.nome;
        res.render('coletor', { usuario });
}

module.exports = coletorget;