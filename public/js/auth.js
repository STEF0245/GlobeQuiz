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

		// Send credentials to server
		const response = await fetch('/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, password })
		})

		const data = await response.json()

		if (response.ok) {
			window.location.href = '/'
		} else {
			showError(data.error || 'Authentication failed.')
			if (submitBtn) {
				submitBtn.disabled = false
				submitBtn.innerHTML = originalText
			}
		}
	} catch (error) {
		console.error('Error during email sign in:', error)
		showError('Failed to sign in. Please try again.')

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

		// Send registration data to server
		const response = await fetch('/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, password, name })
		})

		const data = await response.json()

		if (response.ok) {
			showSuccess('Account created successfully!')
			setTimeout(() => {
				window.location.href = '/'
			}, 1000)
		} else {
			showError(data.error || 'Failed to create account.')
			if (submitBtn) {
				submitBtn.disabled = false
				submitBtn.innerHTML = originalText
			}
		}
	} catch (error) {
		console.error('Error during registration:', error)
		showError('Failed to create account. Please try again.')

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
