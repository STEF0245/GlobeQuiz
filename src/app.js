import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'

// Routes
import authRoutes from './routes/auth.routes.js'
import profileRoutes from './routes/profile.routes.js'
import pageRoutes from './routes/page.routes.js'

// Middleware
import debug from './middleware/debug.middleware.js'
import { getUserFromSession } from './middleware/auth.middleware.js'

const app = express()

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(process.cwd(), 'public')))

// Templating
app.set('view engine', 'ejs')
app.set('views', path.join(process.cwd(), 'views'))

// Middleware
app.use(getUserFromSession, debug)

// Routes
app.use(authRoutes)
app.use('/profile', profileRoutes)
app.use(pageRoutes)

app.get('/favicon.ico', (req, res) =>
	res.sendFile(path.join(process.cwd(), 'public', 'images', 'GlobeQuiz.png'))
)

export default app
