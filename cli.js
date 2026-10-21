require('dotenv').config()
const { error } = require('node:console');
const { Sequelize, QueryTypes } = require('sequelize')
const sequalize = new Sequelize(process.env.DATABASE_URL, 
  {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

const main = async () => {
  try {
    await sequalize.authenticate()
    const blogs = await sequalize.query("SELECT * FROM blogs", { type: QueryTypes.SELECT })
    blogs.forEach(blog => console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`))
    sequalize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()