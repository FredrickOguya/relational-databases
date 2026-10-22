require('dotenv').config()
const { error } = require('node:console');
const {  QueryTypes, Model, DataTypes, Sequelize } = require('sequelize')
const express = require('express')
const app = express()

const sequelize = new Sequelize(process.env.DATABASE_URL, 
  {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

const main = async () => {
  try {
    await sequelize.authenticate()
    const blogs = await sequelize.query("SELECT * FROM blogs", { type: QueryTypes.SELECT })
    blogs.forEach(blog => console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`))
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

app.use(express.json())

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll()
  console.log(JSON.stringify(blogs))
  res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {
  try {
    const blog = await Blog.create(req.body)
    return res.json(blog)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const id =  req.params.id
    const blog =await Blog.findByPk(id)

    if (blog){
      await blog.destroy()
      res.status(204).end()
    } else {
      res.status(404).json({ error: 'The blog could not be found' })
    }
  } catch(error) {
    res.status(400).json({ error: error.message})
  }
  
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server runnign on port ${PORT}`)
})

main()