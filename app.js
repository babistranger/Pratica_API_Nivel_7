const express = require('express');       //intancia o express
const cors = require('cors');             //permite acesso por outro domínio
const morgan = require('morgan');         //registra todas as requisições recebidas

const routes = require('./routes/routes_movies');       //inicia o arquivo rotas

//Inicia a instância do pack express
const app = express();  

// Middlewares - funções do meio do caminho entre a requisição e resposta
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'API de Filmes funcionando!',
    version: '1.0.0',
  });
});

// Rotas principais
app.use('/api', routes);

// Middleware de tratamento para rotas não encontradas erro 404
app.use((req, res) => {                   //request e response, erro http caso a rota não seja encontrada
  res.status(404).json({                 
    error: 'Rota não encontrada',
    path: req.originalUrl
  });
});

// Middleware de tratamento de erros - implementando função e variáveis para erros 500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({         //500 - Erro internal server
    error: 'Erro interno do servidor',
    message: err.message
  });
});

module.exports = app;