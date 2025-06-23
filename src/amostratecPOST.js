const fs = require("fs");
const path = require("path");

function amostratecpost(req, res) { 
    const user = req.session.usuario;
    const usuario = user.nome;
    if (!user || user.id !== 'tecnico1') return res.redirect('/');
    const { coletor, arquivo } = req.params;
    // Segurança básica contra tentativa de path traversal
    if (coletor.includes('..') || arquivo.includes('..')) {
        return res.status(400).send('Parâmetros inválidos.');
    }

    const caminho = path.join(__dirname,'..', 'data', coletor, arquivo);
    if (!fs.existsSync(caminho)) return res.status(404).send('Amostra não encontrada.');

    try {
        const amostra = JSON.parse(fs.readFileSync(caminho, 'utf8'));
        const variaveis = [];
        let somaPesos = 0;
        let somaPonderada = 0;
        let produto = 1;

        for (const v of amostra.variaveis) {
        const escore = parseFloat(req.body[`escore_${v.id}`]);
        const peso = parseFloat(req.body[`peso_${v.id}`]);

        // Validação dos campos
        if (
            isNaN(escore) || escore < 1 || escore > 100 ||
            isNaN(peso) || peso <= 0
        ) {
            return res.status(400).send(`Valores inválidos para a variável: ${v.nome}`);
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

        // Armazenar na sessão para uso na próxima tela
        req.session.amostraAnalise = {
        coletor,
        arquivo,
        variaveis,
        escore_soma: parseFloat(escore_soma.toFixed(2)),
        escore_produto: parseFloat(escore_produto.toFixed(2))
        };

        res.redirect(`/tecnico/amostra/${coletor}/${arquivo}/finalizar`);
    } catch (err) {
        console.error('Erro ao processar a análise:', err);
        res.status(500).send('Erro interno ao processar a análise.');
    }
}

module.exports = amostratecpost;