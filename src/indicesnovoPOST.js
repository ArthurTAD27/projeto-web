const fs = require("fs");
const path = require("path");

function indicesnovopost(req, res) {
  const user = req.session.usuario;
  const usuario = user?.nome;

  if (!user || user.id !== 'admin1') return res.redirect('/');

  const { id, nome, descricao, variaveis } = req.body;

  // Verificação dos campos obrigatórios
  if (!id?.trim() || !nome?.trim() || !descricao?.trim()) {
    return res.send(`
      <script>
        alert("Preencha todos os campos obrigatórios: ID, nome e descrição.");
        window.history.back();
      </script>
    `);
  }

  // 🚫 Se não tem nenhuma variável cadastrada
  if (!variaveis || Object.keys(variaveis).length === 0) {
    return res.send(`
      <script>
        alert("Crie pelo menos uma variável com ID e nome.");
        window.history.back();
      </script>
    `);
  }

  const caminho = path.join(__dirname, '..', 'data', 'indices.json');

  try {
    const dados = JSON.parse(fs.readFileSync(caminho, 'utf8'));

    if (dados.indices[id]) {
      return res.send(`
        <script>
          alert("Já existe um índice com esse ID.");
          window.history.back();
        </script>
      `);
    }

    // Normalizar para array (caso venha como objeto)
    const variaveisLista = Array.isArray(variaveis)
      ? variaveis
      : Object.values(variaveis || {});

    // Validar variáveis com id e nome obrigatórios
    const listaVariaveis = variaveisLista.map(v => ({
      id: v.id?.trim(),
      nome: v.nome?.trim(),
      unidade: v.unidade?.trim() || ""
    })).filter(v => v.id && v.nome);

    if (listaVariaveis.length === 0) {
      return res.send(`
        <script>
          alert("Crie pelo menos uma variável com ID e nome.");
          window.history.back();
        </script>
      `);
    }

    dados.indices[id] = {
      nome: nome.trim(),
      descricao: descricao.trim(),
      variaveis: listaVariaveis
    };

    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2), 'utf8');

    return res.send(`
      <script>
        alert("Índice criado com sucesso!");
        window.location.href = "/indices";
      </script>
    `);
  } catch (err) {
    console.error('Erro ao salvar novo índice:', err);
    return res.status(500).send('Erro ao salvar o novo índice.');
  }
}

module.exports = indicesnovopost;
