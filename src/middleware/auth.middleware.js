import { admin } from '../firebaseAdmin.js'

export async function checkAuth(req, res, next) {
	try {
		const sessionCookie = req.cookies.session || ''
		const decodedClaims = await admin
			.auth()
			.verifySessionCookie(sessionCookie, true)
		req.user = decodedClaims
		next()
	} catch (error) {
		res.redirect('/login')
	}
}

export async function getUserFromSession(req, res, next) {
	try {
		const sessionCookie = req.cookies.session || ''
		const decodedClaims = await admin
			.auth()
			.verifySessionCookie(sessionCookie, true)
		req.user = decodedClaims
	} catch (error) {
		req.user = null
	}
	next()
}
