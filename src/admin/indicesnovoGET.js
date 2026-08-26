function indicesnovoget(req, res) {
    const user = req.session.usuario;
    if (!user || user.id !== 'admin1') return res.redirect('/');
    const usuario = user.nome;
    res.render('admin_indices_novo', { usuario });
}

module.exports = indicesnovoget;