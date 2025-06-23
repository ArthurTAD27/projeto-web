const fs = require("fs");
const path = require("path");

function avaliarpost(req, res) { 
    const tipoIndice = req.body.indice;
    req.session.indiceSelecionado = tipoIndice;
    const caminho = path.join(__dirname,'..', 'data', 'indices.json');
    try {
        const indiceJson = JSON.parse(fs.readFileSync(caminho, 'utf8'));
        const indiceSelecionado = indiceJson.indices[tipoIndice];

        if (!indiceSelecionado) {
            return res.status(404).send('Índice não encontrado.');
        }

        res.render('formulario_indice', {
        usuario: req.session.usuario,
        indice: indiceSelecionado
        });     
  } catch (err) {
    console.error('Erro ao carregar ou processar índice:', err);
    res.status(500).send('Erro ao carregar os dados do índice.');
  }
}
module.exports = avaliarpost;