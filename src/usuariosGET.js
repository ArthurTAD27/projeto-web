const fs = require("fs");
const path = require("path");

function usuariosget(req, res) { 
    const user = req.session.usuario;
    if (!user || user.id !== 'admin1') return res.redirect('/');
    const dataDir = path.join(__dirname,'..' ,'data');
    try {
        const pastas = fs.readdirSync(dataDir).filter(p => {
        const stats = fs.statSync(path.join(dataDir, p));
        return stats.isDirectory();
        });

        const usuarios = pastas
        .map(pasta => {
            const caminho = path.join(dataDir, pasta, 'dados.json');
            if (!fs.existsSync(caminho)) return null;
            const conteudo = JSON.parse(fs.readFileSync(caminho, 'utf8'));
            if (conteudo.id === 'admin1') return null;
            return { id: conteudo.id, nome: conteudo.nome, perfil: conteudo.perfil };
        })
        .filter(Boolean);

        res.render('admin_usuarios', { usuario: user, usuarios });
    } catch (err) {
        console.error('Erro ao carregar usuários:', err);
        res.status(500).send('Erro ao carregar usuários.');
    }
}
module.exports = usuariosget;