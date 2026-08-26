const fs = require("fs");
const path = require("path");

function resultsget(req, res) {
  const usuario = req.headers['x-usuario'];

  if (!usuario || usuario.includes("..")) {
    return res.status(400).json({ erro: "Usuário inválido." });
  }

  const pastaUsuario = path.join(__dirname, '..', '..', 'data', usuario);

  if (!fs.existsSync(pastaUsuario)) {
    return res.status(404).json({ erro: 'Nenhuma amostra encontrada.' });
  }

  try {
    const arquivos = fs.readdirSync(pastaUsuario)
      .filter(f => f.startsWith('amostra_') && f.endsWith('.json'));

    const amostras = arquivos.map(nome => {
      const caminhoArquivo = path.join(pastaUsuario, nome);
      const dados = JSON.parse(fs.readFileSync(caminhoArquivo, 'utf8'));
      return { nomeArquivo: nome, ...dados };
    });

    res.json({ amostras });
  } catch (erro) {
    console.error('Erro ao carregar resultados:', erro);
    res.status(500).json({ erro: 'Erro ao carregar os resultados.' });
  }
}

module.exports = resultsget;