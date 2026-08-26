const fs = require("fs");
const path = require("path");

function apiIndicesGET(req, res) {
  const caminho = path.join(__dirname, '..', '..', 'data', 'indices.json');

  if (!fs.existsSync(caminho)) {
    return res.status(404).json({ erro: 'Arquivo de índices não encontrado.' });
  }

  try {
    const dados = JSON.parse(fs.readFileSync(caminho, 'utf8'));
    const indices = Object.entries(dados.indices).map(([id, indice]) => ({
      id,
      nome: indice.nome
    }));

    res.json({ indices });
  } catch (err) {
    console.error('Erro ao carregar índices:', err);
    res.status(500).json({ erro: 'Erro ao carregar os índices.' });
  }
}

module.exports = apiIndicesGET;
