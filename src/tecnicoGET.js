function tecnicoget(req, res) {    
    const user = req.session.usuario;
    const usuario = user.nome;
    if (!user || user.id !== 'tecnico1') return res.redirect('/');
        res.render('tecnico',{usuario});
}

module.exports = tecnicoget;