const http = require("http");
const url = require("url");
const fs = require('fs');
const path = require('path');
const api = require('./data.js');
const builder = require('./html.js');
const form = require('./form.js');
const querystring = require('querystring');


const mimeTypes = builder.mimeTypes;
const static_folder = '../static';

async function build_composer_edit_page(req, res) {
	let composer_id = req.url.split("/")[req.url.split("/").length-1];
	let post = false;
	let string = "";
	let queryObject = url.parse(req.url, true).query;
	composer_id = composer_id.split("?")[0];

	queryObject['post'] = queryObject['post'] || "default";
	switch (url.parse(req.url, true).query['post']) {
		case 'create':
			string = "Composer with ID: "+composer_id+" was created sucessfuly.";
			post = true;
			break;
		case 'fail_create':
			string = "Composer with ID: "+composer_id+" failed to create.";
			post = true;
			break;
		case 'update':
			string = "Composer with ID: "+composer_id+" was edited sucessfuly.";
			post = true;
			break;
		case 'fail_update':
			string = "Composer with ID: "+composer_id+" failed to edit.";
			post = true;
			break;
		default:
			break;
	}

	if (queryObject.post == "true") {
		post = true;
	}

	let composer = null;
	let composers = await api.get_composers("");
	if (composer_id != 'edit') {
		composer = await api.get_composer_information(composer_id);
	}

	builder.write_head(res, 200,'Edit Composer', 'Classical Music Composers', '.html');
	res.write('<body> <div id="mainwrapper"> <h1 class="title-big">CRUD</h1> <div id="contentwrapper"> <div id="content-crud"> <div class="innertube">');
	if (composer != null) {
		await form.write_form_edit_composer(res, composer);
	}
	else {
		res.write('<h1>Please select one composer</h1>');
	}
	res.write('</div>');
	res.write('</div>');
	res.write('</div>');
	res.write('<nav id="rightmenu">');
	res.write('<div class="innertube">');
	composers.forEach(composer => {
		res.write('<h1><a href="/compositores/edit/'+composer.id+'">'+composer.nome+'</a></h1>');
	});
	res.write('</div>');
	res.write('</nav>');
	builder.write_nav(res);
	res.write('</div>');
	builder.write_footer(res);
	if (post) {
		res.write(`<script> alert("${string}");</script>`);
	}
	res.write('</body>');
	res.end();
}



async function composer_edit_page(req, res){
	let body = '';
	req.on('data', chunk => {
		body += chunk.toString();
	});
	req.on('end', async () => {
		let composer = querystring.parse(body);
		let composer_id = await api.set_composer(composer);
		if (composer_id != null) {
			res.writeHead(302, {
				'Location': '/compositores/edit/'+ composer_id + '?post=update'
			});
			res.end();
		}
		else {
			res.writeHead(302, {
				'Location': '/compositores/edit/'+composer.id + '?post=fail_update'
			});
			res.end();
		}
	});

}

async function composer_add_page(req, res){
	let body = '';
	req.on('data', chunk => {
		body += chunk.toString();
	});
	req.on('end', async () => {
		let composer = querystring.parse(body);
		let composer_id = await api.create_composer(composer);
		if (composer_id != null) {
			res.writeHead(302, {
				'Location': '/compositores/edit/'+ composer_id + '?post=create'
			});
			res.end();
		}
		else {
			res.writeHead(302, {
				'Location': '/compositores/edit/'+composer.id + '?post=fail_create'
			});
			res.end();
		}
	});
}

async function composer_delete_page(req, res){
	let body = '';
	req.on('data', chunk => {
		body += chunk.toString();
	});
	req.on('end', async () => {
		let composers = querystring.parse(body)['composerToDelete[]'];
		if (typeof composers === 'string') {
			composers = [composers];
		}
		composers.forEach(async composer => {
			await api.delete_composer(composer);
		});
		res.writeHead(302, {
			'Location': '/compositores/delete'
		});
		res.end();
	});
}

async function build_composer_create_page(req, res) {
	builder.write_head(res, 200,'Create Composer', 'Classical Music Composers', '.html');
	res.write('<body> <div id="mainwrapper"> <h1 class="title-big">CRUD</h1> <div id="contentwrapper"> <div id="content-crud"> <div class="innertube">');
	await form.write_form_add_composer(res);
	res.write('</div>');
	res.write('</div>');
	res.write('</div>');
	builder.write_rightmenu_delete(res);
	builder.write_nav(res);
	res.write('</div>');
	builder.write_footer(res);
	res.write('</body>');
	res.end();
}

