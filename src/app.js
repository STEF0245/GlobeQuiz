import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'

// Routes
import authRoutes from './routes/auth.routes.js'
import pageRoutes from './routes/page.routes.js'

// Middleware
import debug from './middleware/debug.middleware.js'

const app = express()

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(process.cwd(), 'public')))

// Templating
app.set('view engine', 'ejs')
app.set('views', path.join(process.cwd(), 'views'))

// Middleware
app.use(debug)

// Routes
app.use(authRoutes)
app.use(pageRoutes)

export default app
