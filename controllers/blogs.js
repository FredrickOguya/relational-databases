const router = require('express').Router()
const { Blog, User } = require('../models')
const { userExtractor } = require('../util/middleware')


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

router.post('/',userExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)

    if(!user) {
      return res.status(401).json({ error: 'user not found'})
    }
    const blog = await Blog.create({... req.body, userId: user.id, date: new Date()})
    res.json(blog)
  } catch(error) {
    next(error)
  }
})

router.get('/:id', blogFinder, async (req, res) => {
  res.json(req.blog)
})

router.delete('/:id', userExtractor, blogFinder, async (req, res, next) => {
 try {
  if (req.blog.userId !== req.decodedToken.id) {
    return res.status(403).json({
      error: 'only the user who added the blog can delete it '
    })
  }
  await req.blog.destroy()
  res.status(204).end()
 } catch (error) {
  next(error)
 }
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