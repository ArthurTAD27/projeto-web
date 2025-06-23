const fs = require("fs");
const path = require("path");

function indicesdeletarpost(req, res) {
  const user = req.session.usuario;
  const usuario = user.nome
  const id = req.params.id;

  if (!user || user.id !== 'admin1') return res.redirect('/');

  if (!id || id.includes("..")) {
    return res.status(400).send('ID inválido.');
  }

  const caminho = path.join(__dirname, '..', 'data', 'indices.json');

  try {
    const dados = JSON.parse(fs.readFileSync(caminho, 'utf8'));

    if (!dados.indices[id]) {
      return res.status(404).send('Índice não encontrado.');
    }

    delete dados.indices[id];

    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2), 'utf8');

    return res.send(`
      <script>
        alert("Índice '${id}' removido com sucesso.");
        window.location.href = "/indices";
      </script>
    `);
  } catch (err) {
    console.error('Erro ao excluir índice:', err);
    return res.status(500).send('Erro ao excluir o índice.');
  }
}

module.exports = indicesdeletarpost;
