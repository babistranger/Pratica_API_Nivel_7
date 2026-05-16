const mongoose = require('mongoose');

const conectarBanco = async () => {
  try {

    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB conectado');

  } catch (error) {

    console.log('Erro ao conectar MongoDB');
    console.log(error);

  }
};

module.exports = conectarBanco;