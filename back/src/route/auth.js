// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

const { User } = require('../class/user')
const { Confirm } = require('../class/confirm')
const { Session } = require('../class/session')
const { Notification } = require('../class/notification')
const user = {
  email: 'test1@mail.com',
  isConfirm: false,
  id: 1,
}

// Creating a new session for the user
const newSession = Session.create(user)
console.log('New Session:', newSession)

// Retrieving the session using the token
const retrievedSession = Session.get(newSession.token)
console.log('Retrieved Session:', retrievedSession)

// Updating the session
retrievedSession.user.isConfirm = true
Session.save(newSession.token, retrievedSession)

// Verifying the session is updated
const updatedSession = Session.get(newSession.token)
console.log('Updated Session:', updatedSession)

// ================================================================
router.get('/signup', function (req, res) {
  return res.render('signup', {
    name: 'signup',
    title: 'Signup page',
    data: {},
  })
})
router.post('/signup', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    const existingUser = User.getByEmail(email)
    if (existingUser) {
      return res.status(400).json({
        message:
          'Користувач с таким e-mail вже зареєстрований',
      })
    }

    const newUser = User.create({ email, password })
    console.log(newUser)
    const session = Session.create(newUser)
    console.log(session.token)
    Confirm.create(newUser.email)
    const notification = new Notification({
      userId: newUser.id,
      type: 'signup',
      message: 'Ви успішно створили аккаунт.',
    })

    return res.status(200).json({
      message: 'Користувач успішно зареєстрований',
      user: {
        id: newUser.id,
        email: newUser.email,
        isConfirm: newUser.isConfirm,
      },
      session: session.token,
      notification,
    })
  } catch (error) {
    console.error('Error during signup:', error)
    return res.status(500).json({
      message: `Помилка сервера: ${error.message}`,
    })
  }
})

router.get('/signup-confirm', function (req, res) {
  const { renew, email } = req.query
  console.log('Renew request:', renew, 'Email:', email)
  if (renew && email) {
    Confirm.create(email)
    return res.status(200).json({
      message: 'Confirmation code resent to email',
    })
  }
  return res.render('signup-confirm', {
    name: 'signup-confirm',
    title: 'Signup confirm page',
    data: {},
  })
})
router.post('/signup-confirm', function (req, res) {
  const { code, token } = req.body
  console.log({ code, token })

  if (!code || !token) {
    return res.status(400).json({
      message: `Помилка. Обов'язкові поля відсутні`,
    })
  }

  try {
    const session = Session.get(token)
    console.log('Session:', session)

    if (!session) {
      return res.status(400).json({
        message: `Помилка. Ви не увійшли в аккаунт`,
      })
    }

    console.log('Provided code:', code)
    const email = Confirm.getData(code)
    console.log('Returned email:', email)

    if (!email) {
      return res.status(400).json({
        message: `Код не існує`,
      })
    }

    if (email !== session.user.email) {
      return res.status(400).json({
        message: `Код не дійсний`,
      })
    }

    const user = User.getByEmail(session.user.email)
    user.isConfirm = true
    session.user.isConfirm = true
    Session.save(token, session)
    const notification = new Notification({
      userId: user.id,
      type: 'signupConfirm',
      message: 'Ви успішно підтвердили свою пошту.',
    })

    return res.status(200).json({
      message: 'Ви підтвердили свою пошту',
      session,
      notification,
    })
  } catch (err) {
    console.error('Server error:', err)
    return res
      .status(500)
      .json({ message: `Помилка сервера: ${err.message}` })
  }
})

router.get('/signin', function (req, res) {
  return res.render('signin', {
    name: 'signin',
    title: 'Sign in page',
    data: {},
  })
})
router.post('/signin', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    const user = User.getByEmail(email)
    if (!user) {
      return res.status(400).json({
        message:
          'Помилка. Користувач с таким email не існує',
      })
    }
    if (user.password !== password) {
      return res
        .status(400)
        .json({ message: 'Не вірний пароль' })
    }

    const session = Session.create(user)
    const notification = new Notification({
      userId: user.id,
      type: 'signin',
      message: 'Ви успішно увійшли в акаунт.',
    })

    return res.status(200).json({
      message: 'Ви увійшли',
      session,
      notification,
    })
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Помилка сервера: ${err.message}` })
  }
})
router.get('/recovery', function (req, res) {
  return res.render('recovery', {
    name: 'recovery',
    title: 'Recovery page',
    data: {},
  })
})
router.post('/recovery', function (req, res) {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({
      message: `Помилка. Обов'язкові поля відсутні`,
    })
  }
  try {
    const user = User.getByEmail(email)
    if (!user) {
      return res.status(400).json({
        message:
          'Користувач с таким e-mail не заєрестрований',
      })
    }
    Confirm.create(email)
    return res.status(200).json({
      message: 'Код для відновлення паролю відправлений',
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})
router.get('/recovery-confirm', function (req, res) {
  return res.render('recovery-confirm', {
    name: 'recovery-confirm',
    title: 'Recovery confirm page',
    data: {},
  })
})
router.post('/recovery-confirm', function (req, res) {
  const { password, code } = req.body
  console.log(password, code)
  if (!code || !password) {
    return res.status(400).json({
      message: `Помилка. Обов'язкові поля відсутні`,
    })
  }
  try {
    const email = Confirm.getData(Number(code))
    if (!email) {
      return res.status(400).json({
        message: 'Код не існує',
      })
    }
    const user = User.getByEmail(email)
    if (!user) {
      return res.status(400).json({
        message: 'Користувач з таким e-mail не існує',
      })
    }
    user.password = password
    console.log(user)
    const session = Session.create(user)
    const notification = new Notification({
      userId: user._id,
      type: 'accountRecovery',
      message: 'Ви успішно відновили акаунт.',
    })
    return res.status(200).json({
      message: 'Пароль змінено',
      session,
      notification,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

// Підключаємо роутер до бек-енду
module.exports = router
