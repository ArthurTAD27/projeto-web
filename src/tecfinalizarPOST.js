const fs = require("fs");
const path = require("path"); 

function tecfinalizarpost(req, res) { 
const user = req.session.usuario;
const usuario = user.nome;
  if (!user || user.id !== 'tecnico1') return res.redirect('/');
  const { coletor, arquivo, escore_soma, escore_produto, variaveis } = req.session.amostraAnalise || {};
  const { estado, descricao } = req.body;

  if (!coletor || !arquivo || !estado || !descricao) {
    return res.status(400).send('Dados incompletos para salvar análise.');
  }

  const caminho = path.join(__dirname,'..','data', coletor, arquivo);
  if (!fs.existsSync(caminho)) return res.status(404).send('Amostra não encontrada.');

  try {
    const amostra = JSON.parse(fs.readFileSync(caminho, 'utf8'));

    amostra.status = 'concluido';
    amostra.escore_soma = escore_soma;
    amostra.escore_produto = escore_produto;
    amostra.estado = estado;
    amostra.descricao = descricao;
    amostra.variaveis = variaveis;

    fs.writeFileSync(caminho, JSON.stringify(amostra, null, 2), 'utf8');

    req.session.amostraAnalise = null;

    res.send(`
      <script>
        alert("Análise concluída com sucesso!");
        window.location.href = "/tecnico";
      </script>
    `);
  } catch (err) {
    console.error('Erro ao salvar análise final:', err);
    res.status(500).send('Erro ao salvar os dados da análise.');
  }
}

module.exports = tecfinalizarpost;