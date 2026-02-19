// Firebase config
const firebaseConfig = {
	apiKey: 'AIzaSyAl-Z-xiXS-LDpckKXw9yfhBqlq0WfSWiQ',
	authDomain: 'globequiz-stef0245.firebaseapp.com',
	projectId: 'globequiz-stef0245'
}

firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()

// Google Auth Provider
const googleProvider = new firebase.auth.GoogleAuthProvider()
googleProvider.addScope('profile')
googleProvider.addScope('email')

// Google Sign In - Server-side session approach
async function signInWithGoogle() {
	const loadingBtn = event?.target
	const originalText = loadingBtn?.innerHTML

	try {
		// Show loading state
		if (loadingBtn) {
			loadingBtn.disabled = true
			loadingBtn.innerHTML = '<span>Signing in...</span>'
		}

		// Sign in with Google popup
		const result = await auth.signInWithPopup(googleProvider)
		const user = result.user

		// Get ID token to send to server
		const idToken = await user.getIdToken()

		// Send token to server for session creation
		const response = await fetch('/sessionLogin', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ idToken })
		})

		if (response.ok) {
			const data = await response.json()
			// Redirect to home page on success
			window.location.href = '/'
		} else {
			const errorText = await response.text()
			showError(errorText || 'Authentication failed. Please try again.')
			if (loadingBtn) {
				loadingBtn.disabled = false
				loadingBtn.innerHTML = originalText
			}
		}
	} catch (error) {
		console.error('Error during sign in:', error)

		// User-friendly error messages
		let errorMessage = 'Failed to sign in with Google'
		if (error.code === 'auth/popup-closed-by-user') {
			errorMessage = 'Sign-in cancelled. Please try again.'
		} else if (error.code === 'auth/network-request-failed') {
			errorMessage = 'Network error. Please check your connection.'
		} else if (error.message) {
			errorMessage = error.message
		}

		showError(errorMessage)

		if (loadingBtn) {
			loadingBtn.disabled = false
			loadingBtn.innerHTML = originalText
		}
	}
}

// Email/Password Sign In (for form submission)
async function signInWithEmail(event) {
	event.preventDefault()

	const email = document.getElementById('email')?.value
	const password = document.getElementById('password')?.value
	const submitBtn = event.target.querySelector('button[type="submit"]')
	const originalText = submitBtn?.innerHTML

	try {
		if (submitBtn) {
			submitBtn.disabled = true
			submitBtn.innerHTML = 'Signing in...'
		}

		// Sign in with email/password
		const result = await auth.signInWithEmailAndPassword(email, password)
		const user = result.user

		// Get ID token to send to server
		const idToken = await user.getIdToken()

		// Send token to server for session creation
		const response = await fetch('/sessionLogin', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ idToken })
		})

		if (response.ok) {
			window.location.href = '/'
		} else {
			const errorText = await response.text()
			showError(errorText || 'Authentication failed.')
			if (submitBtn) {
				submitBtn.disabled = false
				submitBtn.innerHTML = originalText
			}
		}
	} catch (error) {
		console.error('Error during email sign in:', error)

		let errorMessage = 'Failed to sign in'
		if (error.code === 'auth/wrong-password') {
			errorMessage = 'Incorrect password. Please try again.'
		} else if (error.code === 'auth/user-not-found') {
			errorMessage = 'No account found with this email.'
		} else if (error.code === 'auth/invalid-email') {
			errorMessage = 'Invalid email address.'
		} else if (error.message) {
			errorMessage = error.message
		}

		showError(errorMessage)

		if (submitBtn) {
			submitBtn.disabled = false
			submitBtn.innerHTML = originalText
		}
	}
}

// Email/Password Registration
async function registerWithEmail(event) {
	event.preventDefault()

	const name = document.getElementById('name')?.value
	const email = document.getElementById('email')?.value
	const password = document.getElementById('password')?.value
	const confirmPassword = document.getElementById('confirm-password')?.value
	const submitBtn = event.target.querySelector('button[type="submit"]')
	const originalText = submitBtn?.innerHTML

	// Validate passwords match
	if (password !== confirmPassword) {
		showError('Passwords do not match')
		return
	}

	// Validate password length
	if (password.length < 6) {
		showError('Password must be at least 6 characters')
		return
	}

	try {
		if (submitBtn) {
			submitBtn.disabled = true
			submitBtn.innerHTML = 'Creating Account...'
		}

		// Create user with email/password
		const result = await auth.createUserWithEmailAndPassword(
			email,
			password
		)
		const user = result.user

		// Update profile with display name
		if (name) {
			await user.updateProfile({
				displayName: name
			})
		}

		// Get ID token to send to server
		const idToken = await user.getIdToken()

		// Send token to server for session creation
		const response = await fetch('/sessionLogin', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ idToken })
		})

		if (response.ok) {
			showSuccess('Account created successfully!')
			setTimeout(() => {
				window.location.href = '/'
			}, 1000)
		} else {
			const errorText = await response.text()
			showError(errorText || 'Failed to create session.')
			if (submitBtn) {
				submitBtn.disabled = false
				submitBtn.innerHTML = originalText
			}
		}
	} catch (error) {
		console.error('Error during registration:', error)

		let errorMessage = 'Failed to create account'
		if (error.code === 'auth/email-already-in-use') {
			errorMessage = 'An account with this email already exists.'
		} else if (error.code === 'auth/invalid-email') {
			errorMessage = 'Invalid email address.'
		} else if (error.code === 'auth/weak-password') {
			errorMessage = 'Password is too weak. Use at least 6 characters.'
		} else if (error.message) {
			errorMessage = error.message
		}

		showError(errorMessage)

		if (submitBtn) {
			submitBtn.disabled = false
			submitBtn.innerHTML = originalText
		}
	}
}

// Show error message
function showError(message) {
	const errorDiv = document.getElementById('error-message')
	if (errorDiv) {
		errorDiv.textContent = message
		errorDiv.classList.remove('hidden')

		// Auto-hide after 5 seconds
		setTimeout(() => {
			errorDiv.classList.add('hidden')
		}, 5000)
	} else {
		alert('Error: ' + message)
	}
}

// Show success message
function showSuccess(message) {
	const successDiv = document.getElementById('success-message')
	if (successDiv) {
		successDiv.textContent = message
		successDiv.classList.remove('hidden')

		setTimeout(() => {
			successDiv.classList.add('hidden')
		}, 3000)
	}
}

// Attach form handlers when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
	// Login form
	const loginForm = document.getElementById('login-form')
	if (loginForm) {
		loginForm.addEventListener('submit', signInWithEmail)
	}

	// Register form
	const registerForm = document.getElementById('register-form')
	if (registerForm) {
		registerForm.addEventListener('submit', registerWithEmail)
	}
})
