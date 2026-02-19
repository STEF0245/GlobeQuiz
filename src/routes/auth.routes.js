import express from 'express'
import {
	loginPage,
	registerPage,
	profilePage,
	sessionLogin,
	logout
} from '../controllers/auth.controller.js'

const router = express.Router()

router.get('/login', loginPage)
router.get('/register', registerPage)
router.get('/profile', profilePage)
router.post('/sessionLogin', sessionLogin)
router.get('/logout', logout)

export default router
