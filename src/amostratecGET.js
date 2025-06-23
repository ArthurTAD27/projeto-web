const fs = require("fs");
const path = require("path");

function amostratecget(req, res) {
    const user = req.session.usuario;
    const usuario = user.nome;
    if (!user || user.id !== 'tecnico1') return res.redirect('/');
    const coletor = req.params.coletor;
    const arquivo = req.params.arquivo;

    // Segurança básica contra path traversal
    if (coletor.includes('..') || arquivo.includes('..')) {
        return res.status(400).send('Parâmetros inválidos.');
    }

    const caminho = path.join(__dirname, '..','data', coletor, arquivo);

    if (!fs.existsSync(caminho)) return res.status(404).send('Amostra não encontrada.');

    try {
        const amostra = JSON.parse(fs.readFileSync(caminho, 'utf8'));

        if (amostra.status !== 'pendente') {
        return res.send('Esta amostra já foi analisada.');
        }

        res.render('tecnico_amostra', {
        usuario,
        coletor,
        arquivo,
        amostra
        });

    } catch (err) {
        console.error('Erro ao ler amostra:', err);
        res.status(500).send('Erro ao carregar a amostra.');
    }
}

module.exports = amostratecget;