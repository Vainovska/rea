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

router.get('/notification', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res
        .status(400)
        .json({ message: 'Token is required' })
    }

    console.log('Token notification:', token)
    const session = Session.get(token)
    if (!session) {
      return res
        .status(400)
        .json({ message: 'Invalid or expired token' })
    }

    console.log('Session notification:', session)
    const user = await User.getById(session.user.id)
    if (!user) {
      return res
        .status(400)
        .json({ message: 'User not found' })
    }

    console.log('User:', user)
    const notifications = await Notification.getList(
      user.id,
    )
    console.log('Notifications:', notifications)

    if (notifications.length === 0) {
      console.log(
        'No notifications found for user:',
        user.id,
      )
      return res
        .status(404)
        .json({ message: 'No notifications found' })
    }

    res.status(200).json(notifications)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    res
      .status(500)
      .json({ message: 'Failed to fetch notifications' })
  }
})

router.get('/balance', (req, res) => {
  try {
    const balance = Balance.getById(req.user.id)
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
