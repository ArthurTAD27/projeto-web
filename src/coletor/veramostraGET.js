const fs = require("fs");
const path = require("path");

function veramostraget(req, res) {  
    const nomeArquivo = req.params.arquivo;
    const usuario = req.headers['x-usuario']; 

    if (!usuario || !nomeArquivo) {
        return res.status(400).json({ erro: 'Usuário ou arquivo não informado' });
    }

    const caminho = path.join(__dirname,'..','..', 'data', usuario, nomeArquivo);
    if (!fs.existsSync(caminho)) {
        return res.status(404).json({ erro: 'Amostra não encontrada' });
    }

    try {
        const conteudo = fs.readFileSync(caminho, 'utf8');
        const amostra = JSON.parse(conteudo);
        res.json({ amostra });
    } catch (err) {
        console.error('Erro ao ler a amostra:', err);
        res.status(500).json({ erro: 'Erro ao processar os dados da amostra' });
    }
}
module.exports = veramostraget;