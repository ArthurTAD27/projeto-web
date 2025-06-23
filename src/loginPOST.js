const fs = require("fs");
const path = require("path");

function loginpost(req, res) { 
const usuario = req.body.usuario;
    const caminho = path.join(__dirname,'..', 'data', usuario, 'dados.json');
    fs.readFile(caminho, 'utf8', (err, conteudo) => {
        if (err) {
            return res.status(404).send('Usuário não encontrado');
        }
        try {
            const dados = JSON.parse(conteudo);
            req.session.usuario = dados;
            const tipo = dados.id;
            switch(tipo) {
              case 'tecnico1':
                return res.redirect(`/tecnico`);
              case 'admin1':
                return res.redirect(`/admin`);
              case 'coletor1':
                return res.redirect(`/coletor`);
              default:
                return res.send('Erro ao interpretar os dados.');
            }
           } catch (e) {
            return res.status(500).send('Erro ao processar os dados do usuário'); 
           }
  });
}

module.exports = loginpost;