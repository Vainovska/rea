const express = require('express')
const router = express.Router()
const { Transaction } = require('../class/transaction')
const { Session } = require('../class/session')

router.get('/transactions', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    console.log('Token is missing in request')
    return res
      .status(400)
      .json({ message: 'Token is required' })
  }

  try {
    const session = Session.get(token)
    if (!session) {
      return res
        .status(400)
        .json({ message: 'Invalid or expired token' })
    }

    const transactions = Transaction.getListByUserId(
      session.user.id,
    )
    res.status(200).json(transactions)
  } catch (err) {
    console.error('Error fetching transactions:', err)
    res
      .status(500)
      .json({ message: 'Internal Server Error' })
  }
})

router.get('/recive', function (req, res) {
  const token = req.headers.authorization?.split(' ')[1]
  return res.render('recive', {
    name: 'recive',
    title: 'Recive page',
    data: {},
    token,
  })
})

router.post('/recive', (req, res) => {
  try {
    const { amount, paymentMethod } = req.body
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      console.log('Token is missing in request')
      return res
        .status(400)
        .json({ message: 'Token is required' })
    }

    let session = Session.get(token)
    if (!session) {
      console.log('Invalid or expired token')
      return res
        .status(400)
        .json({ message: 'Invalid or expired token' })
    }

    // Перевірка, чи session є об'єктом
    if (typeof session === 'string') {
      try {
        session = JSON.parse(session)
      } catch (error) {
        console.error('Failed to parse session:', error)
        return res
          .status(500)
          .json({ message: 'Internal Server Error' })
      }
    }

    const user = session.user
    if (!user) {
      console.log('User not found')
      return res
        .status(404)
        .json({ message: 'User not found' })
    }

    const amountNumber = Number(amount)
    if (isNaN(amountNumber) || amountNumber <= 0) {
      console.log('Invalid amount:', amount)
      return res
        .status(400)
        .json({ message: 'Invalid amount' })
    }

    const transaction = Transaction.createTransaction({
      user: user.id,
      amount: amountNumber,
      type: 'Recive',
      paymentMethod,
      status: 'completed',
    })

    user.balance = (user.balance || 0) + amountNumber
    Session.save(token, session)

    console.log('User balance updated:', {
      userId: user.id,
      newBalance: user.balance,
    })

    res.status(200).json({
      message: 'Balance topped up successfully',
      transaction,
      newBalance: user.balance,
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
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      console.log('Token is missing in request')
      return res
        .status(400)
        .json({ message: 'Token is required' })
    }

    const session = Session.get(token)
    if (!session) {
      console.log('Invalid or expired token')
      return res
        .status(400)
        .json({ message: 'Invalid or expired token' })
    }

    const user = session.user
    if (!user) {
      console.log('User not found')
      return res
        .status(404)
        .json({ message: 'User not found' })
    }

    const amountNumber = parseFloat(amount)
    if (isNaN(amountNumber) || amountNumber <= 0) {
      console.log('Invalid amount:', amount)
      return res
        .status(400)
        .json({ message: 'Invalid amount' })
    }

    if (user.balance < amountNumber) {
      return res
        .status(400)
        .json({ message: 'Insufficient balance' })
    }

    const transaction = Transaction.createTransaction({
      user: user.id,
      amount: amountNumber,
      type: 'Send',
      status: 'completed',
      userEmail: email,
    })
    console.log('transaction', transaction)
    user.balance = user.balance - amountNumber

    Session.save(token, session)

    console.log('User balance updated:', {
      userId: user.id,
      newBalance: user.balance,
    })

    res.status(200).json({
      message: 'Transaction completed successfully',
      transaction,
      newBalance: user.balance,
    })
  } catch (error) {
    console.error('Error in /send:', error)
    res
      .status(500)
      .json({ message: 'Something went wrong' })
  }
})

router.get(
  '/transactions/:transactionId',
  async (req, res) => {
    try {
      const transactionId = Number(req.params.transactionId)
      if (isNaN(transactionId)) {
        return res
          .status(400)
          .json({ message: 'Invalid transaction ID' })
      }

      const transaction = Transaction.getById(transactionId)
      if (!transaction) {
        return res
          .status(404)
          .json({ message: 'Transaction not found' })
      }

      const token = req.headers.authorization?.split(' ')[1]
      if (!token) {
        return res
          .status(400)
          .json({ message: 'Token is required' })
      }

      const session = Session.get(token)
      if (!session) {
        return res
          .status(400)
          .json({ message: 'Invalid or expired token' })
      }

      if (
        transaction.user.toString() !==
        session.user.id.toString()
      ) {
        return res
          .status(403)
          .json({ message: 'Unauthorized' })
      }

      res.status(200).json(transaction)
    } catch (error) {
      console.error('Error fetching transaction:', error)
      res
        .status(500)
        .json({ message: 'Something went wrong' })
    }
  },
)

module.exports = router
