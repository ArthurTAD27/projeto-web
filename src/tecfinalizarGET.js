function tecfinalizarget(req, res) {
    const user = req.session.usuario;
    const usuario = user.nome;
    if (!user || user.id !== 'tecnico1') return res.redirect('/');
    const { escore_soma, escore_produto, variaveis } = req.session.amostraAnalise || {};
    if (!escore_soma || !escore_produto || !variaveis) {
        return res.status(400).send('Dados da análise não encontrados.');
    }
    res.render('tecnico_finalizar', {
        usuario,
        escore_soma,
        escore_produto
    });
}

module.exports = tecfinalizarget;