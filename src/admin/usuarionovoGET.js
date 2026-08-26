function usuarionovoget(req, res) { 
    const user = req.session.usuario;
    if (!user || user.id !== 'admin1') return res.redirect('/');
    const usuario = user.nome;
        res.render('admin_usuario_novo', { usuario});
}
module.exports = usuarionovoget;