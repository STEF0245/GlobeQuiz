import app from './app.js'

// Config
import { PORT } from './config/env.js'

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})
