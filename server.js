const express = require('express');
const session = require('express-session');
const axios = require('axios'); 
const app = express();

//npms: npm install axios bootstrap dotenv ejs express express-ejs-layouts express-session


app.set('view engine', 'ejs');
app.set('views', './views');

const expressLayouts = require('express-ejs-layouts'); 
app.use(expressLayouts); 
app.set('layout','layouts/default');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


app.use(session({
  secret: 'e8cfd4de18d59aa317f018ce4f1b77fcf373b339b1c2fd884d0a982dc53fe7217fc82e83b295db2df43724e24311cb75',
  resave: false,
  saveUninitialized: false
}));


app.get('/', async (req, res) => {
  try {
    await new Promise(resolve => req.session.destroy(resolve));
    res.render('index'); 
  } catch (err) {
    res.status(500).send('Erro ao carregar dados');
  }
});

app.post('/login', async (req, res) => {
  try {
    const { usuario, senha } = req.body;

    const response = await axios.post('http://localhost:3000/login', {
      usuario,
      senha
    });

    const dados = response.data;

    req.session.usuario = dados;

    switch (dados.id) {
      case 'admin1':
        return res.redirect('/admin');
      case 'tecnico1':
        return res.redirect('/tecnico');
      case 'coletor1':
        return res.redirect('/coletor');
      default:
        return res.status(400).send('Perfil desconhecido');
    }
  } catch (err) {
    return res.send(`
      <script>
        alert("Usuário ou senha incorretos!");
        window.location.href = "/";
      </script>
    `);
  }
});
app.get('/admin', async (req, res) => {
  const user = req.session.usuario;
  if (!user || user.id !== 'admin1') return res.redirect('/');
  const usuario = user.nome;
  res.render('admin', { usuario });
});

app.get('/tecnico', async (req, res) => {
  const user = req.session.usuario;
  if (!user || user.id !== 'tecnico1') return res.redirect('/');
  const usuario = user.nome;
  res.render('tecnico',{usuario});
});

app.get('/coletor', async (req, res) => {
  const user = req.session.usuario;
  if (!user || user.id !== 'coletor1') return res.redirect('/');
  const usuario = user.nome;
  res.render('coletor', { usuario });
});

app.get('/formtipo', async (req, res) => {
  const user = req.session.usuario;
  if (!user || user.id !== 'coletor1') return res.redirect('/');
  try {
    const response = await axios.get('http://localhost:3000/formtipo'); 
    const { indices } = response.data;
    res.render('formtipo', { usuario: user.nome, indices });
  } catch (err) {
    console.error('Erro ao buscar índices da API:', err);
    res.status(500).send('Erro ao carregar os índices.');
  }
});

app.get('/results', async (req, res) => {
  const user = req.session.usuario;
  if (!user || user.id !== 'coletor1') return res.redirect('/');
  try {
    const response = await axios.get('http://localhost:3000/results', {
      headers: {
        'x-usuario': user.nome
      }
    });

    const { amostras } = response.data;
    res.render('results', { usuario: user.nome, amostras });
  } catch (erro) {
    console.error('Erro ao buscar resultados da API:', erro);
    res.status(500).send('Erro ao carregar os resultados.');
  }
});

app.post('/avaliar', async (req, res) => {
  const user = req.session.usuario;
  if (!user || user.id !== 'coletor1') return res.redirect('/');

   const indiceSelecionado = req.body.indice; 
   req.session.indiceSelecionado = indiceSelecionado;

  try {
    const response = await axios.post('http://localhost:3000/avaliar', null, {
      headers: {
        'x-indice': indiceSelecionado
      }
    });

    const indiceJson = response.data;

    res.render('formulario_indice', {
      usuario: user,
      indice: indiceJson
    });

  } catch (erro) {
    console.error('Erro ao buscar índice da API:', erro);
    res.status(500).send('Erro ao carregar o índice.');
  }
});

app.post('/resultcol', async (req, res) => {
  const dados = req.body;
  const user = req.session.usuario;
  const indiceSelecionado = req.session.indiceSelecionado;
  
  if (!user || user.id !== 'coletor1') return res.redirect('/');
  if (!indiceSelecionado) return res.redirect('/avaliar');
  try {
    await axios.post('http://localhost:3000/resultcol', dados, {
      headers: {
        'x-coletor': user.nome,
        'x-indice': String(indiceSelecionado)
      }
    });

    res.send(`
      <script>
        alert('Amostra enviada com sucesso!');
        window.location.href = '/coletor';
      </script>
    `);
  } catch (err) {
    console.error('Erro ao enviar amostra:', err);
    res.status(500).send('Erro ao enviar amostra.');
  }
});

