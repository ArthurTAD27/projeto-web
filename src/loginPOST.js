const fs = require("fs");
const path = require("path");

function loginpost(req, res) {
  const { usuario, senha } = req.body;
  const dataDir = path.join(__dirname, '..', 'data');

  fs.readdir(dataDir, (err, pastas) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao acessar dados dos usuários' });
    }

    let usuarioValido = null;

    for (const pasta of pastas) {
      const userPath = path.join(dataDir, pasta, 'dados.json');

      if (fs.existsSync(userPath)) {
        const raw = fs.readFileSync(userPath, 'utf-8');
        const dados = JSON.parse(raw);

        if (dados.nome === usuario && dados.senha === senha) {
          usuarioValido = dados;
          break;
        }
      }
    }

    if (!usuarioValido) {
      return res.status(401).json({ erro: "Usuário ou senha inválidos" });
    }

    return res.status(200).json(usuarioValido);
  });
}

module.exports = loginpost;
