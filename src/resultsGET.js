const fs = require("fs");
const path = require("path");

function resultsget(req, res) {
  const user = req.session.usuario;
  const usuario = user.nome
  if (!user || user.id !== 'coletor1') return res.redirect('/');
  const pastaUsuario = path.join(__dirname, '..', 'data', usuario);
  if (!fs.existsSync(pastaUsuario)) {
    return res.send('Nenhuma amostra encontrada.');
  }
  try {
    const arquivos = fs.readdirSync(pastaUsuario)
      .filter(f => f.startsWith('amostra_') && f.endsWith('.json'));
    const amostras = arquivos.map(nome => {
      const caminhoArquivo = path.join(pastaUsuario, nome);
      const dados = JSON.parse(fs.readFileSync(caminhoArquivo, 'utf8'));
      return { nomeArquivo: nome, ...dados };
    });
    res.render('results', { usuario, amostras });
  } catch (erro) {
    console.error('Erro ao carregar resultados do coletor:', erro);
    res.status(500).send('Erro ao carregar os resultados.');
  }
}

module.exports = resultsget;