async function build_composer_select_page(req, res) {
	builder.write_head(res, 200,'Select Composer', 'Classical Music Composers', '.html');
	res.write('<body> <div id="mainwrapper"> <h1 class="title-big">CRUD</h1> <div id="contentwrapper"> <div id="content-crud"> <div class="innertube">');
	await form.write_form_delete_composers(res);
	res.write('</div>');
	res.write('</div>');
	res.write('</div>');
	builder.write_rightmenu_delete(res);
	builder.write_nav(res);
	res.write('</div>');
	builder.write_footer(res);
	res.write('</body>');
	res.end();
}


async function period_edit_page(req, res){
	let body = '';
	req.on('data', chunk => {
		body += chunk.toString();
	});
	req.on('end', async () => {
		let period = querystring.parse(body);
		period.compositores = [];
		period['composerInPeriod[]'].forEach(async composer => {
			let compositor = await api.get_composer_information(composer,false);
			period.compositores.push({id: composer, nome: compositor.nome});
		}
		);
		delete period['composerInPeriod[]'];
		let period_id = await api.set_period(period);
		let string = "?post=update";
		if (period_id == null) {
			string = "?post=fail_update";
			period_id = period.id;
		}
		res.writeHead(302, {
			'Location': '/periodos/edit/'+period.id + string
		});
		res.end();
	});
	

}

async function period_add_page(req, res){
	let body = '';
	req.on('data', chunk => {
		body += chunk.toString();
	});
	req.on('end', async () => {
		let period = querystring.parse(body);
		period.compositores = [];
		let period_id = await api.create_period(period);
		let string = '?post=create';
		if (period_id == null) {
			string = '?post=fail_create';
			period_id = period.id;
		}
		res.writeHead(302, {
			'Location': '/periodos/edit/'+period.id + string
		});
		res.end();
	});
}

async function period_delete_page(req, res){
	let body = '';
	req.on('data', chunk => {
		body += chunk.toString();
	});
	req.on('end', async () => {
		let periods = querystring.parse(body)['periodToDelete[]'];
		if (typeof periods === 'string') {
			periods = [periods];
		}
		periods.forEach(async period => {
			await api.delete_period(period);
		});
		res.writeHead(302, {
			'Location': '/periodos/delete'
		});
		res.end();
	});
}

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

async function build_composer_page(req, res) {
	let composer_id = req.url.split("/")[2];
	composer_id = composer_id.split("?")[0];
	let composer = await api.get_composer_information(composer_id);
	for (const key in composer) {
		composer[key] = JSON.parse(JSON.stringify( composer[key]));
	}
	builder.write_head(res, 200,composer.nome, 'Classical Music Composers', '.html');
	res.write('<body>');
	res.write('<main>');
	res.write('<h1 class="title-big">'+composer.nome+'</h1>');
	res.write('<div id="innertube">');
	res.write('<div id="composer-list">');
	res.write('<ul>');
	res.write('<li><h2 style="color: var(--foreground)">Biografia: '+composer.bio+'</h2></li>');
	res.write('<li><h2 style="color: var(--foreground)">Nascimento: '+composer.dataNasc+'</h2></li>');
	res.write('<li><h2 style="color: var(--foreground)">Morte: '+composer.dataObito+'</h2></li>');
	res.write('<li><h2 style="color: var(--foreground)">Periodo: <a href="/periodos/'+ composer.periodo.id +'">'+composer.periodo.periodo+'</a></h2></li>');
	res.write('</ul>');
	res.write('</div>');
	res.write('</main>');
	builder.write_nav(res);
	builder.write_footer(res);
	res.write('</body>');
	res.end();	
}

