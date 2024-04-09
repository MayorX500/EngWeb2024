var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.set('Content-Type', 'text/html');
	res.send(Buffer.from('<h2>Ficha Aferição API</h2>\n<h3>API para aferição de fichas de avaliação</h3>\n<h3>Pessoas - <a href="/pessoas">/pessoas</a></h3>\n<h3>Modalidades - <a href="/modalidades">/modalidades</a></h3>'));
});

module.exports = router;
