const router = require('express').Router()

const { Blog } = require('../models')


const blogFinder = async (req, res, next) => {
  try {
    req.blog = await Blog.findByPk(req.params.id)
    if (!req.blog) {
      return res.status(404).end()
    }
    next()
  } catch (error) {
    next(error)
  }
  
}


router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

router.post('/', async (req, res, next) => {
  try {
    const blog = await Blog.create({... req.body, date: new Date()})
    res.json(blog)
  } catch(error) {
    next(error)
  }
})

router.get('/:id', blogFinder, async (req, res) => {
  res.json(req.blog)
})

router.delete('/:id', blogFinder, async (req, res) => {
  await req.blog.destroy()
  res.status(204).end()
})

router.put('/:id',blogFinder, async (req, res, next) => {
  try {
    if(req.body.likes !== undefined) {
      req.blog.likes = req.body.likes

      await req.blog.save()
      res.json(req.blog)
    } else {
      res.status(400).json({ error: 'Like field is required'})
    }
  }catch (error) {
    next(error)
  }
})

module.exports = router