async function build_period_edit_page(req, res) {
	let period_id = req.url.split("/")[req.url.split("/").length-1];
	period_id = period_id.split("?")[0];
	let post = false;
	let queryObject = url.parse(req.url, true).query;

	queryObject['post'] = queryObject['post'] || "default";
	switch (url.parse(req.url, true).query['post']) {
		case 'create':
			string = "Composer with ID: "+period_id+" was created sucessfuly.";
			post = true;
			break;
		case 'fail_create':
			string = "Composer with ID: "+period_id+" failed to create.";
			post = true;
			break;
		case 'update':
			string = "Composer with ID: "+period_id+" was edited sucessfuly.";
			post = true;
			break;
		case 'fail_update':
			string = "Composer with ID: "+period_id+" failed to edit.";
			post = true;
			break;
		default:
			break;
	}

	if (queryObject.post == "true") {
		post = true;
	}

	let period = null;
	let periods = await api.get_periods();
	periods = periods.filter(period => period.id !== "P0");
	if (period_id != 'edit') {
		period= await api.get_period_information(period_id);
	}

	builder.write_head(res, 200,'Edit Period', 'Classical Music Composers', '.html');
	res.write('<body> <div id="mainwrapper"> <h1 class="title-big">CRUD</h1> <div id="contentwrapper"> <div id="content-crud"> <div class="innertube">');
	if (period != null) {
		await form.write_form_edit_period(res, period);
	}
	else {
		res.write('<h1>Please select one period</h1>');
	}
	res.write('</div>');
	res.write('</div>');
	res.write('</div>');
	res.write('<nav id="rightmenu">');
	res.write('<div class="innertube">');
	periods.forEach(period => {
		res.write('<h1><a href="/periodos/edit/'+period.id+'">'+period.periodo+'</a></h1>');
	});
	res.write('</div>');
	res.write('</nav>');
	builder.write_nav(res);
	res.write('</div>');
	builder.write_footer(res);
	if (post) {
		res.write(`<script> alert("${string}");</script>`);
	}
	res.write('</body>');
	res.end();
}

async function build_period_create_page(req, res) {
	builder.write_head(res, 200,'Create Period', 'Classical Music Composers', '.html');
	res.write('<body> <div id="mainwrapper"> <h1 class="title-big">CRUD</h1> <div id="contentwrapper"> <div id="content-crud"> <div class="innertube">');
	await form.write_form_add_period(res);
	res.write('</div>');
	res.write('</div>');
	res.write('</div>');
	builder.write_rightmenu_delete(res);
	builder.write_nav(res);
	res.write('</div>');
	builder.write_footer(res);
	res.write('</body>');
	res.end();
}

async function build_period_select_page(req, res) {
	builder.write_head(res, 200,'Delete Period', 'Classical Music Composers', '.html');
	res.write('<body> <div id="mainwrapper"> <h1 class="title-big">CRUD</h1> <div id="contentwrapper"> <div id="content-crud"> <div class="innertube">');
	await form.write_form_delete_period(res);
	res.write('</div>');
	res.write('</div>');
	res.write('</div>');
	builder.write_rightmenu_delete(res);
	builder.write_nav(res);
	res.write('</div>');
	builder.write_footer(res);
	res.write('</body>');
	res.end();
}


