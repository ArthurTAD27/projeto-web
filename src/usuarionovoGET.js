function usuarionovoget(req, res) { 
    const user = req.session.usuario;
    const usuario = user.nome;
    if (!user || user.id !== 'admin1') return res.redirect('/');
        res.render('admin_usuario_novo', { usuario});
}
module.exports = usuarionovoget;