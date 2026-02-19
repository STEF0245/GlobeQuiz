export async function renderHome(req, res, next) {
	try {
		res.render('index', { user: req.user })
	} catch (err) {
		next(err)
	}
}
