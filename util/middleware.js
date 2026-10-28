const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')){
    req.token = authorization.substring(7)
  } else {
    req.token = null
  }

  next()
}

const userExtractor = (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, SECRET)

    if(!decodedToken.id) {
      return res.status(401).json({ error: 'token invalid'})
    }

    req.decodedToken = decodedToken
    next()
  } catch (error) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }
}

module.exports = { tokenExtractor, userExtractor }