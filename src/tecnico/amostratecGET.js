const fs = require("fs");
const path = require("path");

function amostratecget(req, res) {
  const coletor = req.params.coletor;
  const arquivo = req.params.arquivo;

  if (coletor.includes('..') || arquivo.includes('..')) {
    return res.status(400).json({ erro: 'Parâmetros inválidos.' });
  }

  const caminho = path.join(__dirname,'..','..','data', coletor, arquivo);

  if (!fs.existsSync(caminho)) {
    return res.status(404).json({ erro: 'Amostra não encontrada.' });
  }

  try {
    const amostra = JSON.parse(fs.readFileSync(caminho, 'utf8'));

    if (amostra.status !== 'pendente') {
      return res.json({ erro: 'Esta amostra já foi analisada.' });
    }

    res.json({ coletor, arquivo, amostra });
  } catch (err) {
    console.error('Erro ao ler amostra:', err);
    res.status(500).json({ erro: 'Erro ao carregar a amostra.' });
  }
}
module.exports = amostratecget;