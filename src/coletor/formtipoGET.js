const fs = require("fs");
const path = require("path");

function formtipoget(req, res) {
  const indicePath = path.join(__dirname, '..', '..', 'data', 'indices.json');

  try {
    const indiceJson = JSON.parse(fs.readFileSync(indicePath, 'utf8'));
    res.json({ indices: indiceJson.indices });
  } catch (err) {
    console.error('Erro ao carregar índices:', err);
    res.status(500).json({ erro: 'Erro ao carregar os índices.' });
  }
}

module.exports = formtipoget;