async function build_period_list_page(req, res) {
	let periods = await api.get_periods();
	builder.write_head(res, 200,'Period List', 'Classical Music Periods', '.html');
	res.write('<body>');
	res.write('<main>');
	res.write('<h1 class="title-big">Periodos</h1>');
	res.write('<div id="innertube">');

	// Periods list
	res.write('<div id="composer-list-wrapper">');
	res.write('<div id="composer-list">');
	res.write('<ul>');
	periods.forEach(period => {
		res.write('<li><h1><a href="/periodos/'+period.id+'">'+period.periodo+'</a><h1></li>');
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

async function build_period_page(req, res) {
	let period_id = req.url.split("/")[2];
	period_id = period_id.split("?")[0];
	let period = await api.get_period_information(period_id);
	builder.write_head(res, 200, period.periodo, 'Classical Music Periods', '.html');
	res.write('<body>');
	res.write('<main>');
	res.write('<h1 class="title-big">'+period.periodo+'</h1>');
	res.write('<div id="innertube">');
	res.write('<div id="composer-list">');
	res.write('<ul>');
	period.compositores.forEach(composer => {
		res.write('<li><h2><a href="/compositores/'+composer.id+'">'+composer.nome+'</a><h2></li>');
	});
	res.write('</ul>');
	res.write('</div>');
	res.write('</main>');
	builder.write_nav(res);
	builder.write_footer(res);
	res.write('</body>');
	res.end();
}


function build_home_page(req, res) {
	const readStream = fs.createReadStream(path.join(__dirname, '../templates/index.html'));
	builder.write_head(res, 200,'Composium', 'Music Composers, Composers', '.html');
  	readStream.pipe(res);
}

function build_CRUD_page(req, res) {
	const readStream = fs.createReadStream(path.join(__dirname, '../templates/crud.html'));
	builder.write_head(res, 200,'CRUD', 'Music Composers, Composers', '.html');
	readStream.pipe(res);
}

function build_about_page(req, res) {
	const readStream = fs.createReadStream(path.join(__dirname, '../templates/about.html'));
	builder.write_head(res, 200,'About', 'Music Composers, Composers', '.html');
	readStream.pipe(res);
}

function build_404_page(req, res) {
	builder.write_head(res, 404,'404 Not Found', 'Music Composers, Composers', '.html');
	res.end("<div id='page'><h1>404: Page Not Found!</h1></div>");
}


// Refer to : {https://chat.openai.com/share/2aa01f3c-f085-4b7e-9dab-4223c97909b0}
function feed_static_file(req, res) {
	const resolvedBase = path.resolve(static_folder+"/../")
	const safeSuffix = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '');
  const fileLoc = path.join(resolvedBase, safeSuffix);
	fs.readFile(fileLoc, (err, data) => {
    if (err) {
		build_404_page(req, res);
    }

    // Content-Type based on the file extension
		let ext = path.parse(fileLoc).ext;
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    res.write(data);
    return res.end();
  });
}


const router = function route_manager(req, res) {
	console.log( req.method + ' - ' + req.url);


	switch (req.method) {
		case 'GET':
			// FEED STATIC FILES (CSS, JS, IMAGES)
			if (req.url.includes("/static")) {
				feed_static_file(req, res);
				return;
			}

			// respond to composer route page
			if (req.url.includes("/compositores/edit")) {
				build_composer_edit_page(req, res);
				return;
			}
			else if (req.url.includes("/compositores/add") && req.url.split("/").length == 3) {
				build_composer_create_page(req, res);
				return;
			}
			else if (req.url.includes("/compositores/delete") && req.url.split("/").length == 3) {
				build_composer_select_page(req, res);
				return;
			}
			else if (req.url.includes("/compositores/") && req.url.split("/").length == 3){
				build_composer_page(req, res);
				return;
			}
			else if (req.url.includes("/compositores") && req.url.split("/").length == 2) {
				build_composer_list_page(req, res);
				return;
			}

			// respond to period route page
			if (req.url.includes("/periodos/edit")) {
				build_period_edit_page(req, res);
				return;
			}
			else if (req.url.includes("/periodos/add") && req.url.split("/").length == 3) {
				build_period_create_page(req, res);
				return;
			}
			else if (req.url.includes("/periodos/delete") && req.url.split("/").length == 3) {
				build_period_select_page(req, res);
				return;
			}
			else if (req.url.includes("/periodos/")  && req.url.split("/").length == 3) {
				build_period_page(req, res);
				return;
			}
			else if (req.url.includes("/periodos") && req.url.split("/").length == 2) {
				build_period_list_page(req, res);
				return;
			}

			// Catch any other request
			switch (req.url) {
				case "/":
					// Home page
					build_home_page(req, res);
					break;

				case "/CRUD":
					// CRUD page
					build_CRUD_page(req, res);
					break;

				case "/about":
					// About page
					build_about_page(req, res);
					break;

				default:
					// 404 page
					build_404_page(req, res);
					break;
			}

			break;

		case 'POST':
			// CRUD operations only
			if (req.url.includes("/CRUD/compositores/edit")) {
				composer_edit_page(req, res);
				return;
			}
			else if (req.url.includes("/CRUD/compositores/add")) {
				composer_add_page(req, res);
				return;
			}
			else if (req.url.includes("/CRUD/compositores/delete")) {
				composer_delete_page(req, res);
				return;
			}

			if (req.url.includes("/CRUD/periodos/edit")) {
				period_edit_page(req, res);
				return;
			}
			else if (req.url.includes("/CRUD/periodos/add")) {
				period_add_page(req, res);
				return;
			}
			else if (req.url.includes("/CRUD/periodos/delete")) {
				period_delete_page(req, res);
				return;
			}
			break;


		default:
			build_404_page(req, res);
			break;
	}
}

const server = http.createServer(router);

server.listen(8080, () => {
  console.log(`Server running at http://localhost:8080/`);
});

