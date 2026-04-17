// Simulação de banco de dados em memória
let filmes = [
  {
    id: 1,
    title: 'Interestelar',
    description: 'Uma equipe de exploradores viaja através de um buraco de minhoca no espaço.',
    year: 2014,
    genres: ['Ficção Científica', 'Drama', 'Aventura'],
    image: 'https://exemplo.com/interestelar.jpg',
    video: 'https://exemplo.com/interestelar-trailer.mp4'
  },
  {
    id: 2,
    title: 'A Origem',
    description: 'Um ladrão que invade os sonhos das pessoas para roubar segredos.',
    year: 2010,
    genres: ['Ação', 'Ficção Científica', 'Suspense'],
    image: 'https://exemplo.com/a-origem.jpg',
    video: 'https://exemplo.com/a-origem-trailer.mp4'
  }
];

// GET - Health check - verificando se a api está ok
const HealthCheck = (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
};

// GET - Listar todos os filmes
const listarFilmes = (req, res) => {
  res.json({
    total: filmes.length,      //Somar o total de filmes do catálogo
    data: filmes               //Apresentar os dados
  });
};

// GET - Buscar filme por id
const buscarFilmePorId = (req, res) => {
  const id = parseInt(req.params.id);
  const filme = filmes.find(f => f.id === id);

  if (!filme) {
    return res.status(404).json({ error: 'Filme não encontrado' }); // Código 404 Erro muito usado - Not Found, requisição não encontrada
  }

  res.json(filme);
};

// POST - Criar novo filme
const criarFilme = (req, res) => {
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

  const novoFilme = {
    id: filmes.length > 0 ? filmes[filmes.length - 1].id + 1 : 1,        //adicionar o id automaticamente
    title,
    description,
    year,
    genres,
    image,
    video
  };

  filmes.push(novoFilme);
  res.status(201).json(novoFilme);             //Requisição criada código 201
};

// PUT - Atualizar filme
const atualizarFilme = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, year, genres, image, video } = req.body;
  const index = filmes.findIndex(f => f.id === id);     //Posição do filme no index do array, se não encontrar retorna -1

  //Verificando se o filme existe pelo id digitado
  if (index === -1) {                  
    return res.status(404).json({ error: 'Filme não encontrado' });    //Erro 404 requisição não encontrada
  }

  // Validação para genres caso seja enviado
  if (genres && !Array.isArray(genres)) {
    return res.status(400).json({               //Erro 400 - Requisição Ruim
      error: 'O campo genres deve ser um array'
    });
  }

  //Atualizando o array de filmes
  filmes[index] = {
    ...filmes[index],
    ...(title && { title }),
    ...(description && { description }),
    ...(year && { year }),
    ...(genres && { genres }),
    ...(image && { image }),
    ...(video && { video })
  };

  res.json(filmes[index]);
};

// DELETE - Remover filme
const deletarFilme = (req, res) => {
  const id = parseInt(req.params.id);      //Convertendo string em número
  const index = filmes.findIndex(f => f.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Filme não encontrado' });     //Erro 404 requisição não encontrada
  }

  const removido = filmes.splice(index, 1);
  res.json({
    message: 'Filme removido com sucesso',
    data: removido[0]
  });
};

module.exports = {
  listarFilmes,
  buscarFilmePorId,
  criarFilme,
  atualizarFilme,
  deletarFilme,
  HealthCheck
};