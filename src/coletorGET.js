function coletorget(req, res) {    
    const user = req.session.usuario;
    const usuario = user.nome;
    if (!user || user.id !== 'coletor1') return res.redirect('/');
        res.render('coletor', { usuario });
}

module.exports = coletorget;