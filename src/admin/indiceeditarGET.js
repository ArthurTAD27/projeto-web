const fs = require("fs");
const path = require("path");

function indiceeditarget(req, res) {
  const { id } = req.params;

  if (!id || id.includes("..")) {
    return res.status(400).json({ erro: 'ID inválido.' });
  }

  const caminho = path.join(__dirname,'..','..', 'data', 'indices.json');

  try {
    const dados = JSON.parse(fs.readFileSync(caminho, 'utf8'));
    const indice = dados.indices[id];

    if (!indice) {
      return res.status(404).json({ erro: 'Índice não encontrado.' });
    }

    res.json({
      id,
      nome: indice.nome,
      descricao: indice.descricao,
      variaveis: indice.variaveis
    });
  } catch (err) {
    console.error('Erro ao buscar índice:', err);
    res.status(500).json({ erro: 'Erro ao carregar o índice.' });
  }
}

module.exports = indiceeditarget;