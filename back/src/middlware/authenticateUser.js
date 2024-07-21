const { Session } = require('../class/session')

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token)
    return res
      .status(401)
      .json({ message: 'No token provided' })

  const session = Session.get(token)
  if (!session)
    return res
      .status(401)
      .json({ message: 'Invalid token' })

  req.user = session.user
  next()
}

module.exports = authenticateUser
