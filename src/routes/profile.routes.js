import express from 'express'
import {
	profilePage,
	settingsPage,
	preferencesPage,
	passwordPage,
	notificationsPage
} from '../controllers/profile.controller.js'
import { checkAuth } from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/profile', checkAuth, profilePage)
router.get('/settings', checkAuth, settingsPage)
router.get('/preferences', checkAuth, preferencesPage)
router.get('/password', checkAuth, passwordPage)
router.get('/notifications', checkAuth, notificationsPage)

export default router
