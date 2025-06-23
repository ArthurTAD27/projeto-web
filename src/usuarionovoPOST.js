const fs = require("fs");
const path = require("path");

function usuarionovopost(req, res) {
  const user = req.session.usuario;
  if (!user || user.id !== 'admin1') return res.redirect('/');

  const { nome, perfil } = req.body;

  if (!nome?.trim() || !['coletor', 'tecnico'].includes(perfil)) {
    return res.send(`
      <script>
        alert("Preencha o nome e selecione um perfil válido.");
        window.history.back();
      </script>
    `);
  }

  const id = perfil === 'coletor' ? 'coletor1' : 'tecnico1';
  const nomesanitizado = nome.trim();
  const dataDir = path.join(__dirname, '..', 'data');
  const pastaUsuario = path.join(dataDir, nomesanitizado);

  try {
    if (fs.existsSync(pastaUsuario)) {
      return res.send(`
        <script>
          alert("Já existe um usuário com o ID '${id}'.");
          window.history.back();
        </script>
      `);
    }

    fs.mkdirSync(pastaUsuario);

    const dados = {
      id,
      nome: nomesanitizado,
      perfil
    };

    fs.writeFileSync(
      path.join(pastaUsuario, 'dados.json'),
      JSON.stringify(dados, null, 2),
      'utf8'
    );

    return res.send(`
      <script>
        alert("Usuário criado com sucesso!");
        window.location.href = "/usuarios";
      </script>
    `);
  } catch (err) {
    console.error("Erro ao criar usuário:", err);
    return res.status(500).send("Erro ao criar o usuário.");
  }
}

module.exports = usuarionovopost;
