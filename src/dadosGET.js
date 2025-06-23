const fs = require("fs");
const path = require("path");

const dirData = path.join(__dirname, "..", "data");

function dadosget(req, res) {
    fs.readdir(dirData, (err, pastasUsuarios) => {
        if (err) {
            console.error("Erro ao ler diretório:", err);
            return res.status(500).send("Erro ao acessar os dados dos usuários!");
        }

        const usuarios = [];

        let contador = 0;
        if (pastasUsuarios.length === 0) {
            return res.render("index", { usuarios: [] });
        }

        pastasUsuarios.forEach((pasta) => {
            const caminhoJson = path.join(dirData, pasta, "dados.json");

            fs.readFile(caminhoJson, "utf8", (err, conteudo) => {
                contador++;

                if (!err) {
                    try {
                        const dados = JSON.parse(conteudo);
                        usuarios.push(dados)
                    } catch (parseErr) {
                        console.error(`Erro ao parsear JSON de ${pasta}:`, parseErr);
                    }                  
                }
                if (contador === pastasUsuarios.length) {
                    res.render("index", { usuarios });
                }
            });
        });
    });
}

module.exports = dadosget;
