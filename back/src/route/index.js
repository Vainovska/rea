const express = require('express')
const router = express.Router()
const { Notification } = require('../class/notification')
const { Balance } = require('../class/balance')

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

router.get('/notification', (req, res) => {
  try {
    const notifications = Notification.getByUserId(
      req.user.id,
    )
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
