const fs = require("fs");
const path = require("path");

function indiceeditarget(req, res) {
    const user = req.session.usuario;
    const usuario = user.nome;
    const { id } = req.params;

    if (!user || user.id !== 'admin1') return res.redirect('/');

    const caminho = path.join(__dirname,'..' ,'data', 'indices.json');
    try {
        const dados = JSON.parse(fs.readFileSync(caminho, 'utf8'));
        const indice = dados.indices[id];
        if (!indice) return res.status(404).send('Índice não encontrado.');
        res.render('admin_indices_editar', {
        usuario,
        id,
        nome: indice.nome,
        descricao: indice.descricao,
        variaveis: indice.variaveis
        });
    } catch (err) {
        console.error('Erro ao carregar índice:', err);
        res.status(500).send('Erro ao carregar o índice.');
    }
}

module.exports = indiceeditarget;