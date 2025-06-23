const fs = require("fs");
const path = require("path");

function solicitacoesget(req, res) {
    const user = req.session.usuario;
    const usuario = user.nome
    if (!user || user.id !== 'tecnico1') return res.redirect('/');
    const pastaData = path.join(__dirname,'..', 'data');
    const coletores = fs.readdirSync(pastaData).filter(nome => {
        const dadosPath = path.join(pastaData, nome, 'dados.json');
        if (!fs.existsSync(dadosPath)) return false;
        const dados = JSON.parse(fs.readFileSync(dadosPath, 'utf8'));
        return dados.perfil === 'coletor';
    });

    const amostrasPendentes = [];

    coletores.forEach(coletor => {
        const pasta = path.join(pastaData, coletor);
        const arquivos = fs.readdirSync(pasta).filter(f => f.startsWith('amostra_') && f.endsWith('.json'));

        arquivos.forEach(arquivo => {
        const caminho = path.join(pasta, arquivo);
        const amostra = JSON.parse(fs.readFileSync(caminho, 'utf8'));

        if (amostra.status === 'pendente') {
            amostrasPendentes.push({
            coletor,
            arquivo,
            nome_indice: amostra.nome_indice,
            data_envio: amostra.data_envio
            });
        }
        });
    });

    res.render('solicitacoes', {
        usuario,
        amostras: amostrasPendentes
    });
}

module.exports = solicitacoesget;