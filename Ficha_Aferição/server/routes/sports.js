var express = require('express');
var router = express.Router();

var modalidades = require('../controller/modalidade_controller');

/* GET sports listing */
router.get('/', async function(req, res, next) {
	let modalidadesList = await modalidades.getAll();
	modalidadesList.sort((a, b) => a.modalidade.localeCompare(b.modalidade));
	res.json(modalidadesList);
});

router.get('/:modalidade', async function(req, res, next) {
	let modalidade = await modalidades.getByName(req.params.modalidade);
	if (!modalidade) {
		res.status(404).send('Modalidade não encontrada');
		return;
	}
	else{
		let atletas = modalidade.pessoas.sort((a, b) => a.nome.localeCompare(b.nome));
		res.json(atletas);
	}
});

router.post('/', async function(req, res, next) {
	let modalidade = await modalidades.create(req.body);
	res.json(modalidade);
});

router.put('/:id', async function(req, res, next) {
	let modalidade = await modalidades.update(req.params.id, req.body);
	res.json(modalidade);
});

router.delete('/:id', async function(req, res, next) {
	let modalidade = await modalidades.remove(req.params.id);
	res.json(modalidade);
});

module.exports = router;
