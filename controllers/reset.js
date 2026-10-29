const { Blog, User } = require('../models')

const router = require('express').Router()

router.post('/', async (req, res, next) => {
  try {
    await Blog.destroy({
      where: {},
      truncate: true,
      cascade: true
    })

    await User.destroy({
      where: {},
      truncate: true,
      cascade: true
    })

    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router