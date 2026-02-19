export async function renderHome(req, res, next) {
	try {
		res.render('index', { user: req.user })
	} catch (err) {
		next(err)
	}
}

export async function renderQuiz(req, res, next) {
	try {
		res.render('quiz', { user: req.user })
	} catch (err) {
		next(err)
	}
}
