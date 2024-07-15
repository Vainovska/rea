// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()
const { Notification } = require('../class/notification')
const { User } = require('../class/user')
// Підключіть файли роутів
// Підключіть інші файли роутів, якщо є

// Об'єднайте файли роутів за потреби
// Використовуйте інші файли роутів, якщо є

router.post('/change-password', (req, res) => {
  try {
    const { newPassword } = req.body
    const hashedPassword = newPassword
    User.getById(req.user.id, {
      password: hashedPassword,
    })
    const notification = new Notification({
      userId: User.id,
      type: 'passwordChange',
      message: 'Ваш пароль успішно змінено.',
    })
    res
      .status(200)
      .json(
        { message: 'Password changed successfully' },
        notification,
      )
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Something went wrong' })
  }
})
router.get('/change-email', (req, res) => {
  try {
    const { newEmail } = req.body
    User.getById(req.user.id, { email: newEmail })
    const notification = new Notification({
      userId: User.id,
      type: 'emailChange',
      message: 'Ваша електронна пошта успішно змінена.',
    })
    res
      .status(200)
      .json(
        { message: 'Email changed successfully' },
        notification,
      )
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Something went wrong' })
  }
})

// Експортуємо глобальний роутер
module.exports = router
