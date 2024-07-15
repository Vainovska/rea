// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()
const { Notification } = require('../class/notification')
const { Balance } = require('../class/balance')
// Підключіть файли роутів
const auth = require('./auth')
const setting = require('./setting')
const transaction = require('./transaction')
// Підключіть інші файли роутів, якщо є

// Об'єднайте файли роутів за потреби
router.use('/', auth)
router.use('/', setting)
router.use('/', transaction)
// Використовуйте інші файли роутів, якщо є

router.get('/', (req, res) => {
  res.status(200).json('Hello World')
})
router.get('/notification', (req, res) => {
  try {
    const notification = Notification.getById(req.user.id)
    res.status(200).json(notification)
  } catch (error) {
    res.status(400).json({ message: 'немає жодних змін' })
  }
})
router.get('/balance', (req, res) => {
  try {
    const balance = Balance.getById(req.user.id)
    if (!balance) {
      return res
        .status(400)
        .json({ message: 'Balance not found' })
    }
    res.status(200).json(balance)
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Something went wrong' })
  }
})

// Експортуємо глобальний роутер
module.exports = router
