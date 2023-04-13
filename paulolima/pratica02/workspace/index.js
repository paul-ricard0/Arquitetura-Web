const express = require('express')
const mongoose = require('mongoose')
const movies = require('./models/movies')


const app = express()
app.use(
    express.urlencoded({
        extended: true,
    }),
)
app.use(express.json())

app.get("/", (req, res) => {
    res.json({ message: "Oi Express!" });
   });

mongoose.connect(
   'mongodb+srv://paulolima:admin@cluster0.yd4cjnw.mongodb.net/test',
).then(() => {
   console.log('Conectou ao banco!')
   app.listen(3000)
}).catch((err) => console.log(err))

app.post('/movies', async (req, res) => {
    const {titulo, sinopse, duracao,  dataLancamento, imagem, categorias} = req.body
    const Movies = {
        titulo,
        sinopse,
        duracao,
        dataLancamento,
        imagem,
        categorias
    }
    try {
        await movies.create(Movies)
        res.status(201).json({ message: 'Filme inserida no sistema com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})


app.get('/movies', async (req, res) => {
    try {
        const people = await movies.find()
        res.status(200).json(people)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

app.get('/movies/:id', async (req, res) => {
    const id = req.params.id
    try {
        const movies = await movies.findOne({ _id: id })
        if (!movies) {
            res.status(422).json({ message: 'filme não encontrado!' })
            return
        }
        res.status(200).json(movies)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})
   
app.patch('/movies/:id', async (req, res) => {
    const id = req.params.id
    const {titulo, sinopse, duracao,  dataLancamento, imagem, categorias} = req.body
    const movies = {
        titulo,
        sinopse,
        duracao,
        dataLancamento,
        imagem,
        categorias,
    }
    try {
        const updatedmovies = await movies.updateOne({ _id: id }, movies)
        if (updatedmovies.matchedCount === 0) {
            res.status(422).json({ message: 'Filme não encontrado!' })
            return
        }
        res.status(200).json(movies)
    } catch (error) {
    res.status(500).json({ erro: error })
    }
})


app.delete('/movies/:id', async (req, res) => {
    const id = req.params.id
    const Movies = await movies.findOne({ _id: id })
    if (!Movies) {
        res.status(422).json({ message: 'Usuário não encontrado!' })
        return
    }
    try {
        await movies.deleteOne({ _id: id })
        res.status(200).json({ message: 'Usuário removido com sucesso!' })
    }catch (error) {
        res.status(500).json({ erro: error })
    }
})