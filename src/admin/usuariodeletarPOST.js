const fs = require("fs");
const path = require("path");

function usuariodeletarpost(req, res) {
  const id = req.params.id;

  if (!id || id.includes("..")) {
    return res.status(400).json({ erro: "Usuário inválido." });
  }

  const pastaUsuario = path.join(__dirname, '..', '..', 'data', id);

  try {
    if (!fs.existsSync(pastaUsuario)) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    fs.rmSync(pastaUsuario, { recursive: true, force: true });

    return res.json({ mensagem: `Usuário '${id}' excluído com sucesso.` });
  } catch (err) {
    console.error("Erro ao excluir usuário:", err);
    return res.status(500).json({ erro: "Erro ao excluir o usuário." });
  }
}

module.exports = usuariodeletarpost;
