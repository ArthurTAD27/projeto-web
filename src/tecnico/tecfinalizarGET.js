function tecfinalizarget(req, res) {
    const user = req.session.usuario;
    if (!user || user.id !== 'tecnico1') return res.redirect('/');
    const usuario = user.nome;
    const {coletor, arquivo} = req.params;
    const { escore_soma, escore_produto, variaveis } = req.session.amostraAnalise || {};
    if (!escore_soma || !escore_produto || !variaveis) {
        return res.status(400).send('Dados da análise não encontrados.');
    }
    res.render('tecnico_finalizar', {
        usuario,
        escore_soma,
        escore_produto,
        voltarPara: `/tecnico/amostra/${coletor}/${arquivo}`        
    });
}

module.exports = tecfinalizarget;