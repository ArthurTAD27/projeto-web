const fs = require("fs");
const path = require("path");

function indiceeditarpost(req, res) {
  const user = req.session.usuario;
  const usuario = user.nome;  
  const { id } = req.params;
  if (!user || user.id !== 'admin1') return res.redirect('/');

  const { nome, descricao, variaveis } = req.body;

  if (!nome?.trim() || !descricao?.trim()) {
    return res.send(`
      <script>
        alert("Nome e descrição são obrigatórios.");
        window.history.back();
      </script>
    `);
  }

  // ⚠️ Protege contra tentativa de path traversal
  if (!id || id.includes("..")) {
    return res.status(400).send('ID inválido.');
  }

  const caminho = path.join(__dirname, '..', 'data', 'indices.json');

  try {
    const dados = JSON.parse(fs.readFileSync(caminho, 'utf8'));

    if (!dados.indices[id]) {
      return res.status(404).send('Índice não encontrado.');
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
      return res.send(`
        <script>
          alert("Adicione pelo menos uma variável com ID e nome.");
          window.history.back();
        </script>
      `);
    }

    // Atualiza o índice
    dados.indices[id] = {
      nome: nome.trim(),
      descricao: descricao.trim(),
      variaveis: novasVariaveis
    };

    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2), 'utf8');

    return res.send(`
      <script>
        alert("Índice atualizado com sucesso!");
        window.location.href = "/indices";
      </script>
    `);
  } catch (err) {
    console.error('Erro ao editar índice:', err);
    return res.status(500).send('Erro ao salvar as alterações do índice.');
  }
}

module.exports = indiceeditarpost;
