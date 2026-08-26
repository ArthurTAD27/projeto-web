const fs = require("fs");
const path = require("path");

function usuarioeditarget(req, res) {
  const nome = req.params.nome;

  if (!nome || nome.includes("..")) {
    return res.status(400).json({ erro: "Usuário inválido." });
  }

  const caminhoJson = path.join(__dirname, '..', '..', 'data', nome, 'dados.json');

  fs.readFile(caminhoJson, 'utf8', (err, conteudo) => {
    if (err) {
      console.error("Erro ao ler dados:", err);
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    try {
      const usuario = JSON.parse(conteudo);
      return res.json(usuario);
    } catch (parseErr) {
      console.error("Erro ao parsear dados:", parseErr);
      return res.status(500).json({ erro: "Erro ao processar os dados do usuário." });
    }
  });
}

module.exports = usuarioeditarget;
