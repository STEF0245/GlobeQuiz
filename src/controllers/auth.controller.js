import { admin } from '../firebaseAdmin.js'
import { SESSION_EXPIRES_MS } from '../config/env.js'

export function loginPage(req, res) {
	res.render('login', { user: req.user })
}

export function registerPage(req, res) {
	res.render('register', { user: req.user })
}

export function profilePage(req, res) {
	res.render('profile', { user: req.user })
}

export async function sessionLogin(req, res) {
	const { idToken } = req.body
	try {
		const sessionCookie = await admin
			.auth()
			.createSessionCookie(idToken, { expiresIn: SESSION_EXPIRES_MS })
		res.cookie('session', sessionCookie, { httpOnly: true, secure: false })
		res.send({ status: 'success' })
	} catch {
		res.status(401).send('Unauthorized')
	}
}

export function logout(req, res) {
	res.clearCookie('session')
	res.redirect('/login')
}
