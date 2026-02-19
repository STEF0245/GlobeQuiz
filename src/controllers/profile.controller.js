export function profilePage(req, res) {
	const user = req.user
	if (!user) {
		return res.redirect('/login')
	}

	// Mock user stats - in production, fetch from database
	const userStats = {
		quizzesPlayed: 12,
		totalPoints: 847,
		averageScore: 85,
		globalRank: 42,
		dayStreak: 7,
		achievements: 5,
		weekProgress: 65,
		monthlyPoints: 847,
		monthlyPointsGoal: 1000
	}

	res.render('profile/profile', { user, userStats })
}

export function settingsPage(req, res) {
	const user = req.user
	if (!user) {
		return res.redirect('/login')
	}

	res.render('profile/settings', { user })
}

export function preferencesPage(req, res) {
	const user = req.user
	if (!user) {
		return res.redirect('/login')
	}

	// Mock preferences - in production, fetch from database
	const preferences = {
		theme: 'light',
		language: 'en',
		timezone: 'UTC',
		difficulty: 'medium',
		showHints: true,
		enableTimeLimit: true,
		soundEnabled: true,
		hapticEnabled: false
	}

	res.render('profile/preferences', { user, preferences })
}

export function passwordPage(req, res) {
	const user = req.user
	if (!user) {
		return res.redirect('/login')
	}

	res.render('profile/password', { user })
}

export function notificationsPage(req, res) {
	const user = req.user
	if (!user) {
		return res.redirect('/login')
	}

	// Mock notification settings - in production, fetch from database
	const notificationSettings = {
		email: {
			quizReminders: true,
			newQuizzes: true,
			achievements: true,
			leaderboard: false,
			marketing: false
		},
		push: {
			quizReminders: true,
			newQuizzes: false,
			achievements: true,
			friendActivity: false
		},
		frequency: 'instant',
		doNotDisturb: {
			enabled: false,
			startTime: '22:00',
			endTime: '08:00'
		}
	}

	res.render('profile/notifications', { user, notificationSettings })
}
