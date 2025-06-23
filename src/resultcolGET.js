const fs = require("fs");
const path = require("path");

function resultcolget(req, res) {    
    const dados = req.body; // valores vindos do formulário
    const coletor = req.session.usuario.nome;
    const indiceSelecionado = req.session.indiceSelecionado; // salvar antes, explico abaixo
    if (!indiceSelecionado) return res.status(400).send('Índice não selecionado.');

    // Carregar estrutura do índice
    const caminhoIndices = path.join(__dirname,'..', 'data', 'indices.json');
    const todosIndices = JSON.parse(fs.readFileSync(caminhoIndices, 'utf8'));
    const indice = todosIndices.indices[indiceSelecionado];

    if (!indice) return res.status(400).send('Índice inválido.');

    // Construir objeto com as variáveis preenchidas
    const variaveisPreenchidas = indice.variaveis.map(v => ({
        id: v.id,
        nome: v.nome,
        unidade: v.unidade,
        valor: parseFloat(dados[v.id]) || null
    }));

    // Montar objeto da amostra
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

    // Criar pasta se não existir
    const dirUsuario = path.join(__dirname, '..','data', coletor);
    if (!fs.existsSync(dirUsuario)) {
        fs.mkdirSync(dirUsuario);
    }

    const nomeArquivo = `amostra_${Date.now()}.json`;
    const caminhoArquivo = path.join(dirUsuario, nomeArquivo);

    fs.writeFileSync(caminhoArquivo, JSON.stringify(amostra, null, 2), 'utf8');

    res.send(`
        <script>
        alert('Amostra enviada com sucesso!');
        window.location.href = '/coletor';
        </script>
    `);
}

module.exports = resultcolget;