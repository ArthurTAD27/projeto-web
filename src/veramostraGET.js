const fs = require("fs");
const path = require("path");

function veramostraget(req, res) {  
    const user = req.session.usuario;
    const usuario = user.nome;
    const nomeArquivo = req.params.arquivo;
    if (!user || !nomeArquivo) {
        return res.status(403).send('Acesso negado.');
    }
    const caminho = path.join(__dirname,'..', 'data', usuario, nomeArquivo);
    if (!fs.existsSync(caminho)) return res.status(404).send('Amostra não encontrada');
    try {
        const conteudo = fs.readFileSync(caminho, 'utf8');
        const amostra = JSON.parse(conteudo);
        res.render('amostra_detalhes', { usuario, amostra });
  } catch (err) {
        console.error('Erro ao carregar a amostra:', err);
        res.status(500).send('Erro ao processar os dados da amostra.');
  }
}

module.exports = veramostraget;