app.get('/ver-amostra/:arquivo', async (req, res) => {
  const user = req.session.usuario;
  if (!user || user.id !== 'coletor1') return res.redirect('/');
  const usuario = user.nome;

  try {
    const response = await axios.get(`http://localhost:3000/ver-amostra/${req.params.arquivo}`, {
      headers: {
        'x-usuario': usuario
      }
    });

    const { amostra } = response.data;

    res.render('amostra_detalhes', { usuario, amostra });
  } catch (err) {
    console.error('Erro ao buscar amostra da API:', err);
    res.status(500).send('Erro ao carregar a amostra.');
  }
});

app.get('/solicitacoes', async (req, res) => {
  const user = req.session.usuario;
  if (!user || user.id !== 'tecnico1') return res.redirect('/');
  const usuario = user.nome;

  try {
    const response = await axios.get('http://localhost:3000/solicitacoes');
    const { amostras } = response.data;

    res.render('solicitacoes', { usuario, amostras });
  } catch (err) {
    console.error('Erro ao buscar solicitações da API:', err);
    res.status(500).send('Erro ao carregar solicitações.');
  }
});

app.get('/tecnico/amostra/:coletor/:arquivo', async (req, res) => {
  const user = req.session.usuario;
  if (!user || user.id !== 'tecnico1') return res.redirect('/');
  const usuario = user.nome;

  try {
    const response = await axios.get(`http://localhost:3000/tecnico/amostra/${req.params.coletor}/${req.params.arquivo}`);
    const dados = response.data;

    if (dados.erro) {
      return res.send(dados.erro);
    }

    res.render('tecnico_amostra', {
      usuario,
      coletor: dados.coletor,
      arquivo: dados.arquivo,
      amostra: dados.amostra
    });
  } catch (err) {
    console.error('Erro ao buscar amostra da API:', err);
    res.status(500).send('Erro ao carregar a amostra.');
  }
});

app.post('/tecnico/amostra/:coletor/:arquivo', async (req, res) => {
  const user = req.session.usuario;
  if (!user || user.id !== 'tecnico1') return res.redirect('/');

  try {
    const response = await axios.post(
      `http://localhost:3000/tecnico/amostra/${req.params.coletor}/${req.params.arquivo}`,
      req.body
    );

    const dados = response.data;

    if (dados.erro) {
      return res.send(dados.erro);
    }

    
    req.session.amostraAnalise = {
      coletor: dados.coletor,
      arquivo: dados.arquivo,
      variaveis: dados.variaveis,
      escore_soma: dados.escore_soma,
      escore_produto: dados.escore_produto
    };

    res.redirect(`/tecnico/amostra/${dados.coletor}/${dados.arquivo}/finalizar`);
  } catch (err) {
    console.error('Erro ao processar análise via API:', err);
    res.status(500).send('Erro ao processar a análise.');
  }
});

app.get('/tecnico/amostra/:coletor/:arquivo/finalizar', (req, res) => {
  const user = req.session.usuario;
  if (!user || user.id !== 'tecnico1') return res.redirect('/');
  const usuario = user.nome;

  const { coletor, arquivo } = req.params;
  const { escore_soma, escore_produto, variaveis } = req.session.amostraAnalise || {};

  if (!escore_soma || !escore_produto || !variaveis) {
    return res.status(400).send('Dados da análise não encontrados.');
  }

  res.render('tecnico_finalizar', {
    usuario,
    escore_soma,
    escore_produto,
    voltarPara: `/tecnico/amostra/${coletor}/${arquivo}`
  });
});

