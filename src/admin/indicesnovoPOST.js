const fs = require("fs");
const path = require("path");

function indicesnovopost(req, res) {
   const { id, nome, descricao, variaveis } = req.body;

  if (!id?.trim() || !nome?.trim() || !descricao?.trim()) {
    return res.status(400).json({ erro: "Preencha todos os campos obrigatórios: ID, nome e descrição." });
  }

  if (!variaveis || Object.keys(variaveis).length === 0) {
    return res.status(400).json({ erro: "Crie pelo menos uma variável com ID e nome." });
  }

  const caminho = path.join(__dirname,'..','..', 'data', 'indices.json');

  try {
    const dados = JSON.parse(fs.readFileSync(caminho, 'utf8'));

    if (dados.indices[id]) {
      return res.status(400).json({ erro: "Já existe um índice com esse ID." });
    }

    const variaveisLista = Array.isArray(variaveis)
      ? variaveis
      : Object.values(variaveis || {});

    const listaVariaveis = variaveisLista.map(v => ({
      id: v.id?.trim(),
      nome: v.nome?.trim(),
      unidade: v.unidade?.trim() || ""
    })).filter(v => v.id && v.nome);

    if (listaVariaveis.length === 0) {
      return res.status(400).json({ erro: "Crie pelo menos uma variável com ID e nome." });
    }

    dados.indices[id] = {
      nome: nome.trim(),
      descricao: descricao.trim(),
      variaveis: listaVariaveis
    };

    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2), 'utf8');

    res.json({ sucesso: true, mensagem: "Índice criado com sucesso!" });
  } catch (err) {
    console.error('Erro ao salvar novo índice:', err);
    return res.status(500).json({ erro: 'Erro ao salvar o novo índice.' });
  }
}

module.exports = indicesnovopost;
