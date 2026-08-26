const fs = require("fs");
const path = require("path");

function amostratecpost(req, res) { 
  const { coletor, arquivo } = req.params;
  const dadosForm = req.body;

  if (coletor.includes('..') || arquivo.includes('..')) {
    return res.status(400).json({ erro: 'Parâmetros inválidos.' });
  }

  const caminho = path.join(__dirname,'..','..', 'data', coletor, arquivo);
  if (!fs.existsSync(caminho)) {
    return res.status(404).json({ erro: 'Amostra não encontrada.' });
  }

  try {
    const amostra = JSON.parse(fs.readFileSync(caminho, 'utf8'));
    const variaveis = [];
    let somaPesos = 0;
    let somaPonderada = 0;
    let produto = 1;

    for (const v of amostra.variaveis) {
      const escore = parseFloat(dadosForm[`escore_${v.id}`]);
      const peso = parseFloat(dadosForm[`peso_${v.id}`]);

      if (
        isNaN(escore) || escore < 1 || escore > 100 ||
        isNaN(peso) || peso <= 0
      ) {
        return res.status(400).json({ erro: `Valores inválidos para a variável: ${v.nome}` });
      }

      somaPesos += peso;
      somaPonderada += escore * peso;
      produto *= Math.pow(escore, peso);

      variaveis.push({
        ...v,
        escore,
        peso
      });
    }

    const escore_soma = somaPonderada / somaPesos;
    const escore_produto = Math.pow(produto, 1 / somaPesos);

    res.json({
      coletor,
      arquivo,
      variaveis,
      escore_soma: parseFloat(escore_soma.toFixed(2)),
      escore_produto: parseFloat(escore_produto.toFixed(2))
    });

  } catch (err) {
    console.error('Erro ao processar a análise:', err);
    res.status(500).json({ erro: 'Erro interno ao processar a análise.' });
  }
}

module.exports = amostratecpost;