// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()
const { Notification } = require('../class/notification')
const { User } = require('../class/user')
const { Transaction } = require('../class/transaction')
// Підключіть файли роутів
// Підключіть інші файли роутів, якщо є

// Об'єднайте файли роутів за потреби
// Використовуйте інші файли роутів, якщо є

router.post('/recive', (req, res) => {
  try {
    const { amount, paymentMethod } = req.body

    // Створення нової транзакції
    const transaction = new Transaction({
      user: req.user.id,
      type: 'recive',
      amount,
      paymentMethod,
      status: 'completed',
    })
    transaction.save()

    // Оновлення балансу користувача
    req.user.balance += amount
    req.user.save()

    // Створення нової нотифікації
    const notification = new Notification({
      user: req.user.id,
      message: `Balance topped up by ${amount} using ${paymentMethod}`,
    })
    notification.save()

    res
      .status(200)
      .json(
        { message: 'Balance topped up successfully' },
        transaction,
        notification,
      )
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong' })
  }
})
router.get('/send', (req, res) => {
  try {
    const { email, amount } = req.body
    const recipient = User.getByEmail({ email })

    if (!recipient) {
      return res
        .status(404)
        .json({ message: 'Recipient not found' })
    }

    if (req.user.balance < amount) {
      return res
        .status(400)
        .json({ message: 'Insufficient balance' })
    }

    // Створення транзакції для відправника
    const senderTransaction = new Transaction({
      user: req.user.id,
      type: 'send',
      amount,
      status: 'completed',
    })
    senderTransaction.save()

    // Створення нотифікації для відправника
    const senderNotification = new Notification({
      user: req.user.id,
      message: `You sent ${amount} to ${email}`,
    })
    senderNotification.save()

    // Оновлення балансу відправника
    req.user.balance -= amount
    req.user.save()

    // Створення транзакції для одержувача
    const recipientTransaction = new Transaction({
      user: recipient.id,
      type: 'recive',
      amount,
      status: 'completed',
    })
    recipientTransaction.save()

    // Створення нотифікації для одержувача
    const recipientNotification = new Notification({
      user: recipient._id,
      message: `You received ${amount} from ${req.user.email}`,
    })
    recipientNotification.save()

    // Оновлення балансу одержувача
    recipient.balance += amount
    recipient.save()

    res
      .status(200)
      .json({ message: 'Transfer completed successfully' })
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Something went wrong' })
  }
})
router.get('/:transactionId', (req, res) => {
  try {
    const transaction = Transaction.getById(
      req.params.transactionId,
    )

    if (!transaction) {
      return res
        .status(400)
        .json({ message: 'Transaction not found' })
    }

    if (
      transaction.user.toString() !== req.user.id.toString()
    ) {
      return res
        .status(400)
        .json({ message: 'Unauthorized' })
    }

    res.status(200).json(transaction)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong' })
  }
})

// Експортуємо глобальний роутер
module.exports = router
