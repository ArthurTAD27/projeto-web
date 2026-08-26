const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const formtipoget = require('./src/coletor/formtipoGET')
const resultsget = require('./src/coletor/resultsGET')
const avaliarpost = require('./src/coletor/avaliarPOST')
const resultcolpost = require('./src/coletor/resultcolPOST')
const veramostraget = require('./src/coletor/veramostraGET')
const loginpost = require('./src/loginPOST')
const solicitacoesget = require('./src/tecnico/solicitacoesGET')
const amostratecget = require('./src/tecnico/amostratecGET')
const amostratecpost = require('./src/tecnico/amostratecPOST')
const tecfinalizarget = require('./src/tecnico/tecfinalizarGET')
const tecfinalizarpost = require('./src/tecnico/tecfinalizarPOST')
const indicesadminget = require('./src/admin/indicesadminGET')
const apiIndicesget = require('./src/admin/apiIndicesGET');
const indicesnovoget = require('./src/admin/indicesnovoGET')
const indicesnovopost = require('./src/admin/indicesnovoPOST')
const indicesdeletarpost = require('./src/admin/indicedeletarPOST');
const indiceeditarget = require('./src/admin/indiceeditarGET')
const indiceeditarpost = require('./src/admin/indiceeditarPOST');
const usuariosget = require('./src/admin/usuariosGET');
const usuarioeditarget = require('./src/admin/usuarioeditarGET');
const usuarioatualizarpost = require('./src/admin/usuarioatualizarPOST');
const usuariodeletarpost = require('./src/admin/usuariodeletarPOST');
const usuarionovoget = require('./src/admin/usuarionovoGET');
const usuarionovopost = require('./src/admin/usuarionovoPOST');


app.get('/formtipo', (req, res) => {return formtipoget(req,res)});

app.get('/results', (req, res) => {return resultsget(req,res)});

app.post('/avaliar', (req, res) => {return avaliarpost(req,res)});

app.post('/resultcol', (req, res) => {return resultcolpost(req,res)});
  
app.get('/ver-amostra/:arquivo', (req, res) => {return veramostraget(req,res)});

app.post('/login', (req, res) => {return loginpost(req,res)});

app.get('/solicitacoes', (req, res) => {return solicitacoesget(req,res)});

app.get('/tecnico/amostra/:coletor/:arquivo', (req, res) => {return amostratecget(req,res)});

app.post('/tecnico/amostra/:coletor/:arquivo', (req, res) => {return amostratecpost(req,res)});

app.post('/tecnico/amostra/:coletor/:arquivo/finalizar', (req, res) => {return tecfinalizarpost(req,res)});

app.get('/indices', (req, res) => {return indicesadminget(req,res)});

app.get('/api/indices', (req, res) => { return apiIndicesget(req, res); });

app.post('/indices/novo', (req, res) => {return indicesnovopost(req,res)});

app.post('/indices/deletar/:id', (req, res) => {return indicesdeletarpost(req,res)});

app.get('/indices/editar/:id', (req, res) => {return indiceeditarget(req,res)});

app.post('/indices/editar/:id', (req, res) => {return indiceeditarpost(req,res)});

app.get('/usuarios', (req, res) => {return usuariosget(req,res)});

app.get('/usuarios/editar/:nome', (req, res) => {return usuarioeditarget(req,res)});

app.post('/usuarios/atualizar/:nome', (req, res) => {return usuarioatualizarpost(req,res)});

app.post('/usuarios/deletar/:id', (req, res) => {return usuariodeletarpost(req,res)});

app.get('/usuarios/novo', (req, res) => {return usuarionovoget(req,res)});

app.post('/usuarios/novo', (req, res) => {return usuarionovopost(req,res)});


app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});