
require('dotenv').config()

const express = require('express')
const app = express()
const blogsRouter = require('./controllers/blogs')
const { sequelize } = require('./util/db')
const { Blog } = require('./models')

app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use((req, res, next) => {
  console.error(error)

  res.status(400).json({ error: error.message })
})



const PORT = process.env.PORT || 3001

const start = async () => {
  try {
    await sequelize.authenticate()
    await Blog.sync()

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Unable to start server:', error)
    process.exitCode = 1
  }
}

start()
