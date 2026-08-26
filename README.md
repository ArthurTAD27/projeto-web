# 💧 Sistema de Monitoramento de Qualidade da Água

Aplicação Web desenvolvida como projeto acadêmico para o monitoramento e avaliação da qualidade da água, permitindo o gerenciamento de amostras, análises e usuários com diferentes níveis de acesso.

O sistema foi desenvolvido com foco na **separação de responsabilidades**, **controle de acesso** e **gestão dinâmica de dados**, simulando o fluxo entre coletores, técnicos e administradores.

## 👥 Perfis de Usuário

A aplicação possui três perfis, cada um com permissões e funcionalidades específicas:

* **Coletor:** realiza o cadastro de amostras e acompanha os resultados das análises.
* **Técnico:** analisa as amostras coletadas, atribui escores às variáveis e registra os resultados técnicos.
* **Administrador:** gerencia usuários e índices de qualidade da água.

O controle de acesso restringe cada rota de acordo com o perfil autenticado.

## ⚙️ Funcionalidades

* 🔐 Autenticação e controle de acesso por perfil
* 👤 Gerenciamento de usuários
* 💧 Cadastro e gerenciamento de amostras
* 📊 Análise de variáveis de qualidade da água
* 📋 Criação, edição e exclusão de índices de qualidade
* 🔄 Operações CRUD
* 📄 Geração dinâmica de páginas utilizando EJS
* 🔌 Comunicação entre servidores através de API
* ⚡ Requisições HTTP síncronas e assíncronas com `fetch()`
* ♿ Recursos de acessibilidade

  * Modo de alto contraste
  * Ajuste do tamanho da fonte
  * Persistência das preferências utilizando Local Storage

## 🛠️ Tecnologias

* **JavaScript**
* **Node.js**
* **Express**
* **EJS**
* **Axios**
* **HTML5**
* **CSS3**
* **JSON**
* **Express Session**

## 🏗️ Arquitetura

O backend foi dividido em dois servidores:

### Servidor Web

O `server.js` é responsável pela comunicação direta com o cliente, renderização das páginas utilizando EJS, disponibilização de arquivos estáticos e gerenciamento das sessões.

### API

O `api-server.js` funciona como uma API independente, responsável pelo processamento e manipulação dos dados.

A comunicação entre os dois servidores é realizada através de requisições HTTP utilizando **Axios**, mantendo a manipulação dos dados separada da camada de apresentação e das sessões.

```text
Cliente
   │
   ▼
server.js
   │
   │ HTTP / Axios
   ▼
api-server.js
   │
   ▼
Manipulação dos dados
   │
   ▼
Arquivos JSON
```

## 📂 Armazenamento de Dados

Nesta versão do projeto, os dados são armazenados em arquivos **JSON**, incluindo informações sobre usuários, amostras e índices de qualidade.

A utilização de JSON permitiu trabalhar com dados dinâmicos durante o desenvolvimento e os testes da aplicação.

## ♿ Acessibilidade

A aplicação possui recursos voltados à acessibilidade, incluindo:

* Tema padrão e tema de alto contraste;
* Aumento e redução do tamanho das fontes;
* Persistência das preferências do usuário através do Local Storage.

## 📚 Contexto do Projeto

O monitoramento da qualidade da água é importante para acompanhar condições físicas, químicas e biológicas das amostras e auxiliar na avaliação de sua qualidade.

A aplicação busca representar um fluxo no qual **coletores registram dados de campo, técnicos realizam as análises e administradores gerenciam usuários e índices de qualidade**.

## 🎓 Projeto Acadêmico

Projeto desenvolvido como parte da disciplina de **Desenvolvimento Web** na **Universidade Federal do Ceará (UFC)**.