app.post('/tecnico/amostra/:coletor/:arquivo/finalizar', async (req, res) => {
  const user = req.session.usuario;
  if (!user || user.id !== 'tecnico1') return res.redirect('/');

  const { coletor, arquivo, escore_soma, escore_produto, variaveis } = req.session.amostraAnalise || {};
  const { estado, descricao } = req.body;

  if (!coletor || !arquivo || !estado || !descricao) {
    return res.status(400).send('Dados incompletos para finalizar análise.');
  }

  try {
    const response = await axios.post(
      `http://localhost:3000/tecnico/amostra/${coletor}/${arquivo}/finalizar`,
      {
        estado,
        descricao,
        escore_soma,
        escore_produto,
        variaveis
      }
    );

    const dados = response.data;

    if (dados.erro) {
      return res.send(dados.erro);
    }

    req.session.amostraAnalise = null;

    res.send(`
      <script>
        alert("Análise concluída com sucesso!");
        window.location.href = "/tecnico";
      </script>
    `);
  } catch (err) {
    console.error('Erro ao salvar análise via API:', err);
    res.status(500).send('Erro ao salvar os dados da análise.');
  }
});

app.get('/api/indices', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3000/api/indices');
    res.json(response.data.indices);
  } catch (err) {
    console.error('Erro ao buscar índices da API:', err);
    res.status(500).json({ erro: 'Erro ao carregar índices.' });
  }
});

app.get('/indices', async (req, res) => {
  const user = req.session.usuario;
  if (!user || user.id !== 'admin1') return res.redirect('/');
  const usuario = user.nome;

  try {
    const response = await axios.get('http://localhost:3000/api/indices'); 
    const { indices } = response.data;

    res.render('admin_indices', { usuario, indices });
  } catch (err) {
    console.error('Erro ao buscar índices na API:', err);
    res.status(500).send('Erro ao carregar os índices.');
  }
});

app.get('/indices/novo', async (req, res) => {
    const user = req.session.usuario;
    if (!user || user.id !== 'admin1') return res.redirect('/');
    const usuario = user.nome;
    res.render('admin_indices_novo', { usuario });
});

app.post('/indices/novo', async (req, res) => {
  const user = req.session.usuario;
  if (!user || user.id !== 'admin1') return res.redirect('/');
  try {
    const response = await axios.post('http://localhost:3000/indices/novo', req.body);
    const dados = response.data;
    if (dados.erro) {
      return res.send(`
        <script>
          alert("${dados.erro}");
          window.history.back();
        </script>
      `);
    }
    res.send(`
      <script>
        alert("${dados.mensagem}");
        window.location.href = "/indices";
      </script>
    `);
  } catch (err) {
    console.error('Erro ao criar índice via API:', err);
    return res.status(500).send('Erro ao criar índice.');
  }
});
app.post('/indices/deletar/:id', async (req, res) => {
  const user = req.session.usuario;
  if (!user || user.id !== 'admin1') return res.redirect('/');

  const { id } = req.params;

  try {
    const response = await axios.post(`http://localhost:3000/indices/deletar/${id}`);
    const dados = response.data;

    if (dados.erro) {
      return res.send(`
        <script>
          alert("${dados.erro}");
          window.history.back();
        </script>
      `);
    }

    res.send(`
      <script>
        alert("${dados.mensagem}");
        window.location.href = "/indices";
      </script>
    `);
  } catch (err) {
    console.error('Erro ao excluir índice via API:', err);
    return res.status(500).send('Erro ao excluir índice.');
  }
});

app.get('/indices/editar/:id', async (req, res) => {
  const user = req.session.usuario;
  if (!user || user.id !== 'admin1') return res.redirect('/');

  const { id } = req.params;

  try {
    const response = await axios.get(`http://localhost:3000/indices/editar/${id}`);
    const indice = response.data;

    res.render('admin_indices_editar', {
      usuario: user.nome,
      id: indice.id,
      nome: indice.nome,
      descricao: indice.descricao,
      variaveis: indice.variaveis
    });
  } catch (err) {
    console.error('Erro ao buscar índice via API:', err);
    res.status(500).send('Erro ao carregar o índice.');
  }
});

app.post('/indices/editar/:id', async (req, res) => {
  const user = req.session.usuario;
  if (!user || user.id !== 'admin1') return res.redirect('/');

  const { id } = req.params;

  try {
    const response = await axios.post(`http://localhost:3000/indices/editar/${id}`, req.body);
    const dados = response.data;

    if (dados.erro) {
      return res.send(`
        <script>
          alert("${dados.erro}");
          window.history.back();
        </script>
      `);
    }

    return res.send(`
      <script>
        alert("${dados.mensagem}");
        window.location.href = "/indices";
      </script>
    `);
  } catch (err) {
    console.error('Erro ao editar índice via API:', err);
    res.status(500).send(`
      <script>
        alert("Erro ao editar índice.");
        window.history.back();
      </script>
    `);
  }
});

