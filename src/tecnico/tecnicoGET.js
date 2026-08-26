function tecnicoget(req, res) {    
    const user = req.session.usuario;
    if (!user || user.id !== 'tecnico1') return res.redirect('/');
    const usuario = user.nome;
        res.render('tecnico',{usuario});
}

module.exports = tecnicoget;