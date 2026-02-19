import express from 'express'
import { checkAuth } from '../middleware/auth.middleware.js'
import { renderHome } from '../controllers/page.controller.js'

const router = express.Router()

router.get('/', checkAuth, renderHome)

export default router
