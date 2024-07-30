const jwt = require('jsonwebtoken')
const { User } = require('./models/User') // Adjust the path to your User model

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res
      .status(401)
      .send({ message: 'Authorization header missing' })
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    return res
      .status(401)
      .send({ message: 'Token missing' })
  }

  try {
    const decoded = jwt.verify(token, 'your_secret_key') // Replace 'your_secret_key' with your actual secret key
    const user = await User.getById(decoded.id)
    if (!user) {
      return res
        .status(401)
        .send({ message: 'User not found' })
    }
    req.user = user
    next()
  } catch (error) {
    return res
      .status(401)
      .send({ message: 'Invalid token' })
  }
}

module.exports = authMiddleware
