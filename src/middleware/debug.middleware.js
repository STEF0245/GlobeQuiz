export default (req, res, next) => {
	const cfg = {
		GET: '32m',
		POST: '33m',
		PUT: '34m',
		DELETE: '31m',
		url: '4m',
		user: '36m',
		dim: '90m'
	}
	const color = (code, str) => `\x1b[${code}${str}\x1b[0m`

	console.log(req.user)

	console.log(
		`${color(`1m\x1b[${cfg[req.method] || '37m'}`, req.method)} ${color(cfg.dim, '→')} ${color(cfg.url, req.url)} ${color(cfg.dim, 'by')} ${color(cfg.user, req.user?.name || 'Guest')}`
	)
	next()
}
