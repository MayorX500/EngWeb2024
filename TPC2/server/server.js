var http = require('http');
var axios = require('axios');
var url = require('url');

function fetchData( api_address ) {
	return axios.get(api_address).then(function(response) {
		return response.data;
	}).catch(function(error) {
		console.log('Error fetching data from API: ' + error);
			throw new Error('Error fetching data from API');
	});
};

function writeHeader(res, code){
	res.writeHead(code, {'Content-Type': 'text/html; charset=utf-8'});
	res.write('<meta name="viewport" content="width=device-width, initial-scale=1">');
	res.write('<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto">');
	res.write('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">');
	res.write('<style>body {font-family: Arial, sans-serif;}</style>');
}

function _404_not_found( res, error ){
	writeHeader(res, 404);
	res.write('<h1>Page not found</h1>');
	res.write('<p style="color: red;">' + error + '</p>');
	res.write('<a href="/">Voltar</a>');
	res.end();
};

function instruments( port, res ){
	let api_address = 'http://localhost:'+ port +'/instrumentos';
	fetchData(api_address).then(data => {
		writeHeader(res, 200);
		res.write('<h1>Instrumentos</h1>');
		res.write('<ul>');
		data.forEach(instrumento => {
			res.write('<li> <strong>' + instrumento['id'] + '</strong> -' + instrumento['#text'] + '</li>');
		});
		res.write('</ul>');
		res.write('<a href="/">Voltar</a>');
		res.end();
	}).catch((error) =>_404_not_found(res, error.message));
};

function courses( port, res ){
	let api_address = 'http://localhost:'+ port +'/cursos?_sort=id';
	fetchData(api_address).then(data => {
		writeHeader(res, 200);
		res.write('<h1>Cursos</h1>');
		res.write('<ul style="list-style: none;">');
		data.forEach(curso => {
			let displayId = curso.id;
			if (4 - curso.id.length > 0) {
				displayId += '&nbsp;'.repeat(4 - curso.id.length)
			}
			var link = '<a href="/cursos/' + curso.id + '" style="color:#962FBF; text-decoration: none; font-weight:bold;">' + displayId + '</a>';
		res.write('<li>' + link + ' - ' + curso.designacao + '</li>');
		});
		res.write('</ul>');
		res.write('<a href="/">Voltar</a>');
		res.end();
	}).catch((error) =>_404_not_found(res, error.message));
};

function course( port, res, id ){
	let api_address = 'http://localhost:'+ port +'/cursos/' + id;
	let list_alunos = fetchData('http://localhost:'+ port +'/alunos?curso='+id);
	fetchData(api_address).then(data => {
		writeHeader(res, 200);
		res.write('<h1>Curso</h1>');
		res.write('<h2>' + data.designacao + '</h2>');
		res.write('<ul>');
		res.write('<li>Duração: ' + data.duracao + ' anos</li>');
		res.write('<li>Instrumento: ' + data.instrumento['#text'] + '</li>');
		list_alunos.then(alunos => {
			if (alunos.length <= 0) {
				res.write('<li>Nenhum aluno inscrito</li>');
			}
			else {
				res.write('<li>Alunos inscritos:</li>');
				res.write('<ul style="list-style: none;">');
				alunos.forEach(aluno => {
					let displayId = aluno.id;
				if (7 - aluno.id.length > 0) {
					displayId += '&nbsp;'.repeat(7 - aluno.id.length);
				}
				var link = '<a href="/alunos/' + aluno.id + '" style="color: #962FBF; text-decoration: none; font-weight:bold;">' + displayId + '</a>';
				res.write('<li>' + link + ' - ' + aluno.nome.toUpperCase() + '</li>');
				});
				res.write('</ul>');
			}
			res.write('</ul>');
			res.write('<a href="/cursos">Voltar</a>');
			res.end();
		});
	}).catch((error) =>_404_not_found(res, error.message));
};

function students( port, res ){
	let api_address = 'http://localhost:'+ port +'/alunos?_sort=nome';
	fetchData(api_address).then(data => {
		writeHeader(res, 200);
		res.write('<h1>Alunos</h1>');
		res.write('<ul style="list-style: none;">');
		data.forEach(aluno => {
		let displayId = aluno.id;
		if (7 - aluno.id.length > 0) {
		displayId += '&nbsp;'.repeat(7 - aluno.id.length);
		}
		var link = '<a href="/alunos/' + aluno.id + '" style="color: #962FBF; text-decoration: none; font-weight:bold;">' + displayId + '</a>';
		res.write('<li>' + link + ' - ' + aluno.nome.toUpperCase() + '</li>');
	});
		res.write('</ul>');
		res.write('<a href="/">Voltar</a>');
		res.end();
	}).catch((error) =>_404_not_found(res, error.message));
};

function student( port, res, id ){
	let api_address = 'http://localhost:'+ port +'/alunos/' + id;
	fetchData(api_address).then(data => {
		writeHeader(res, 200);
		res.write('<h1>Aluno</h1>');
		res.write('<h3>' + data.nome + '</h3>');
		res.write('<ul>');
		res.write('<li>Data de Nascimento: ' + data.dataNasc + '</li>');
		var link = '<a href="/cursos/' + data.curso + '" style="color:#962FBF; text-decoration: none; font-weight:bold;">' + data.curso + '</a>';
		res.write('<li>Curso: ' + link + '</li>');
		res.write('<li>Ano: ' + data.anoCurso + '</li>');
		res.write('<li>Instrumento: ' + data.instrumento + '</li>');
		res.write('</ul>');
		res.write('<a href="/alunos">Voltar</a>');
		res.end();
	}).catch((error) =>_404_not_found(res, error.message));
};


function main( argv) {
	if (argv.length === 2) {
  	console.error('Expected at least one argument!');
  	process.exit(1);
	}
	let port = argv[2];

	console.log('Server running');
	http.createServer(function (req, res) {
		var query = url.parse(req.url, true);

		if (query.pathname === '/'){
			writeHeader(res, 200);
			res.write('<h1>Escola de Musica</h1>');
			res.write('<a href="/alunos">Alunos</a>');
			res.write('<br>');
			res.write('<a href="/instrumentos">Instrumentos</a>');
			res.write('<br>');
			res.write('<a href="/cursos">Cursos</a>');
			res.write('<br>');
			res.end();
		}
		else if (query.pathname === '/alunos') {
			students(port, res);
		}
		else if (query.pathname === '/instrumentos') {
			instruments(port, res);
		}
		else if (query.pathname === '/cursos') {
				courses(port, res);
		}
		else if (query.pathname.includes('/cursos/')) {
			let course_id = query.pathname.split('/')[2];
			course(port, res, course_id);
		}
		else if (query.pathname.includes('/alunos/')) {
			let student_id = query.pathname.split('/')[2];
			student(port, res, student_id);
		}
		else {
			res.write('<h1>Page not found</h1>');
			res.write('<a href="/">Voltar</a>');
			res.end();
		}

	}).listen(8080);
}

if (require.main === module) {
  main(process.argv)
}

