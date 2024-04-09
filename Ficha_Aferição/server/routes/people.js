var express = require('express');
var pessoas = require('../controller/pessoa_controller');
var router = express.Router();

/* GET users listing. */
router.get('/', async function(req, res, next) {
	let p = await pessoas.getAll();
  res.json(p);
});

router.get('/:id', async function(req, res, next) {
	let p = await pessoas.getById(req.params.id);
	if (!p) {
		res.status(404).send('Not found');
		return;
	}
	else res.json(p);
});

router.post('/', async function(req, res, next) {
	let p = await pessoas.create(req.body);
	res.json(p);
});

router.put('/:id', async function(req, res, next) {
	let p = await pessoas.update(req.params.id, req.body);
	res.json(p);
});

router.delete('/:id', async function(req, res, next) {
	let p = await pessoas.remove(req.params.id);
	res.json(p);
});

module.exports = router;
