const fs = require("fs");
const path = require("path");

function indiceeditarpost(req, res) {
  const { id } = req.params;
  const { nome, descricao, variaveis } = req.body;

  if (!nome?.trim() || !descricao?.trim()) {
    return res.status(400).json({ erro: "Nome e descrição são obrigatórios." });
  }

  if (!id || id.includes("..")) {
    return res.status(400).json({ erro: "ID inválido." });
  }

  const caminho = path.join(__dirname, '..', '..', 'data', 'indices.json');

  try {
    const dados = JSON.parse(fs.readFileSync(caminho, 'utf8'));

    if (!dados.indices[id]) {
      return res.status(404).json({ erro: "Índice não encontrado." });
    }

    const variaveisLista = Array.isArray(variaveis)
      ? variaveis
      : Object.values(variaveis || {});

    const novasVariaveis = variaveisLista.map(v => ({
      id: v.id?.trim(),
      nome: v.nome?.trim(),
      unidade: v.unidade?.trim() || ""
    })).filter(v => v.id && v.nome);

    if (novasVariaveis.length === 0) {
      return res.status(400).json({ erro: "Adicione pelo menos uma variável com ID e nome." });
    }

    dados.indices[id] = {
      nome: nome.trim(),
      descricao: descricao.trim(),
      variaveis: novasVariaveis
    };

    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2), 'utf8');

    return res.json({ mensagem: "Índice atualizado com sucesso!" });
  } catch (err) {
    console.error('Erro ao editar índice:', err);
    return res.status(500).json({ erro: "Erro ao salvar as alterações do índice." });
  }
}

module.exports = indiceeditarpost;
