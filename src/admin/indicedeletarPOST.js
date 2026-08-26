const fs = require("fs");
const path = require("path");

function indicesdeletarpost(req, res) {
  const { id } = req.params;

  if (!id || id.includes("..")) {
    return res.status(400).json({ erro: 'ID inválido.' });
  }

  const caminho = path.join(__dirname,'..','..', 'data', 'indices.json');

  try {
    const dados = JSON.parse(fs.readFileSync(caminho, 'utf8'));

    if (!dados.indices[id]) {
      return res.status(404).json({ erro: 'Índice não encontrado.' });
    }

    delete dados.indices[id];

    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2), 'utf8');

    res.json({ sucesso: true, mensagem: `Índice '${id}' removido com sucesso.` });
  } catch (err) {
    console.error('Erro ao excluir índice:', err);
    res.status(500).json({ erro: 'Erro ao excluir o índice.' });
  }
}

module.exports = indicesdeletarpost;
