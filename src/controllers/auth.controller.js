import { admin, auth } from '../firebaseAdmin.js'
import { SESSION_EXPIRES_MS } from '../config/env.js'

const FIREBASE_API_KEY = 'AIzaSyAl-Z-xiXS-LDpckKXw9yfhBqlq0WfSWiQ'

export function loginPage(req, res) {
	res.render('login', { user: req.user })
}

export function registerPage(req, res) {
	res.render('register', { user: req.user })
}

// Server-side email/password login using Firebase REST API
export async function login(req, res) {
	const { email, password } = req.body

	if (!email || !password) {
		return res
			.status(400)
			.json({ error: 'Email and password are required' })
	}

	try {
		// Authenticate user using Firebase REST API
		const response = await fetch(
			`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email,
					password,
					returnSecureToken: true
				})
			}
		)

		const data = await response.json()

		if (!response.ok) {
			let errorMessage = 'Authentication failed'
			if (data.error?.message === 'INVALID_LOGIN_CREDENTIALS') {
				errorMessage = 'Invalid email or password'
			} else if (data.error?.message === 'USER_DISABLED') {
				errorMessage = 'This account has been disabled'
			} else if (data.error?.message) {
				errorMessage = data.error.message
			}
			return res.status(401).json({ error: errorMessage })
		}

		// Create session cookie using the ID token
		const sessionCookie = await admin
			.auth()
			.createSessionCookie(data.idToken, {
				expiresIn: SESSION_EXPIRES_MS
			})

		res.cookie('session', sessionCookie, { httpOnly: true, secure: false })
		res.json({ status: 'success' })
	} catch (error) {
		console.error('Login error:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}

// Server-side registration using Firebase Admin SDK
export async function register(req, res) {
	const { email, password, name } = req.body

	if (!email || !password) {
		return res
			.status(400)
			.json({ error: 'Email and password are required' })
	}

	if (password.length < 6) {
		return res
			.status(400)
			.json({ error: 'Password must be at least 6 characters' })
	}

	try {
		// Create user with Admin SDK
		const userRecord = await admin.auth().createUser({
			email,
			password,
			displayName: name || undefined
		})

		// Authenticate the newly created user to get a token
		const response = await fetch(
			`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email,
					password,
					returnSecureToken: true
				})
			}
		)

		auth.updateUser(userRecord.uid, { displayName: name || undefined })

		const data = await response.json()

		if (!response.ok) {
			return res
				.status(500)
				.json({ error: 'User created but login failed' })
		}

		// Create session cookie
		const sessionCookie = await admin
			.auth()
			.createSessionCookie(data.idToken, {
				expiresIn: SESSION_EXPIRES_MS
			})

		res.cookie('session', sessionCookie, { httpOnly: true, secure: false })
		res.json({ status: 'success', user: userRecord })
	} catch (error) {
		console.error('Registration error:', error)

		let errorMessage = 'Failed to create account'
		if (error.code === 'auth/email-already-exists') {
			errorMessage = 'An account with this email already exists'
		} else if (error.code === 'auth/invalid-email') {
			errorMessage = 'Invalid email address'
		} else if (error.code === 'auth/weak-password') {
			errorMessage = 'Password is too weak'
		}

		res.status(400).json({ error: errorMessage })
	}
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
