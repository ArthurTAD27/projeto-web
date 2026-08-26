const fs = require("fs");
const path = require("path");

function usuarionovopost(req, res) {
  const { nome, perfil, senha } = req.body;

  if (!nome?.trim() || !senha?.trim() || !['coletor', 'tecnico'].includes(perfil)) {
    return res.status(400).json({ erro: "Preencha nome, senha e selecione um perfil válido." });
  }

  const id = perfil === 'coletor' ? 'coletor1' : 'tecnico1';
  const nomesanitizado = nome.trim();
  const dataDir = path.join(__dirname, '..', '..', 'data');
  const pastaUsuario = path.join(dataDir, nomesanitizado);

  try {
    if (fs.existsSync(pastaUsuario)) {
      return res.status(409).json({ erro: `Já existe um usuário com o nome '${nomesanitizado}'.` });
    }

    fs.mkdirSync(pastaUsuario);

    const dados = {
      id,
      nome: nomesanitizado,
      senha: senha.trim(),
      perfil
    };

    fs.writeFileSync(
      path.join(pastaUsuario, 'dados.json'),
      JSON.stringify(dados, null, 2),
      'utf8'
    );

    return res.status(201).json({ mensagem: "Usuário criado com sucesso!" });
  } catch (err) {
    console.error("Erro ao criar usuário:", err);
    return res.status(500).json({ erro: "Erro ao criar o usuário." });
  }
}

module.exports = usuarionovopost;
