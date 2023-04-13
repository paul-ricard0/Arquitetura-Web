const mongoose = require('mongoose')
const movies = mongoose.model('movies', {
    titulo: String,
    sinopse: String,
    duracao: String,
    dataLancamento: String,
    imagem: String,
    categorias: String,
})
module.exports = movies


