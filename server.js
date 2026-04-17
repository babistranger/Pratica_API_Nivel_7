const express = require('express');
const cors = require('cors');             //permite acesso por outro domínio
const morgan = require('morgan');         //registra todas as requisições recebidas
require('dotenv').config();               //carrega variáveis de ambiente do arquivo .env

const routes = require('./routes/routes_movies');       //inicia o arquivo rotas

const app = express();                    // instância express
const PORT = process.env.PORT || 3009;     //define a porta pro servidor primeiro pelo arquivo

// Middlewares - funções do meio do caminho entre a requisição e resposta
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rotas principais
app.use('/api', routes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'API de Filmes funcionando!',
    version: '1.0.0',
    port: PORT
  });
});

// Middleware de tratamento para rotas não encontradas
app.use((req, res) => {                   //request e response, erro http caso a rota não seja encontrada
  res.status(404).json({                 
    error: 'Rota não encontrada',
    path: req.originalUrl
  });
});

// Middleware de tratamento de erros - implementando função e variáveis para erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({         //500 - Erro internal server
    error: 'Erro interno do servidor',
    message: err.message
  });
});

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);   //Retorna mensagem de ok da requisição
});

module.exports = app;