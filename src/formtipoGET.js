const fs = require("fs");
const path = require("path");

function formtipoget(req, res) {    
    const user = req.session.usuario;
    const usuario = user.nome;
    if (!user || user.id !== 'coletor1') return res.redirect('/');
    const indicePath = path.join(__dirname,'..', 'data', 'indices.json');
    try {
        const indiceJson = JSON.parse(fs.readFileSync(indicePath, 'utf8'));
        res.render('formtipo', { usuario, indices: indiceJson.indices });
    } catch (err) {
        console.error('Erro ao carregar índices:', err);
        res.status(500).send('Erro ao carregar os índices.');
    }
}

module.exports = formtipoget;