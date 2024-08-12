const express = require('express')
const router = express.Router()
const { Notification } = require('../class/notification')
const { Balance } = require('../class/balance')
const { User } = require('../class/user')
const { Session } = require('../class/session')

// Import route modules
const auth = require('./auth')
const setting = require('./setting')
const transaction = require('./transaction')

// Use imported route modules
router.use('/', auth)
router.use('/', setting)
router.use('/', transaction)

// Example route
router.get('/', (req, res) => {
  res.status(200).json('Hello World')
})

// Protected routes

router.post('/notification', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  console.log(
    'Authorization header:',
    req.headers.authorization,
  )

  if (!token) {
    console.log('Token is missing in request')
    return res
      .status(400)
      .json({ message: 'Token is required' })
  }

  try {
    const session = Session.get(token)
    console.log('Session:', session)

    if (!session) {
      console.log('Invalid or expired token')
      return res
        .status(400)
        .json({ message: 'Invalid or expired token' })
    }

    const userId = session.user.id
    if (!userId) {
      console.log('User not found')
      return res
        .status(400)
        .json({ message: 'User not found' })
    }
    const notificationList = Notification.getList()
    const notifications = notificationList.filter(
      (notification) => notification.userId === userId,
    )
    console.log('Filtered notifications:', notifications)

    if (!notifications || notifications.length === 0) {
      console.log(
        'No notifications found for user:',
        userId,
      )
      return res.status(200).json({ list: [] })
    }

    console.log('Notifications list:', notifications)
    return res.status(200).json({
      list: notifications.map((notification) => ({
        id: notification.id,
        text: notification.text,
        type: notification.type,
        date: notification.date,
      })),
    })
  } catch (err) {
    console.error(
      'Error handling notification request:',
      err,
    )
    return res.status(400).json({ message: err.message })
  }
})

router.get('/balance', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  console.log(
    'Authorization header:',
    req.headers.authorization,
  )

  if (!token) {
    console.log('Token is missing in request')
    return res
      .status(400)
      .json({ message: 'Token is required' })
  }
  try {
    const session = Session.get(token)
    console.log('Session:', session)

    if (!session) {
      console.log('Invalid or expired token')
      return res
        .status(400)
        .json({ message: 'Invalid or expired token' })
    }

    const userId = session.user.id
    if (!userId) {
      console.log('User not found')
      return res
        .status(400)
        .json({ message: 'User not found' })
    }

    const balance = User.getByBalance(balance)
    if (!balance) {
      return res
        .status(404)
        .json({ message: 'Balance not found' })
    }
    res.status(200).json(balance)
  } catch (error) {
    console.error('Error fetching balance:', error)
    res
      .status(500)
      .json({ message: 'Failed to fetch balance' })
  }
})

// Export the main router
module.exports = router
