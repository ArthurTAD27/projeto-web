function indicesnovoget(req, res) {
    const user = req.session.usuario;
    const usuario = user.nome;
    if (!user || user.id !== 'admin1') return res.redirect('/');
    res.render('admin_indices_novo', { usuario });
}

module.exports = indicesnovoget;