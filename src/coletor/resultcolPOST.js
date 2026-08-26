const fs = require("fs");
const path = require("path");

function resultcolpost(req, res) {
  const coletor = req.headers['x-coletor'];
  const indiceSelecionado = req.headers['x-indice'];
  const dadosFormulario = req.body;
  if (!coletor || !indiceSelecionado || !dadosFormulario) {
    return res.status(400).json({ erro: 'Dados incompletos.' });
  }

  const caminhoIndices = path.join(__dirname, '..', '..', 'data', 'indices.json');
  const todosIndices = JSON.parse(fs.readFileSync(caminhoIndices, 'utf8'));
  const indice = todosIndices.indices[indiceSelecionado];

  if (!indice) return res.status(400).send('Índice inválido.');

  const variaveisPreenchidas = indice.variaveis.map(v => ({
    id: v.id,
    nome: v.nome,
    unidade: v.unidade,
    valor: parseFloat(dadosFormulario[v.id]) || null
  }));

  const amostra = {
    coletor,
    indice: indiceSelecionado,
    nome_indice: indice.nome,
    data_envio: new Date().toISOString(),
    variaveis: variaveisPreenchidas,
    status: 'pendente',
    escore_soma: null,
    escore_produto: null,
    estado: "",
    descricao: ""
  };

  const dirUsuario = path.join(__dirname, '..','..','data', coletor);
  if (!fs.existsSync(dirUsuario)) {
    fs.mkdirSync(dirUsuario);
  }

  const nomeArquivo = `amostra_${Date.now()}.json`;
  const caminhoArquivo = path.join(dirUsuario, nomeArquivo);

  fs.writeFileSync(caminhoArquivo, JSON.stringify(amostra, null, 2), 'utf8');

  res.json({ sucesso: true });
}

module.exports = resultcolpost;
