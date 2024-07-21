const express = require('express')
const router = express.Router()
const { Transaction } = require('../class/transaction')
const { User } = require('../class/user')
const { Notification } = require('../class/notification')
const authenticateUser = require('../middlware/authenticateUser')

// Helper function to create transaction and notification
// const createTransactionAndNotification = async (
//   user,
//   type,
//   amount,
//   message,
// ) => {
//   const transaction = new Transaction({
//     user: user.id,
//     type,
//     amount,
//     status: 'completed',
//   })
//   await transaction.save()

//   const notification = new Notification({
//     user: user.id,
//     message,
//   })
//   await notification.save()

//   return { transaction, notification }
// }

// Use authentication middleware for all routes in this file
router.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.getList() // Assuming getList() is an async function
    res.json(transactions)
  } catch (err) {
    console.error('Error fetching transactions:', err)
    res
      .status(500)
      .json({ message: 'Internal Server Error' })
  }
})
router.post('/recive', (req, res) => {
  try {
    const { amount, paymentMethod } = req.body

    const transaction = new Transaction({
      user: req.user.id,
      type: 'recive',
      amount,
      paymentMethod,
      status: 'completed',
    })
    transaction.save()

    req.user.balance += amount
    req.user.save()

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
    console.error('Error in /recive:', error)
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

    const senderTransaction = new Transaction({
      user: req.user.id,
      type: 'send',
      amount,
      status: 'completed',
    })
    senderTransaction.save()

    const senderNotification = new Notification({
      user: req.user.id,
      message: `You sent ${amount} to ${email}`,
    })
    senderNotification.save()

    req.user.balance -= amount
    req.user.save()

    const recipientTransaction = new Transaction({
      user: recipient.id,
      type: 'recive',
      amount,
      status: 'completed',
    })
    recipientTransaction.save()

    const recipientNotification = new Notification({
      user: recipient.id,
      message: `You received ${amount} from ${req.user.email}`,
    })
    recipientNotification.save()

    recipient.balance += amount
    recipient.save()

    res
      .status(200)
      .json({ message: 'Transfer completed successfully' })
  } catch (error) {
    console.error('Error in /send:', error)
    res
      .status(500)
      .json({ message: 'Something went wrong' })
  }
})

router.get('/:transactionId', async (req, res) => {
  try {
    const transaction = await Transaction.getById(
      req.params.transactionId,
    )

    if (!transaction) {
      return res
        .status(404)
        .json({ message: 'Transaction not found' })
    }

    if (
      transaction.user.toString() !== req.user.id.toString()
    ) {
      return res
        .status(403)
        .json({ message: 'Unauthorized' })
    }

    res.status(200).json(transaction)
  } catch (error) {
    console.error('Error in /:transactionId:', error)
    res
      .status(500)
      .json({ message: 'Something went wrong' })
  }
})
module.exports = router
