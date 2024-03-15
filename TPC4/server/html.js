const api = require('./data.js');

const mimeTypes = {'.js': 'text/javascript', '.html': 'text/html', '.css': 'text/css', '.jpg': 'image/jpg', '.png': 'image/png', '.gif': 'image/gif', '.svg': 'image/svg+xml'};


function write_head(res, code, title, desc, ext) {
    res.writeHead(code, {'Content-Type': mimeTypes[ext] || 'text/html'});
    res.write('<head>')
    res.write('<meta charset="utf-8">');
    res.write('<link rel="icon" href="/static/images/favicon.png">');
    res.write('<link rel="stylesheet" type="text/css" href="/static/css/style.css">');
    res.write('<script class="u-script" type="text/javascript" src="/static/js/functions.js"></script>');
    res.write('<link id="u-theme-google-font" rel="stylesheet" href="/static/css/GFont_Montserrat.css">');
    res.write('<link id="u-theme-google-font" rel="stylesheet" href="/static/css/GFont_Lobster.css">');
    res.write('<title>' + title + '</title>');
    res.write('<meta name="description" content="' + desc + '">');
    res.write('<meta name="viewport" content="width=device-width, initial-scale=1">');
    res.write('</head>')
}

function write_footer(res) {
    res.write('<footer id="footer">');
    res.write('<div id="logo">');
    res.write('<p>&copy; Copyright <a href="https://github.com/MayorX500">Miguel Gomes</a> &#124; <a href="#">Terms of Use</a> &#124; <a href="#">Privacy Policy</a></p>');
    res.write('</div>');
    res.write('</footer>');
}

function write_rightmenu_delete(res) {
    res.write(`			<nav id="rightmenu">
    <div class="innertube">
        <h1 style="font-size: 30px">Composers</h1>
        <h1>----------------------</h1>
        <h1><a href="/compositores/edit">Edit Classical Music Composers</a></h1>
        <h1><a href="/compositores/add">Add Classical Music Composers</a></h1>
        <h1><a href="/compositores/delete">Delete Classical Music Composers</a></h1>
        <h1> </h1>
        <h1 style="font-size: 30px">Periods</h1>
        <h1>----------------------</h1>
        <h1><a href="/periodos/edit">Edit Eras of Classical Music</a></h1>
        <h1><a href="/periodos/add">Add Eras of Classical Music</a></h1>
        <h1><a href="/periodos/delete">Delete Eras of Classical Music</a></h1>
    </div>
</nav>`);
}

/*
		<nav id="nav">
			<div class="innertube">
				<h1><a href="/">Home</a></h1>
				<h1><a href="/compositores">Classical Music Composers</a></h1>
				<h1><a href="/periodos">Eras of Classical Music</a></h1>
				<h1><a href="/CRUD">CRUD Operations</a></h1>
				<h1><a href="/about">About this Work</a></h1>
			</div>
		</nav>	
*/

function write_nav(res) {
    res.write('<nav id="nav">');
    res.write('<div class="innertube">');
    res.write('<h1><a href="/">Home</a></h1>');
    res.write('<h1><a href="/compositores">Classical Music Composers</a></h1>');
    res.write('<h1><a href="/periodos">Eras of Classical Music</a></h1>');
    res.write('<h1><a href="/CRUD">CRUD Operations</a></h1>');
    res.write('<h1><a href="/about">About this Work</a></h1>');
    res.write('</div>');
    res.write('</nav>');
}

async function write_crud_nav(res) {
    let composers =  await api.get_composers("");
    res.write('<nav id="rightmenu">');
	res.write('<div class="innertube">');
	composers.forEach(composer => {
		res.write('<h1><a href="/compositores/edit/'+composer.id+'">'+composer.name+'</a></h1>');
	});
	res.write('</div>');
	res.write('</nav>');
}


module.exports = { write_head, write_footer, write_nav, write_crud_nav, write_rightmenu_delete, mimeTypes};