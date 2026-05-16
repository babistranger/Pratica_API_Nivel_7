const Filme = require('../models/Filme.js');

// GET - Health check - verificando se a api está ok
const HealthCheck = (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
};

// GET - Listar todos os filmes
const listarFilmes = async (req, res) => {
  try {
  const filmes = await Filme.find();
  
  res.json({
    total: filmes.length,      //Somar o total de filmes do catálogo
    data: filmes               //Apresentar os dados
  });

  } catch (error) {
    res.status(500).json({
      error: 'Erro ao listar filmes',
      details: error.message
    });
  }
};

// GET - Buscar filme por id
const buscarFilmePorId = async (req, res) => {
  try {
  const id = parseInt(req.params.id);
  const filme = await Filme.findById(req.params.id);
  

  if (!filme) {
    return res.status(404).json({ 
      error: 'Filme não encontrado' 
    }); // Código 404 Erro muito usado - Not Found, requisição não encontrada
  }

  res.json(filme);

  } catch (error) {
    res.status(500).json({
      error: 'Erro ao buscar filme',
      details: error.message
    });
  }
};

// POST - Criar novo filme
const criarFilme = async (req, res) => {
  try {
  const { title, description, year, genres, image, video } = req.body;

  // Validação dos campos obrigatórios
  if (!title || !description || !year || !genres || !image || !video) {
    return res.status(400).json({                          //Erro de Requisição Ruim, código 400
      error: 'Todos os campos são obrigatórios: title, description, year, genres, image, video'   
    });
  }

  // Validação: genres deve ser um array
  if (!Array.isArray(genres)) {
    return res.status(400).json({              //Requisição Ruim, código 400
      error: 'O campo genres deve ser um array'        
    });
  }

  const ultimoFilme = await Filme.findOne().sort({ id: -1 });
  const novoId = ultimoFilme ? ultimoFilme.id + 1 : 1;       //Adicionando id automaticamente 

  const novoFilme = new Filme({
    id: novoId,
    title,
    description,
    year,
    genres,
    image,
    video
    });

  const filmeSalvo = await novoFilme.save();

  res.status(201).json(novoFilme);             //Requisição criada código 201
  
} catch (error) {
    res.status(500).json({
      error: 'Erro ao criar filme',
      details: error.message
    });
  }
};

// PUT - Atualizar filme
const atualizarFilme = async(req, res) => {
  try {
 
    const { genres } = req.body;

  //Verificando se o filme existe pelo id digitado
  // Convertendo id para número
    const id = Number(req.params.id);

    // Verificar se ID é válido
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'ID inválido'
      });
    }
    // Verificar se filme existe
    const filmeExiste = await Filme.findOne({ id });

    if (!filmeExiste) {
      return res.status(404).json({
        error: 'Filme não encontrado'
      });
    }

  // Validação para genres caso seja enviado
  if (genres && !Array.isArray(genres)) {
    return res.status(400).json({               //Erro 400 - Requisição Ruim
      error: 'O campo genres deve ser um array'
    });
  }

 const filmeAtualizado = await Filme.findOneAndUpdate(
      { id: Number(req.params.id) }, // filme procurado
      req.body,                      // novos dados
      {
        new: true,                   // retorna atualizado
        runValidators: true          // valida schema
      }
    );

 if (!filmeAtualizado) {
      return res.status(404).json({
        error: 'Filme não encontrado'
      });
    }

   res.json({
      message: 'Filme atualizado com sucesso',
      data: filmeAtualizado
    });

  } catch (error) {

    res.status(500).json({
      error: 'Erro ao atualizar filme',
      details: error.message
    });

  }
};

// DELETE - Remover filme
const deletarFilme = async (req, res) => {
  try {
    const filmeRemovido = await Filme.findOneAndDelete({
      id: Number(req.params.id)
    });

    if (!filmeRemovido) {
      return res.status(404).json({
        error: 'Filme não encontrado'
      });
    }
    res.json({
      message: 'Filme removido com sucesso',
      data: filmeRemovido
    });

  } catch (error) {

    res.status(500).json({
      error: 'Erro ao deletar filme',
      details: error.message
    });

  }
};

module.exports = {
  listarFilmes,
  buscarFilmePorId,
  criarFilme,
  atualizarFilme,
  deletarFilme,
  HealthCheck
};