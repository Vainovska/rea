// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()
const { Notification } = require('../class/notification')
const { User } = require('../class/user')
const { Session } = require('../class/session')
// Підключіть файли роутів
// Підключіть інші файли роутів, якщо є

// Об'єднайте файли роутів за потреби
// Використовуйте інші файли роутів, якщо є
router.post('/change-password', (req, res) => {
  console.log(
    'Authorization header:',
    req.headers.authorization,
  )
  const { oldPassword, newPassword } = req.body
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res
      .status(400)
      .json({ message: 'Token is required' })
  }

  try {
    const session = Session.get(token)
    console.log('Session:', session)
    if (!session) {
      return res
        .status(400)
        .json({ message: 'Invalid or expired token' })
    }

    const user = User.getById(session.user.id)
    if (!user) {
      return res
        .status(400)
        .json({ message: 'User not found' })
    }

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: 'Old and new passwords are required',
      })
    }

    if (!user.verifyPassword(oldPassword)) {
      return res
        .status(400)
        .json({ message: 'Invalid old password' })
    }

    user.password = newPassword
    user.save()

    const notification = Notification.create(
      user.id,
      'Warning',
      'Ваш пароль успішно змінено.',
    )
    console.log('New notification created:', notification)
    res.status(200).json({
      message: 'Password changed successfully',
      notification,
    })
  } catch (error) {
    console.error('Error in password change:', error)
    res
      .status(400)
      .json({ message: 'Something went wrong' })
  }
})
router.post('/change-email', (req, res) => {
  const { email, password } = req.body
  console.log(
    'Authorization header:',
    req.headers.authorization,
  )
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res
      .status(400)
      .json({ message: 'Token is required' })
  }

  try {
    const session = Session.get(token)
    console.log('Session:', session)
    if (!session) {
      return res
        .status(400)
        .json({ message: 'Invalid or expired token' })
    }

    const user = User.getById(session.user.id)
    if (!user) {
      return res
        .status(400)
        .json({ message: 'User not found' })
    }

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      })
    }

    const isPasswordValid = user.verifyPassword(password)
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: 'Invalid password' })
    }

    user.email = email
    user.save()
    const notification = Notification.create(
      user.id,
      'Warning',
      'Ваша електронна пошта успішно змінена.',
    )

    console.log('New notification created:', notification)

    res.status(200).json({
      message: 'Email changed successfully',
      notification,
    })
  } catch (error) {
    console.error('Error in email change:', error)
    res
      .status(500)
      .json({ message: 'Something went wrong' })
  }
})

// Експортуємо глобальний роутер
module.exports = router
