require('dotenv').config();               //carrega variáveis de ambiente do arquivo .env
const app = require('./app');

const PORT = process.env.PORT || 3009;     //define a porta pro servidor primeiro pelo arquivo

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(` Servidor rodando em http://localhost:${PORT}`);
});