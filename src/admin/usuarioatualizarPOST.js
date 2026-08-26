const fs = require("fs");
const path = require("path");

function usuarioatualizarpost(req, res) {
  const nomer = req.params.nome;
  if (!nomer || nomer.includes("..")) {
    return res.status(400).json({ erro: "Usuário inválido." });
  }

  const { nome, perfil, senha } = req.body;

  if (!nome || !perfil || !senha) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
  }

  const idGerado = perfil === "tecnico" ? "tecnico1" :
                   perfil === "coletor" ? "coletor1" : "admin1";

  const baseDir = path.join(__dirname, '..', '..', 'data');
  const pastaAntiga = path.join(baseDir, nomer);
  const pastaNova = path.join(baseDir, nome);

  const caminhoJsonAntigo = path.join(pastaAntiga, 'dados.json');

  if (!fs.existsSync(caminhoJsonAntigo)) {
    return res.status(404).json({ erro: "Usuário não encontrado." });
  }

  const novosDados = {
    id: idGerado,
    nome,
    senha,
    perfil
  };

  try {
    if (nomer !== nome && fs.existsSync(pastaAntiga)) {
      fs.renameSync(pastaAntiga, pastaNova);
    }

    const caminhoJsonNovo = path.join(pastaNova, 'dados.json');
    fs.writeFileSync(caminhoJsonNovo, JSON.stringify(novosDados, null, 2), 'utf8');

    return res.json({ mensagem: `Usuário '${nomer}' atualizado com sucesso.` });
  } catch (err) {
    console.error("Erro ao atualizar o usuário:", err);
    return res.status(500).json({ erro: "Erro ao atualizar o usuário." });
  }
}

module.exports = usuarioatualizarpost;
