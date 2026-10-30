const router = require('express').Router()
const bcrypt = require('bcrypt')

const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      include: {
        model: Blog,
        as: 'authoredBlogs',
      }
    })
  res.json(users)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const body = req.body

    const passwordHash = await bcrypt.hash(body.password, 10)

    const user = await User.create({
      username: body.username,
      name: body.name,
      password: passwordHash
    })
    res.json(user)
  } catch (error) {
    next(error)
  }
})


router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      include: {
        model: Blog,
        as: 'authoredBlogs',
      },
    })

    res.json(users)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: {
        exclude: ['password'],
      },
      include: {
        model: Blog,
        as: 'readingList',
        attributes: [
          'id',
          'url',
          'title',
          'author',
          'likes',
          'year',
        ],
        through: {
          attributes: [],
        },
      },
    })

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      })
    }

    const userData = user.toJSON()

    userData.readings = userData.readingList
    delete userData.readingList

    res.json(userData)
  } catch (error) {
    next(error)
  }
})


router.put('/:username', async (req, res) => {
  const updates = req.body;
  
  try {
    const user = await User.findOne({where : {username: req.params.username }})
    if (!user) {
      return res.status(404).json({ error: 'User not found'})
    }

    await User.update(req.body, {where: {username: req.params.username}})
    
    const updatedUser = await User.findOne({where: {username: req.params.username}})

    res.json(updatedUser)
  }catch(error) {
    console.log(error.message)
  }
})

module.exports = router