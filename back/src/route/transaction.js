// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()
const { Notification } = require('../class/notification')
const { User } = require('../class/user')
const { Transaction } = require('../class/transaction')
const { Session } = require('../class/session')
// Підключіть файли роутів
// Підключіть інші файли роутів, якщо є

// Об'єднайте файли роутів за потреби
// Використовуйте інші файли роутів, якщо є
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

router.use(authenticateUser)

router.post('/recive', (req, res) => {
  try {
    const { amount, paymentMethod } = req.body

    // Create a new transaction
    const transaction = new Transaction({
      user: req.user.id,
      type: 'recive',
      amount,
      paymentMethod,
      status: 'completed',
    })
    transaction.save()

    // Update user's balance
    req.user.balance += amount
    req.user.save()

    // Create a new notification
    const notification = new Notification({
      user: req.user.id,
      message: `Balance topped up by ${amount} using ${paymentMethod}`,
    })
    notification.save()

    res.status(200).json({
      message: 'Balance topped up successfully',
      transaction,
      notification,
    })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong' })
  }
})

router.post('/send', (req, res) => {
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

    // Create transaction for sender
    const senderTransaction = new Transaction({
      user: req.user.id,
      type: 'send',
      amount,
      status: 'completed',
    })
    senderTransaction.save()

    // Create notification for sender
    const senderNotification = new Notification({
      user: req.user.id,
      message: `You sent ${amount} to ${email}`,
    })
    senderNotification.save()

    // Update sender's balance
    req.user.balance -= amount
    req.user.save()

    // Create transaction for recipient
    const recipientTransaction = new Transaction({
      user: recipient.id,
      type: 'recive',
      amount,
      status: 'completed',
    })
    recipientTransaction.save()

    // Create notification for recipient
    const recipientNotification = new Notification({
      user: recipient._id,
      message: `You received ${amount} from ${req.user.email}`,
    })
    recipientNotification.save()

    // Update recipient's balance
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

    // Ensure the requester owns the transaction
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
