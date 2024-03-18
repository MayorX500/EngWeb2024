var express = require('express');
var api = require('./../api/data.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Composium' });
});

router.get('/about', function(req, res, next) {
	res.render('about', { title: 'About this Work' });
});

router.get('/CRUD', function(req, res, next) {
  res.render('CRUD', { title: 'CRUD Operations' });
});
1
module.exports = router;


/*
async function build_composer_list_page(req, res) {
	const queryObject = url.parse(req.url, true).search || '';
	let composers = await api.get_composers(queryObject);
	let period = await api.get_periods();
	period.push({name: 'All', rule: ''});
	builder.write_head(res, 200,'Composers List', 'Classical Music Composers', '.html');
	res.write('<body>');
	res.write('<main>');
	res.write('<h1 class="title-big">Compositores</h1>');
	res.write('<div id="innertube">');

	// Filter by period buttons
	res.write('<div style="display: flex; justify-content: space-around;">');
	period.forEach(period => {
		res.write('<a href="/compositores'+period.rule+'" class="button" style="--color: var(--accent-color);">'+period.periodo+'</a>');
	});
	res.write('</div>');

	// Composers list
	res.write('<div id="composer-list-wrapper">');
	res.write('<div id="composer-list">');
	res.write('<ul>');
	composers.forEach(composer => {
		res.write('<li><h1><a href="/compositores/'+composer.id+'">'+composer.nome+'</a><h1></li>');
	});
	res.write('</ul>');
	res.write('</div>');
	res.write('</div>');


	res.write('</main>');
	builder.write_nav(res);
	builder.write_footer(res);
	res.write('</body>');
	res.end();	
}
*/