const fs = require("fs");
const path = require("path");

function usuariodeletarpost(req, res) {
  const user = req.session.usuario;
  const usuario = user.name;
  const id = req.params.id;

  if (!user || user.id !== 'admin1') return res.redirect('/');

  if (!id || id.includes("..")) {
    return res.status(400).send('ID inválido.');
  }

  const pastaUsuario = path.join(__dirname, '..', 'data', id);

  try {
    if (!fs.existsSync(pastaUsuario)) {
      return res.status(404).send('Usuário não encontrado.');
    }

    // ⚠️ Apaga toda a pasta do usuário
    fs.rmSync(pastaUsuario, { recursive: true, force: true });

    return res.send(`
      <script>
        alert("Usuário '${id}' excluído com sucesso.");
        window.location.href = "/usuarios";
      </script>
    `);
  } catch (err) {
    console.error('Erro ao excluir usuário:', err);
    return res.status(500).send('Erro ao excluir o usuário.');
  }
}

module.exports = usuariodeletarpost;
