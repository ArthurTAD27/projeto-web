const fs = require("fs");
const path = require("path"); 

function tecfinalizarpost(req, res) { 
 const { coletor, arquivo } = req.params;
  const { estado, descricao, escore_soma, escore_produto, variaveis } = req.body;

  if (!coletor || !arquivo || !estado || !descricao || !escore_soma || !escore_produto || !variaveis) {
    return res.status(400).json({ erro: 'Dados incompletos para salvar análise.' });
  }

  if (coletor.includes('..') || arquivo.includes('..')) {
    return res.status(400).json({ erro: 'Parâmetros inválidos.' });
  }

  const caminho = path.join(__dirname, '..','..','data', coletor, arquivo);
  if (!fs.existsSync(caminho)) {
    return res.status(404).json({ erro: 'Amostra não encontrada.' });
  }

  try {
    const amostra = JSON.parse(fs.readFileSync(caminho, 'utf8'));

    amostra.status = 'concluido';
    amostra.escore_soma = parseFloat(escore_soma);
    amostra.escore_produto = parseFloat(escore_produto);
    amostra.estado = estado;
    amostra.descricao = descricao;
    amostra.variaveis = variaveis;

    fs.writeFileSync(caminho, JSON.stringify(amostra, null, 2), 'utf8');

    res.json({ sucesso: true, mensagem: 'Análise concluída com sucesso!' });
  } catch (err) {
    console.error('Erro ao salvar análise final:', err);
    res.status(500).json({ erro: 'Erro ao salvar os dados da análise.' });
  }
}

module.exports = tecfinalizarpost;