app.get('/usuarios', async (req, res) => {
  const user = req.session.usuario;
  if (!user || user.id !== 'admin1') return res.redirect('/');
  const usuario = user.nome;

  try {
    const response = await axios.get('http://localhost:3000/usuarios');
    const { usuarios } = response.data;

    res.render('admin_usuarios', { usuario, usuarios });
  } catch (err) {
    console.error('Erro ao carregar usuários via API:', err);
    res.status(500).send('Erro ao carregar usuários.');
  }
});

app.get('/usuarios/editar/:nome', async (req, res) => {
  const user = req.session.usuario;
  if (!user || user.id !== 'admin1') return res.redirect('/');

  const nome = req.params.nome;

  try {
    const response = await axios.get(`http://localhost:3000/usuarios/editar/${nome}`);
    const usuario = response.data;

    res.render('admin_editar_usuario', {user, usuario });
  } catch (err) {
    console.error('Erro ao buscar usuário via API:', err);

    const erroMsg = err.response?.data?.erro || 'Erro ao carregar os dados do usuário.';
    res.status(500).send(`
      <script>
        alert("${erroMsg}");
        window.location.href = "/usuarios";
      </script>
    `);
  }
});

app.post('/usuarios/atualizar/:nome', async (req, res) => {
  const user = req.session.usuario;
  if (!user || user.id !== 'admin1') return res.redirect('/');

  const nome = req.params.nome;

  try {
    const response = await axios.post(`http://localhost:3000/usuarios/atualizar/${nome}`, req.body);
    const dados = response.data;

    if (dados.erro) {
      return res.send(`
        <script>
          alert("${dados.erro}");
          window.history.back();
        </script>
      `);
    }

    return res.send(`
      <script>
        alert("${dados.mensagem}");
        window.location.href = "/usuarios";
      </script>
    `);
  } catch (err) {
    console.error("Erro ao atualizar usuário via API:", err);
    res.status(500).send(`
      <script>
        alert("Erro ao atualizar o usuário.");
        window.history.back();
      </script>
    `);
  }
});

app.post('/usuarios/deletar/:id', async (req, res) => {
  const user = req.session.usuario;
  if (!user || user.id !== 'admin1') return res.redirect('/');

  const { id } = req.params;

  try {
    const response = await axios.post(`http://localhost:3000/usuarios/deletar/${id}`);
    const dados = response.data;

    if (dados.erro) {
      return res.send(`
        <script>
          alert("${dados.erro}");
          window.history.back();
        </script>
      `);
    }

    return res.send(`
      <script>
        alert("${dados.mensagem}");
        window.location.href = "/usuarios";
      </script>
    `);
  } catch (err) {
    console.error("Erro ao deletar usuário via API:", err);
    res.status(500).send(`
      <script>
        alert("Erro ao deletar o usuário.");
        window.history.back();
      </script>
    `);
  }
});

app.get('/usuarios/novo', async (req, res) => {
  const user = req.session.usuario;
  if (!user || user.id !== 'admin1') return res.redirect('/');
  const usuario = user.nome;
  res.render('admin_usuario_novo', { usuario});
});

app.post('/usuarios/novo', async (req, res) => {
  const user = req.session.usuario;
  if (!user || user.id !== 'admin1') return res.redirect('/');

  try {
    const response = await axios.post('http://localhost:3000/usuarios/novo', req.body);
    const dados = response.data;

    if (dados.erro) {
      return res.send(`
        <script>
          alert("${dados.erro}");
          window.history.back();
        </script>
      `);
    }

    return res.send(`
      <script>
        alert("${dados.mensagem}");
        window.location.href = "/usuarios";
      </script>
    `);
  } catch (err) {
    console.error("Erro ao criar usuário via API:", err);
    return res.status(500).send(`
      <script>
        alert("Erro ao criar o usuário.");
        window.history.back();
      </script>
    `);
  }
});


app.listen(8090, () => {
  console.log('Servidor rodando em http://localhost:8090');
});
