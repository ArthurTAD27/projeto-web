const fs = require("fs");
const path = require("path");

function indicesadminget(req, res) {
    const user = req.session.usuario;
    const usuario = user.nome;
    if (!user || user.id !== 'admin1') return res.redirect('/');
    const caminho = path.join(__dirname, '..','data', 'indices.json');
    try {
        const dados = JSON.parse(fs.readFileSync(caminho, 'utf8'));
        const indices = Object.entries(dados.indices).map(([id, indice]) => ({
        id,
        nome: indice.nome
        }));

        res.render('admin_indices', { usuario, indices });
    } catch (err) {
        console.error('Erro ao carregar índices:', err);
        res.status(500).send('Erro ao carregar os índices.');
    }
}

module.exports = indicesadminget;