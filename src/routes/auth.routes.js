import express from 'express'
import {
	loginPage,
	registerPage,
	login,
	register,
	sessionLogin,
	logout
} from '../controllers/auth.controller.js'

const router = express.Router()

router.get('/login', loginPage)
router.get('/register', registerPage)
router.post('/login', login)
router.post('/register', register)
router.post('/sessionLogin', sessionLogin) // Keep for Google OAuth compatibility
router.get('/logout', logout)

export default router
