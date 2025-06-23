const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const fs = require('fs');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


app.use(session({
  secret: 'agua-secreta',
  resave: false,
  saveUninitialized: false
}));
const dadosget = require('./src/dadosGET')
const tecnicoget = require('./src/tecnicoGET')
const adminget = require('./src/adminGET')
const coletorget = require('./src/coletorGET')
const formtipoget = require('./src/formtipoGET')
const resultsget = require('./src/resultsGET')
const avaliarpost = require('./src/avaliarPOST')
const resultcolget = require('./src/resultcolGET')
const veramostraget = require('./src/veramostraGET')
const loginpost = require('./src/loginPOST')
const solicitacoesget = require('./src/solicitacoesGET')
const amostratecget = require('./src/amostratecGET')
const amostratecpost = require('./src/amostratecPOST')
const tecfinalizarget = require('./src/tecfinalizarGET')
const tecfinalizarpost = require('./src/tecfinalizarPOST')
const indicesadminget = require('./src/indicesadminGET')
const indicesnovoget = require('./src/indicesnovoGET')
const indicesnovopost = require('./src/indicesnovoPOST')
const indicesdeletarpost = require('./src/indicedeletarPOST');
const indiceeditarget = require('./src/indiceeditarGET')
const indiceeditarpost = require('./src/indiceeditarPOST');
const usuariosget = require('./src/usuariosGET');
const usuariodeletarpost = require('./src/usuariodeletarPOST');
const usuarionovoget = require('./src/usuarionovoGET');
const usuarionovopost = require('./src/usuarionovoPOST');

app.get('/', (req, res) => { return dadosget(req,res)});

app.get('/tecnico', (req, res) => {return tecnicoget(req,res)});

app.get('/admin', (req, res) => {return adminget(req,res)});
 
app.get('/coletor', (req, res) => {return coletorget(req,res)});

app.get('/formtipo', (req, res) => {return formtipoget(req,res)});

app.get('/results', (req, res) => {return resultsget(req,res)});

app.post('/avaliar', (req, res) => {return avaliarpost(req,res)});

app.post('/resultcol', (req, res) => {return resultcolget(req,res)});
  
app.get('/ver-amostra/:arquivo', (req, res) => {return veramostraget(req,res)});

app.post('/login', (req, res) => {return loginpost(req,res)});

app.get('/solicitacoes', (req, res) => {return solicitacoesget(req,res)});

app.get('/tecnico/amostra/:coletor/:arquivo', (req, res) => {return amostratecget(req,res)});

app.post('/tecnico/amostra/:coletor/:arquivo', (req, res) => {return amostratecpost(req,res)});

app.get('/tecnico/amostra/:coletor/:arquivo/finalizar', (req, res) => {return tecfinalizarget(req,res)});

app.post('/tecnico/amostra/:coletor/:arquivo/finalizar', (req, res) => {return tecfinalizarpost(req,res)});

app.get('/indices', (req, res) => {return indicesadminget(req,res)});

app.get('/indices/novo', (req, res) => {return indicesnovoget(req,res)});

app.post('/indices/novo', (req, res) => {return indicesnovopost(req,res)});

app.post('/indices/deletar/:id', (req, res) => {return indicesdeletarpost(req,res)});

app.get('/indices/editar/:id', (req, res) => {return indiceeditarget(req,res)});

app.post('/indices/editar/:id', (req, res) => {return indiceeditarpost(req,res)});

app.get('/usuarios', (req, res) => {return usuariosget(req,res)});

app.post('/usuarios/deletar/:id', (req, res) => {return usuariodeletarpost(req,res)});

app.get('/usuarios/novo', (req, res) => {return usuarionovoget(req,res)});

app.post('/usuarios/novo', (req, res) => {return usuarionovopost(req,res)});


app.listen(8090, () => {
  console.log('Servidor rodando em http://localhost:8090');
});
