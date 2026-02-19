import express from 'express'
import { checkAuth } from '../middleware/auth.middleware.js'
import { renderHome, renderQuiz } from '../controllers/page.controller.js'

const router = express.Router()

router.get('/', renderHome)
router.get('/quiz', checkAuth, renderQuiz)

export default router
