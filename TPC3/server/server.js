const http = require("http");
const axios = require("axios");
const url = require("url");
const fs = require('fs');
const path = require('path');

const static_folder = '../static';
const mimeTypes = {'.js': 'text/javascript', '.html': 'text/html', '.css': 'text/css', '.jpg': 'image/jpg', '.png': 'image/png', '.gif': 'image/gif', '.svg': 'image/svg+xml'};

function build_home_page(req, res) {
	const readStream = fs.createReadStream(path.join(__dirname, '../templates/index.html'));
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('<link rel="stylesheet" type="text/css" href="../static/css/Global_page.css">');
	res.write('<link rel="stylesheet" type="text/css" href="../static/css/Home.css">');
	res.write('<script class="u-script" type="text/javascript" src="../static/js/jquery-1.9.1.min.js" defer=""></script>');
	res.write('<script class="u-script" type="text/javascript" src="../static/js/Global_page.js" defer=""></script>');
	res.write('<link id="u-theme-google-font" rel="stylesheet" href="../static/css/GFont_Montserrat.css">');
	res.write('<link id="u-theme-google-font" rel="stylesheet" href="../static/css/GFont_Lobster.css">');
  readStream.pipe(res);
}

function write_header(res) {
  res.write(`
    <header class="u-clearfix u-header" id="sec-5a30">
      <div class="u-clearfix u-sheet u-valign-middle u-sheet-1">
        <nav class="u-menu u-menu-dropdown u-offcanvas u-menu-1">
          <div class="menu-collapse">
            <a class="u-button-style u-nav-link" href="#" aria-label="Open menu">
              <svg class="u-svg-link" viewBox="0 0 24 24">
                <use xlink:href="#menu-hamburger"></use>
              </svg>
              <svg class="u-svg-content" id="menu-hamburger" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <rect y="1" width="16" height="2"></rect>
                  <rect y="7" width="16" height="2"></rect>
                  <rect y="13" width="16" height="2"></rect>
                </g>
              </svg>
            </a>
          </div>
          <div class="u-custom-menu u-nav-container">
            <ul class="u-nav u-unstyled u-nav-1">
              <li class="u-nav-item"><a class="u-button-style u-nav-link" href="/" style="padding: 10px 20px;">Home</a></li>
              <li class="u-nav-item"><a class="u-button-style u-nav-link" href="/about" style="padding: 10px 20px;">About</a></li>
              <li class="u-nav-item"><a class="u-button-style u-nav-link" href="/contact" style="padding: 10px 20px;">Contact</a></li>
            </ul>
          </div>
          <div class="u-custom-menu u-nav-container-collapse">
            <div class="u-black u-container-style u-inner-container-layout u-opacity u-opacity-95 u-sidenav">
              <div class="u-inner-container-layout u-sidenav-overflow">
                <div class="u-menu-close"></div>
                <ul class="u-align-center u-nav u-popupmenu-items u-unstyled u-nav-2">
                  <li class="u-nav-item"><a class="u-button-style u-nav-link" href="/">Home</a></li>
                  <li class="u-nav-item"><a class="u-button-style u-nav-link" href="/about">About</a></li>
                  <li class="u-nav-item"><a class="u-button-style u-nav-link" href="/contact">Contact</a></li>
                </ul>
              </div>
            </div>
            <div class="u-black u-menu-overlay u-opacity u-opacity-70"></div>
          </div>
        </nav>
      </div>
    </header>
  `);
}

function generate_card(movie, res) {

	//let poster = "/static/images/placeholder.jpg";
	let poster = movie['poster_url'];
	if (poster === "Poster not found") {
		poster = "/static/images/placeholder.jpg";
		//poster = "https://via.placeholder.com/150";
	}

	res.write('<div class="u-list-item u-repeater-item" data-href="/filmes/' + movie['id'] + '">');
	res.write('<div class="u-container-layout u-similar-container u-container-layout-1">');
	res.write('<img alt="" class="u-image u-image-contain u-image-default u-image-1" data-image-width="986" data-image-height="403" src="' + poster + '" loading="lazy" data-animation-name="customAnimationIn" data-animation-duration="1500">');
	res.write('<div class="u-container-style u-expanded-width-md u-expanded-width-sm u-expanded-width-xs u-group u-shape-rectangle u-group-1" data-animation-name="customAnimationIn" data-animation-duration="1250" data-animation-delay="250">');
	res.write('<div class="u-container-layout u-container-layout-2">');
	res.write('<h4 class="u-align-left u-text u-text-3">' + movie['title'] + '</h4>');
	res.write('<p class="u-align-left u-text u-text-4">Year: ' + movie['year'] + '</p>');
	res.write('<p class="u-align-left u-text u-text-5">Cast: ' + movie['cast'] + '</p>');
	res.write('</div>');
	res.write('</div>');
	res.write('</div>');
	res.write('</div>');

}


function generate_actor_card(actor, res) {

	let poster = "/static/images/placeholder.jpg";
	//let poster = movie['poster_url'];
	if (poster === "Poster not found") {
		poster = "/static/images/placeholder.jpg";
		//poster = "https://via.placeholder.com/150";
	}
	res.write('<div class="u-list-item u-repeater-item" data-href="/ator/' + actor['id'] + '">');
	res.write('<div class="u-container-layout u-similar-container u-container-layout-1">');
	res.write('<img alt="" class="u-image u-image-contain u-image-default u-image-1" data-image-width="986" data-image-height="403" src="' + poster + '" loading="lazy" data-animation-name="customAnimationIn" data-animation-duration="1500">');
	res.write('<div class="u-container-style u-expanded-width-md u-expanded-width-sm u-expanded-width-xs u-group u-shape-rectangle u-group-1" data-animation-name="customAnimationIn" data-animation-duration="1250" data-animation-delay="250">');
	res.write('<div class="u-container-layout u-container-layout-2">');
	res.write('<h3 class="u-align-left u-text u-text-3">' + actor['name'] + '</h3>');
	res.write('</div>');
	res.write('</div>');
	res.write('</div>');
	res.write('</div>');
}


function generate_genre_card(genre, res) {

	let poster = "/static/images/placeholder.jpg";
	//let poster = movie['poster_url'];
	if (poster === "Poster not found") {
		poster = "/static/images/placeholder.jpg";
		//poster = "https://via.placeholder.com/150";
	}
	res.write('<div class="u-list-item u-repeater-item" data-href="/generos/' + genre['id'] + '">');
	res.write('<div class="u-container-layout u-similar-container u-container-layout-1">');
	res.write('<img alt="" class="u-image u-image-contain u-image-default u-image-1" data-image-width="986" data-image-height="403" src="' + poster + '" loading="lazy" data-animation-name="customAnimationIn" data-animation-duration="1500">');
	res.write('<div class="u-container-style u-expanded-width-md u-expanded-width-sm u-expanded-width-xs u-group u-shape-rectangle u-group-1" data-animation-name="customAnimationIn" data-animation-duration="1250" data-animation-delay="250">');
	res.write('<div class="u-container-layout u-container-layout-2">');
	res.write('<h3 class="u-align-left u-text u-text-3">' + genre['name'] + '</h3>');
	res.write('</div>');
	res.write('</div>');
	res.write('</div>');
	res.write('</div>');
}


function build_genre_list_page(req, res) {
	const queryObject = url.parse(req.url, true).query;
	const page = parseInt(queryObject.page) || 1;
  const limit = parseInt(queryObject.limit) || 5;

	axios.get('http://localhost:3000/genres?_page=' + page + '&_per_page='+ limit).then((response) => {
		let last_page = response.data.last;
		const genres = response.data.data;
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write('<html style="font-size: 16px;" lang="en">');
		res.write('<head>');
		res.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
		res.write('<meta charset="utf-8">');
		res.write('<title>Genre List</title>');
		res.write('<link rel="icon" href="/static/images/favicon.ico">');
		res.write('<meta name="theme-color" content="#3151aa">' +'<meta property="og:title" content="Listings">' + '<meta property="og:type" content="website">' + '<meta data-intl-tel-input-cdn-path="intlTelInput/">');
		res.write('<link rel="stylesheet" type="text/css" href="../static/css/Global_page.css">');
		res.write('<link rel="stylesheet" type="text/css" href="../static/css/Listing.css">');
		res.write('<script class="u-script" type="text/javascript" src="../static/js/jquery-1.9.1.min.js" defer=""></script>');
		res.write('<script class="u-script" type="text/javascript" src="../static/js/Global_page.js" defer=""></script>');
		res.write('<link id="u-theme-google-font" rel="stylesheet" href="../static/css/GFont_Montserrat.css">');
		res.write('<link id="u-theme-google-font" rel="stylesheet" href="../static/css/GFont_Lobster.css">');
		res.write('<meta data-intl-tel-input-cdn-path="/static/intlTelInput/">');
		res.write('</head>');
		res.write('<body data-path-to-root="/" data-include-products="false" class="u-body u-xl-mode" data-lang="en">');
		write_header(res);
		res.write('<section class="u-align-center u-clearfix u-container-align-center u-section-1" id="sec-9718">');
		res.write('<div class="u-clearfix u-sheet u-valign-middle u-sheet-1">');
		res.write('<h2 class="u-align-center u-text u-text-default u-text-1" data-animation-name="customAnimationIn" data-animation-duration="1500">Genre List</h2>');
		res.write('<div class="u-list u-list-1">');
		res.write('<div class="u-repeater u-repeater-1">');
		res.write('<h4 class="u-text u-text-18" data-animation-name="counter" >' + limit + ' Entries per page </h4>');
		res.write('<lt-highlighter style="display: none; z-index: 1 !important;">');
		res.write('<lt-div spellcheck="false" class="lt-highlighter__wrapper" style="width: 1140px; height: 36px; transform: none !important; transform-origin: 570px 18px 0px !important; margin-top: 81px;">');
		res.write('<lt-div class="lt-highlighter__scroll-element" style="top: 0px; left: 0px; width: 1140px; height: 37px;"></lt-div>');
		res.write('</lt-div>');
		res.write('</lt-highlighter>');
		res.write('<h3 class="u-text u-text-18" data-animation-name="counter" data-animation-event="scroll" data-animation-duration="3000">' + page + '</h3>');
    	res.write('<a href="/generos?page=' + (page+1) + '" class="u-btn u-button-style u-btn-1">&gt; </a>');
		res.write('<a href="/generos?page=' + (page-1) + '" class="u-btn u-button-style u-btn-2">&lt; </a>');
		res.write('<a href="/generos" class="u-btn u-button-style u-btn-3">&lt;&lt; </a>');
		res.write('<a href="/generos?page=' + last_page + '" class="u-btn u-button-style u-btn-4">&gt;&gt; </a>');

		genres.forEach((genre) => {
			generate_genre_card(genre, res);
		});
		res.write('</div>');
		res.write('</div>');
		res.write('</div>');
		res.write('<lt-highlighter style="display: none; z-index: 1 !important;">');
		res.write('<lt-div spellcheck="false" class="lt-highlighter__wrapper" style="width: 1140px; height: 36px; transform: none !important; transform-origin: 570px 18px 0px !important; margin-top: 81px;">');
		res.write('<lt-div class="lt-highlighter__scroll-element" style="top: 0px; left: 0px; width: 1140px; height: 37px;"></lt-div>');
		res.write('</lt-div>');
		res.write('</lt-highlighter>');
		res.write('<h3 class="u-text u-text-18" data-animation-name="counter" data-animation-event="scroll" data-animation-duration="3000">' + page + '</h3>');
    	res.write('<a href="/generos?page=' + (page+1) + '" class="u-btn u-button-style u-btn-1">&gt; </a>');
		res.write('<a href="/generos?page=' + (page-1) + '" class="u-btn u-button-style u-btn-2">&lt; </a>');
		res.write('<a href="/generos" class="u-btn u-button-style u-btn-3">&lt;&lt; </a>');
		res.write('<a href="/generos?page=' + last_page + '" class="u-btn u-button-style u-btn-4">&gt;&gt; </a>');
		res.write('</section>');
		res.write('<footer class="u-align-center u-clearfix u-footer u-palette-2-base u-footer" id="sec-6363"><div class="u-clearfix u-sheet u-sheet-1">');
		res.write('<p class="u-small-text u-text u-text-variant u-text-1">Made with 💌. Miguel Gomes ®️ .</p>');
		res.write('</div></footer>');
		res.write('</body>');
		res.write('</html>');
		res.end();
	}).catch((error) => {
		console.log(error);
	});
}

function build_actor_list_page(req, res) {
	const queryObject = url.parse(req.url, true).query;
	const page = parseInt(queryObject.page) || 1;
  const limit = parseInt(queryObject.limit) || 25;

	axios.get('http://localhost:3000/actors?_page=' + page + '&_per_page='+ limit).then((response) => {
		let last_page = response.data.last;
		const actors = response.data.data;
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write('<html style="font-size: 16px;" lang="en">');
		res.write('<head>');
		res.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
		res.write('<meta charset="utf-8">');
		res.write('<title>Actors List</title>');
		res.write('<link rel="icon" href="/static/images/favicon.ico">');
		res.write('<meta name="theme-color" content="#3151aa">' +'<meta property="og:title" content="Listings">' + '<meta property="og:type" content="website">' + '<meta data-intl-tel-input-cdn-path="intlTelInput/">');
		res.write('<link rel="stylesheet" type="text/css" href="../static/css/Global_page.css">');
		res.write('<link rel="stylesheet" type="text/css" href="../static/css/Listing.css">');
		res.write('<script class="u-script" type="text/javascript" src="../static/js/jquery-1.9.1.min.js" defer=""></script>');
		res.write('<script class="u-script" type="text/javascript" src="../static/js/Global_page.js" defer=""></script>');
		res.write('<link id="u-theme-google-font" rel="stylesheet" href="../static/css/GFont_Montserrat.css">');
		res.write('<link id="u-theme-google-font" rel="stylesheet" href="../static/css/GFont_Lobster.css">');
		res.write('<meta data-intl-tel-input-cdn-path="/static/intlTelInput/">');
		res.write('</head>');
		res.write('<body data-path-to-root="/" data-include-products="false" class="u-body u-xl-mode" data-lang="en">');
		write_header(res);
		res.write('<section class="u-align-center u-clearfix u-container-align-center u-section-1" id="sec-9718">');
		res.write('<div class="u-clearfix u-sheet u-valign-middle u-sheet-1">');
		res.write('<h2 class="u-align-center u-text u-text-default u-text-1" data-animation-name="customAnimationIn" data-animation-duration="1500">Actors List</h2>');
		res.write('<div class="u-list u-list-1">');
		res.write('<div class="u-repeater u-repeater-1">');
		res.write('<h4 class="u-text u-text-18" data-animation-name="counter" >' + limit + ' Entries per page </h4>');
		res.write('<lt-highlighter style="display: none; z-index: 1 !important;">');
		res.write('<lt-div spellcheck="false" class="lt-highlighter__wrapper" style="width: 1140px; height: 36px; transform: none !important; transform-origin: 570px 18px 0px !important; margin-top: 81px;">');
		res.write('<lt-div class="lt-highlighter__scroll-element" style="top: 0px; left: 0px; width: 1140px; height: 37px;"></lt-div>');
		res.write('</lt-div>');
		res.write('</lt-highlighter>');
		res.write('<h3 class="u-text u-text-18" data-animation-name="counter" data-animation-event="scroll" data-animation-duration="3000">' + page + '</h3>');
    	res.write('<a href="/ator?page=' + (page+1) + '" class="u-btn u-button-style u-btn-1">&gt; </a>');
		res.write('<a href="/ator?page=' + (page-1) + '" class="u-btn u-button-style u-btn-2">&lt; </a>');
		res.write('<a href="/ator" class="u-btn u-button-style u-btn-3">&lt;&lt; </a>');
		res.write('<a href="/ator?page=' + last_page + '" class="u-btn u-button-style u-btn-4">&gt;&gt; </a>');

		actors.forEach((actor) => {
			generate_actor_card(actor, res);
		});
		res.write('</div>');
		res.write('</div>');
		res.write('</div>');
		res.write('<lt-highlighter style="display: none; z-index: 1 !important;">');
		res.write('<lt-div spellcheck="false" class="lt-highlighter__wrapper" style="width: 1140px; height: 36px; transform: none !important; transform-origin: 570px 18px 0px !important; margin-top: 81px;">');
		res.write('<lt-div class="lt-highlighter__scroll-element" style="top: 0px; left: 0px; width: 1140px; height: 37px;"></lt-div>');
		res.write('</lt-div>');
		res.write('</lt-highlighter>');
		res.write('<h3 class="u-text u-text-18" data-animation-name="counter" data-animation-event="scroll" data-animation-duration="3000">' + page + '</h3>');
    	res.write('<a href="/ator?page=' + (page+1) + '" class="u-btn u-button-style u-btn-1">&gt; </a>');
		res.write('<a href="/ator?page=' + (page-1) + '" class="u-btn u-button-style u-btn-2">&lt; </a>');
		res.write('<a href="/ator" class="u-btn u-button-style u-btn-3">&lt;&lt; </a>');
		res.write('<a href="/ator?page=' + last_page + '" class="u-btn u-button-style u-btn-4">&gt;&gt; </a>');
		res.write('</section>');
		res.write('<footer class="u-align-center u-clearfix u-footer u-palette-2-base u-footer" id="sec-6363"><div class="u-clearfix u-sheet u-sheet-1">');
		res.write('<p class="u-small-text u-text u-text-variant u-text-1">Made with 💌. Miguel Gomes ®️ .</p>');
		res.write('</div></footer>');
		res.write('</body>');
		res.write('</html>');
		res.end();
	}).catch((error) => {
		console.log(error);
	});
}

function build_movie_list_page(req, res) {
	const queryObject = url.parse(req.url, true).query;
	const page = parseInt(queryObject.page) || 1;
  const limit = parseInt(queryObject.limit) || 25;

	axios.get('http://localhost:3000/movies?_page=' + page + '&_per_page='+ limit).then((response) => {
		let last_page = response.data.last;
		const movies = response.data.data;
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write('<html style="font-size: 16px;" lang="en">');
		res.write('<head>');
		res.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
		res.write('<meta charset="utf-8">');
		res.write('<title>Movies List</title>');
		res.write('<link rel="icon" href="/static/images/favicon.ico">');
		res.write('<meta name="theme-color" content="#3151aa">' +'<meta property="og:title" content="Listings">' + '<meta property="og:type" content="website">' + '<meta data-intl-tel-input-cdn-path="intlTelInput/">');
		res.write('<link rel="stylesheet" type="text/css" href="../static/css/Global_page.css">');
		res.write('<link rel="stylesheet" type="text/css" href="../static/css/Listing.css">');
		res.write('<script class="u-script" type="text/javascript" src="../static/js/jquery-1.9.1.min.js" defer=""></script>');
		res.write('<script class="u-script" type="text/javascript" src="../static/js/Global_page.js" defer=""></script>');
		res.write('<link id="u-theme-google-font" rel="stylesheet" href="../static/css/GFont_Montserrat.css">');
		res.write('<link id="u-theme-google-font" rel="stylesheet" href="../static/css/GFont_Lobster.css">');
		res.write('<meta data-intl-tel-input-cdn-path="/static/intlTelInput/">');
		res.write('</head>');
		res.write('<body data-path-to-root="/" data-include-products="false" class="u-body u-xl-mode" data-lang="en">');
		write_header(res);
		res.write('<section class="u-align-center u-clearfix u-container-align-center u-section-1" id="sec-9718">');
		res.write('<div class="u-clearfix u-sheet u-valign-middle u-sheet-1">');
		res.write('<h2 class="u-align-center u-text u-text-default u-text-1" data-animation-name="customAnimationIn" data-animation-duration="1500">Movie List</h2>');
		res.write('<div class="u-list u-list-1">');
		res.write('<div class="u-repeater u-repeater-1">');
		res.write('<h4 class="u-text u-text-18" data-animation-name="counter" >' + limit + ' Entries per page </h4>');
		res.write('<lt-highlighter style="display: none; z-index: 1 !important;">');
		res.write('<lt-div spellcheck="false" class="lt-highlighter__wrapper" style="width: 1140px; height: 36px; transform: none !important; transform-origin: 570px 18px 0px !important; margin-top: 81px;">');
		res.write('<lt-div class="lt-highlighter__scroll-element" style="top: 0px; left: 0px; width: 1140px; height: 37px;"></lt-div>');
		res.write('</lt-div>');
		res.write('</lt-highlighter>');
		res.write('<h3 class="u-text u-text-18" data-animation-name="counter" data-animation-event="scroll" data-animation-duration="3000">' + page + '</h3>');
    	res.write('<a href="/filmes?page=' + (page+1) + '" class="u-btn u-button-style u-btn-1">&gt; </a>');
		res.write('<a href="/filmes?page=' + (page-1) + '" class="u-btn u-button-style u-btn-2">&lt; </a>');
		res.write('<a href="/filmes" class="u-btn u-button-style u-btn-3">&lt;&lt; </a>');
		res.write('<a href="/filmes?page=' + last_page + '" class="u-btn u-button-style u-btn-4">&gt;&gt; </a>');

		movies.forEach((movie) => {
			generate_card(movie, res);
		});
		res.write('</div>');
		res.write('</div>');
		res.write('</div>');
		res.write('<lt-highlighter style="display: none; z-index: 1 !important;">');
		res.write('<lt-div spellcheck="false" class="lt-highlighter__wrapper" style="width: 1140px; height: 36px; transform: none !important; transform-origin: 570px 18px 0px !important; margin-top: 81px;">');
		res.write('<lt-div class="lt-highlighter__scroll-element" style="top: 0px; left: 0px; width: 1140px; height: 37px;"></lt-div>');
		res.write('</lt-div>');
		res.write('</lt-highlighter>');
		res.write('<h3 class="u-text u-text-18" data-animation-name="counter" data-animation-event="scroll" data-animation-duration="3000">' + page + '</h3>');
    	res.write('<a href="/filmes?page=' + (page+1) + '" class="u-btn u-button-style u-btn-1">&gt; </a>');
		res.write('<a href="/filmes?page=' + (page-1) + '" class="u-btn u-button-style u-btn-2">&lt; </a>');
		res.write('<a href="/filmes" class="u-btn u-button-style u-btn-3">&lt;&lt; </a>');
		res.write('<a href="/filmes?page=' + last_page + '" class="u-btn u-button-style u-btn-4">&gt;&gt; </a>');
		res.write('</section>');
		res.write('<footer class="u-align-center u-clearfix u-footer u-palette-2-base u-footer" id="sec-6363"><div class="u-clearfix u-sheet u-sheet-1">');
		res.write('<p class="u-small-text u-text u-text-variant u-text-1">Made with 💌. Miguel Gomes ®️ .</p>');
		res.write('</div></footer>');
		res.write('</body>');
		res.write('</html>');
		res.end();
	}).catch((error) => {
		console.log(error);
	});
}

function create_movie_line(movie, res) {
	res.write('<div class="u-container-style u-list-item u-repeater-item u-list-item-1" data-animation-name="customAnimationIn" data-animation-duration="2000" data-animation-delay="0">');
	res.write('<div class="u-container-layout u-similar-container u-container-layout-1">');
	res.write('<img class="listing" src="'+ movie['poster'] +'" alt="">')
	let link = '<a href="/filmes/' + movie['id'] + '">' + movie['title'] + '</a>';
	res.write('<p class="u-text u-text-default u-text-3">' + link + '</p>');
	res.write('</div>');
	res.write('</div>');
}


function create_cast_line(actor, res) {
	res.write('<div class="u-container-style u-list-item u-repeater-item u-list-item-1" data-animation-name="customAnimationIn" data-animation-duration="2000" data-animation-delay="0">');
	res.write('<div class="u-container-layout u-similar-container u-container-layout-1">');
	let link = '<a href="/ator/' + actor['id'] + '">' + actor['name'] + '</a>';
	res.write('<p class="u-text u-text-default u-text-3">' + link + '</p>');
	res.write('</div>');
	res.write('</div>');
}



async function build_actor_page(req, res) {
	let actor_id = req.url.split("/")[req.url.split("/").length - 1];
	actor_id = actor_id.split("?")[0];
	const queryObject = url.parse(req.url, true).query;
	const page = parseInt(queryObject.page) || 1;
  	const limit = parseInt(queryObject.limit) || 25;

	let actor_data = await get_actor_information(actor_id, page, limit);
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('<head>');
	res.write('<link rel="stylesheet" type="text/css" href="../static/css/Global_page.css">');
	res.write('<link rel="stylesheet" type="text/css" href="../static/css/Item.css">');
	res.write('<script class="u-script" type="text/javascript" src="../static/js/jquery-1.9.1.min.js" defer=""></script>');
	res.write('<script class="u-script" type="text/javascript" src="../static/js/Global_page.js" defer=""></script>');
	res.write('<link id="u-theme-google-font" rel="stylesheet" href="../static/css/GFont_Montserrat.css">');
	res.write('<link id="u-theme-google-font" rel="stylesheet" href="../static/css/GFont_Lobster.css">');
	res.write('<html style="font-size: 16px;" lang="en">');
	res.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
	res.write('<meta charset="utf-8">');
	res.write('<title>Actor</title>');
	res.write('<link rel="icon" href="/static/images/favicon.ico">');
	res.write('<meta name="theme-color" content="#3151aa">');
	res.write('<meta property="og:title" content="Item">');
	res.write('<meta property="og:type" content="website">');
	res.write('</head>');
	res.write('<body data-path-to-root="/" data-include-products="false" class="u-body u-xl-mode" data-lang="en">');
	write_header(res);
	res.write('<section class="u-clearfix u-section-1" id="carousel_c31b">');
	res.write('<div class="u-clearfix u-sheet u-valign-middle u-sheet-1">');
	res.write('<div class="data-layout-selected u-clearfix u-expanded-width u-layout-wrap u-layout-wrap-1">');
	res.write('<div class="u-layout">');
	res.write('<div class="u-layout-row">');
	res.write('<div class="u-container-style u-layout-cell u-shape-rectangle u-size-32 u-layout-cell-1">');
	res.write('<div class="u-container-layout u-container-layout-1">');
	res.write('<h2 class="u-text u-text-1">'+ actor_data['name'] +'</h2>');
	res.write('<img src="/static/images/placeholder.jpg" alt="">');
	res.write('</div>');
	res.write('</div>');
	res.write('<div class="u-align-left u-container-style u-layout-cell u-shape-rectangle u-size-28 u-layout-cell-2">');
	res.write('<div class="u-container-layout u-valign-middle u-container-layout-2">');
	res.write('<p class="u-text u-text-default u-text-2"> Actor about (...) </p>');
	res.write('</div>');
	res.write('</div>');
	res.write('</div>');
	res.write('</div>');
	res.write('</div>');
	res.write('</div>');
	res.write('</section>')
	res.write('<section class="u-clearfix u-container-align-center u-palette-1-base u-section-2" id="carousel_1389">');
	res.write('<div class="u-clearfix u-sheet u-sheet-1">');
	res.write('<div class="u-expanded-width u-list u-list-1">');
	res.write('<h5 class="u-text u-text-default u-text-2"> Movies</h5>');
	res.write('<div class="u-repeater u-repeater-1">');
	if (actor_data['movies'].length == 0) {
		res.write('<h5 class="u-text u-text-default u-text-2"> Movies not available</h5>');
	}
	actor_data['movies'].forEach((movie) => {
		create_movie_line(movie, res);
	});
	res.write('</div>');
	res.write('</div>');
	res.write('</div>');
	res.write('<section class="u-align-center u-clearfix u-container-align-center">');
	res.write('<h3 class="u-text u-text-18" data-animation-name="counter" data-animation-event="scroll" data-animation-duration="3000">' + page + '</h3>');
	res.write('<a href="/ator/'+actor_id+'?page=' + (page+1) + '" class="u-btn u-button-style u-btn-1">&gt; </a>');
	res.write('<a href="/ator/'+actor_id+'?page=' + (page-1) + '" class="u-btn u-button-style u-btn-2">&lt; </a>');
	res.write('</section>');
	res.write('</section>');
	res.write('<footer class="u-align-center u-clearfix u-footer u-palette-2-base u-footer" id="sec-6363"><div class="u-clearfix u-sheet u-sheet-1">');
	res.write('<p class="u-small-text u-text u-text-variant u-text-1">Made with 💌. Miguel Gomes ®️ .</p>');
	res.write('</div></footer>');
	res.write('</body>');
	res.write('</html>');
	res.end();
}

async function build_genre_page(req, res) {
	let genre_id = req.url.split("/")[req.url.split("/").length - 1];
	genre_id = genre_id.split("?")[0];
	const queryObject = url.parse(req.url, true).query;
	const page = parseInt(queryObject.page) || 1;
  	const limit = parseInt(queryObject.limit) || 25;

	let genre_data = await get_genre_information(genre_id, page, limit);
	if (genre_data['poster'] === "Poster not found") {
		genre_data['poster'] = "/static/images/placeholder.jpg";
	}
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('<head>');
	res.write('<link rel="stylesheet" type="text/css" href="../static/css/Global_page.css">');
	res.write('<link rel="stylesheet" type="text/css" href="../static/css/Item.css">');
	res.write('<script class="u-script" type="text/javascript" src="../static/js/jquery-1.9.1.min.js" defer=""></script>');
	res.write('<script class="u-script" type="text/javascript" src="../static/js/Global_page.js" defer=""></script>');
	res.write('<link id="u-theme-google-font" rel="stylesheet" href="../static/css/GFont_Montserrat.css">');
	res.write('<link id="u-theme-google-font" rel="stylesheet" href="../static/css/GFont_Lobster.css">');
	res.write('<html style="font-size: 16px;" lang="en">');
	res.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
	res.write('<meta charset="utf-8">');
	res.write('<title>Genre</title>');
	res.write('<link rel="icon" href="/static/images/favicon.ico">');
	res.write('<meta name="theme-color" content="#3151aa">');
	res.write('<meta property="og:title" content="Item">');
	res.write('<meta property="og:type" content="website">');
	res.write('</head>');
	res.write('<body data-path-to-root="/" data-include-products="false" class="u-body u-xl-mode" data-lang="en">');
	write_header(res);
	res.write('<section class="u-clearfix u-section-1" id="carousel_c31b">');
	res.write('<div class="u-clearfix u-sheet u-valign-middle u-sheet-1">');
	res.write('<div class="data-layout-selected u-clearfix u-expanded-width u-layout-wrap u-layout-wrap-1">');
	res.write('<div class="u-layout">');
	res.write('<div class="u-layout-row">');
	res.write('<div class="u-container-style u-layout-cell u-shape-rectangle u-size-32 u-layout-cell-1">');
	res.write('<div class="u-container-layout u-container-layout-1">');
	res.write('<h2 class="u-text u-text-1">'+ genre_data['name'] +'</h2>');
	res.write('<img src="'+ genre_data['poster'] +'" alt="">');
	res.write('</div>');
	res.write('</div>');
	res.write('<div class="u-align-left u-container-style u-layout-cell u-shape-rectangle u-size-28 u-layout-cell-2">');
	res.write('<div class="u-container-layout u-valign-middle u-container-layout-2">');
	res.write('<p class="u-text u-text-default u-text-2"> Genre about (...) </p>');
	res.write('</div>');
	res.write('</div>');
	res.write('</div>');
	res.write('</div>');
	res.write('</div>');
	res.write('</div>');
	res.write('</section>')
	res.write('<section class="u-clearfix u-container-align-center u-palette-1-base u-section-2" id="carousel_1389">');
	res.write('<div class="u-clearfix u-sheet u-sheet-1">');
	res.write('<div class="u-expanded-width u-list u-list-1">');
	res.write('<div class="u-repeater u-repeater-1">');
	res.write('<h5 class="u-text u-text-default u-text-2"> Related Movies</h5>');
	if (genre_data['movies'].length == 0) {
		res.write('<h5 class="u-text u-text-default u-text-2"> Movies not available</h5>');
	}
	genre_data['movies'].forEach((movie) => {
		create_movie_line(movie, res);
	});
	res.write('</div>');
	res.write('</div>');
	res.write('</div>');
	res.write('<section class="u-align-center u-clearfix u-container-align-center" style="margin: 0 auto; width: 656px; text-align: center;">');
	res.write('<h3 class="u-text u-text-18" data-animation-name="counter" data-animation-event="scroll" data-animation-duration="3000">' + page + '</h3>');
	res.write('<a href="/generos/'+genre_id+'?page=' + (page+1) + '"  class="u-btn u-button-style u-btn-1">&gt; </a>');
	res.write('<a href="/generos/'+genre_id+'?page=' + (page-1) + '"  class="u-btn u-button-style u-btn-2">&lt; </a>');
	res.write('</section>');
	res.write('</section>');
	res.write('<footer class="u-align-center u-clearfix u-footer u-palette-2-base u-footer" id="sec-6363"><div class="u-clearfix u-sheet u-sheet-1">');
	res.write('<p class="u-small-text u-text u-text-variant u-text-1">Made with 💌. Miguel Gomes ®️ .</p>');
	res.write('</div></footer>');
	res.write('</body>');
	res.write('</html>');
	res.end();
}


async function build_movie_page(req, res) {
	let movie_id = req.url.split("/")[req.url.split("/").length - 1];

	let movie_data = await get_movie_information(movie_id);
	if (movie_data['poster'] === "Poster not found") {
		movie_data['poster'] = "/static/images/placeholder.jpg";
	}
	if (movie_data['cast'].length == 0) {
		movie_data['cast'] = ["No cast found"];
	}
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('<head>');
	res.write('<link rel="stylesheet" type="text/css" href="../static/css/Global_page.css">');
	res.write('<link rel="stylesheet" type="text/css" href="../static/css/Item.css">');
	res.write('<script class="u-script" type="text/javascript" src="../static/js/jquery-1.9.1.min.js" defer=""></script>');
	res.write('<script class="u-script" type="text/javascript" src="../static/js/Global_page.js" defer=""></script>');
	res.write('<link id="u-theme-google-font" rel="stylesheet" href="../static/css/GFont_Montserrat.css">');
	res.write('<link id="u-theme-google-font" rel="stylesheet" href="../static/css/GFont_Lobster.css">');
	res.write('<html style="font-size: 16px;" lang="en">');
	res.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
	res.write('<meta charset="utf-8">');
	res.write('<title>Movie</title>');
	res.write('<link rel="icon" href="/static/images/favicon.ico">');
	res.write('<meta name="theme-color" content="#3151aa">');
	res.write('<meta property="og:title" content="Item">');
	res.write('<meta property="og:type" content="website">');
	res.write('</head>');
	res.write('<body data-path-to-root="/" data-include-products="false" class="u-body u-xl-mode" data-lang="en">');
	write_header(res);
	res.write('<section class="u-clearfix u-section-1" id="carousel_c31b">');
	res.write('<div class="u-clearfix u-sheet u-valign-middle u-sheet-1">');
	res.write('<div class="data-layout-selected u-clearfix u-expanded-width u-layout-wrap u-layout-wrap-1">');
	res.write('<div class="u-layout">');
	res.write('<div class="u-layout-row">');
	res.write('<div class="u-container-style u-layout-cell u-shape-rectangle u-size-32 u-layout-cell-1">');
	res.write('<div class="u-container-layout u-container-layout-1">');
	res.write('<h2 class="u-text u-text-1">'+ movie_data['title'] +'</h2>');
	res.write('<img src="'+ movie_data['poster'] +'" alt="">');
	res.write('</div>');
	res.write('</div>');
	res.write('<div class="u-align-left u-container-style u-layout-cell u-shape-rectangle u-size-28 u-layout-cell-2">');
	res.write('<div class="u-container-layout u-valign-middle u-container-layout-2">');
	res.write('<p class="u-text u-text-default u-text-2"> Movie about (...) </p>');
	res.write('<p class="u-text u-text-default u-text-3">Genres:');
	if (movie_data['genres'].length == 0) {
		res.write("No genres found");
	}
	else {
		movie_data['genres'].forEach((genre) => {
			res.write('<a href="/generos/' + genre['id'] + '">' + genre['name'] + '</a> ');
		});
	}
	res.write
	res.write('</div>');
	res.write('</div>');
	res.write('</div>');
	res.write('</div>');
	res.write('</div>');
	res.write('</div>');
	res.write('</section>');

	res.write('<section class="u-clearfix u-container-align-center u-palette-1-base u-section-2" id="carousel_1389">');
	res.write('<div class="u-clearfix u-sheet u-sheet-1">');
	res.write('<div class="u-expanded-width u-list u-list-1">');
	res.write('<div class="u-repeater u-repeater-1">');
	res.write('<h5 class="u-text u-text-default u-text-2"> Cast</h5>');
	if (movie_data['cast'].length == 0) {
		res.write('<h5 class="u-text u-text-default u-text-2"> Cast not available</h5>');
	}
	movie_data['cast'].forEach((actor) => {
		create_cast_line(actor, res);
	});
	res.write('</div>');
	res.write('</div>');
	res.write('</div>');
	res.write('</section>');
	res.write('<footer class="u-align-center u-clearfix u-footer u-palette-2-base u-footer" id="sec-6363"><div class="u-clearfix u-sheet u-sheet-1">');
	res.write('<p class="u-small-text u-text u-text-variant u-text-1">Made with 💌. Miguel Gomes ®️ .</p>');
	res.write('</div></footer>');
	res.write('</body>');
	res.write('</html>');
	res.end();
}


function build_about_page(req, res) {
	const readStream = fs.createReadStream(path.join(__dirname, '../templates/about.html'));
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('<link rel="stylesheet" type="text/css" href="../static/css/Global_page.css">');
	res.write('<link rel="stylesheet" type="text/css" href="../static/css/About.css">');
	res.write('<script class="u-script" type="text/javascript" src="../static/js/jquery-1.9.1.min.js" defer=""></script>');
	res.write('<script class="u-script" type="text/javascript" src="../static/js/Global_page.js" defer=""></script>');
	res.write('<link id="u-theme-google-font" rel="stylesheet" href="../static/css/GFont_Montserrat.css">');
	res.write('<link id="u-theme-google-font" rel="stylesheet" href="../static/css/GFont_Lobster.css">');
	readStream.pipe(res);
}

function build_404_page(req, res) {
	res.writeHead(404, {'Content-Type': 'text/html'});
	res.write('<link rel="icon" type="image/x-icon" href="/static/images/favicon.ico">');
	res.write('<link rel="stylesheet" type="text/css" href="../static/css/Global_page.css">');
	res.write('<link rel="stylesheet" type="text/css" href="../static/css/404.css">');
	res.write('<script class="u-script" type="text/javascript" src="../static/js/jquery-1.9.1.min.js" defer=""></script>');
	res.write('<script class="u-script" type="text/javascript" src="../static/js/Global_page.js" defer=""></script>');
	res.write('<link id="u-theme-google-font" rel="stylesheet" href="../static/css/GFont_Montserrat.css">');
	res.write('<link id="u-theme-google-font" rel="stylesheet" href="../static/css/GFont_Lobster.css">');
	res.end("<h1>404: Page Not Found!</h1>");
}


// Refer to : {https://chat.openai.com/share/2aa01f3c-f085-4b7e-9dab-4223c97909b0}
function feed_static_file(req, res) {
	const resolvedBase = path.resolve(static_folder+"/../")
	const safeSuffix = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '');
  const fileLoc = path.join(resolvedBase, safeSuffix);
	fs.readFile(fileLoc, (err, data) => {
    if (err) {
      res.writeHead(404, 'Not Found');
      res.write('404: File Not Found!');
      return res.end();
    }

    // Content-Type based on the file extension
		let ext = path.parse(fileLoc).ext;
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    res.write(data);
    return res.end();
  });
}

function send_favicon(req, res) {
	// Serve the favicon.ico file
  const faviconPath = path.join(__dirname, 'static', 'favicon.ico');
  fs.readFile(faviconPath, (err, data) => {
  	if (err) {
      res.writeHead(404, 'Not Found');
      res.end();
    } else {
      res.writeHead(200, { 'Content-Type': 'image/x-icon' });
      res.end(data);
    }
  });
}

async function get_actor_information(actor_id, page, limit){
	let actor_info = {};

	try {
		// Fetch actor information
		const response = await axios.get(`http://localhost:3000/actors/${actor_id}`);
		actor_info = {
			name: response.data['name'],
			movies: [], // This will be an array of objects { title, id }
		};
		let from_item = (page - 1) * limit;
		let to_item = from_item + limit;

		for (const movie of response.data['movies'].slice(from_item, to_item)) {
			try {
			const response_m = await axios.get(`http://localhost:3000/movies?_id=${movie}`);
			if (response_m.data[0]['poster_url'] === "Poster not found") {
				response_m.data[0]['poster_url'] = "/static/images/placeholder.jpg";
			}
			actor_info.movies.push({ title: response_m.data[0]['title'], id: response_m.data[0]['id'], poster: response_m.data[0]['poster_url']});
			} catch (error) {
				console.log(`Error fetching movie ID for ${movie}:`, error);
			}
		}

		return actor_info;
		} catch (error) {

			console.error("Failed to fetch actor information:", error);
		}
}

async function get_genre_information(genre_id, page, limit){
	let genre_info = {};
	let from_item = (page - 1) * limit;
	let to_item = from_item + limit;
	
	try {
		const response = await axios.get(`http://localhost:3000/genres/${genre_id}`);

		genre_info = {
			name: response.data['name'],
			//poster: response.data['poster_url'],
			poster: "/static/images/placeholder.jpg",
			movies: [],
		};

		for (const movie of response.data['movies'].slice(from_item, to_item)) {
			try {
			const response_m = await axios.get(`http://localhost:3000/movies?_id=${movie}`);
			if (response_m.data[0]['poster_url'] === "Poster not found") {
				response_m.data[0]['poster_url'] = "/static/images/placeholder.jpg";
			}
			genre_info.movies.push({ title: response_m.data[0]['title'], id: response_m.data[0]['id'], poster: response_m.data[0]['poster_url']});
			} catch (error) {
			console.log(`Error fetching movie ID for ${movie}:`, error);
			}
		}

	return genre_info;

	}catch (error) {
		console.error("Failed to fetch genre information:", error);
	}

}

async function get_movie_information(movie_id) {
    let movie_info = {};

    try {
        // Fetch movie information
        const response = await axios.get(`http://localhost:3000/movies/${movie_id}`);
        movie_info = {
            title: response.data['title'],
            year: response.data['year'],
            poster: response.data['poster_url'],
            genres: [], // This will be an array of objects { name, id }
            cast: [], // This will be an array of objects { name, id }
        };

        // Fetch genre IDs and update genres with { name, id }
        for (const genre of response.data['genres']) {
            try {
                const response_g = await axios.get(`http://localhost:3000/genres?name=${genre}`);
                movie_info.genres.push({ name: genre, id: response_g.data[0]['id'] });
            } catch (error) {
                console.log(`Error fetching genre ID for ${genre}:`, error);
            }
        }

        // Fetch actor IDs and update cast with { name, id }
        for (const actor of response.data['cast']) {
            try {
                const response_a = await axios.get(`http://localhost:3000/actors?name=${actor}`);
                movie_info.cast.push({ name: actor, id: response_a.data[0]['id'] });
            } catch (error) {
                console.log(`Error fetching actor ID for ${actor}:`, error);
            }
        }
    } catch (error) {
        console.error("Failed to fetch movie information:", error);
    }

    return movie_info;
}


const router = function route_manager(req, res) {
	console.log( req.method + ' - ' + req.url);
	const queryObject = url.parse(req.url, true);

	// FEED STATIC FILES (CSS, JS, IMAGES)
	if (req.url.includes("/static")) {
		feed_static_file(req, res);
		return;
	}

	// respond to single actor page
	if (req.url.includes("/atores/")) {
		build_actor_page(req, res);
		return;
	}

	// respond to single movie page
	if (req.url.includes("/filmes/")) {
		build_movie_page(req, res);
		return;
	}
	else if (req.url.includes("/filmes")) {
		build_movie_list_page(req, res);
		return;
	}

	// respond to single genre page
	if (req.url.includes("/generos/")) {
		build_genre_page(req, res);
		return;
	}
	else if (req.url.includes("/generos")) {
		build_genre_list_page(req, res);
		return;
	}

	if (req.url.includes("/ator/")) {
		build_actor_page(req, res);
		return;
	}
	else if (req.url.includes("/ator")) {
		build_actor_list_page(req, res);
		return;
	}

	// catch any other request
	switch (req.url) {
		case "/":
			// Home page
			build_home_page(req, res);
			break;

		case "/about":
			// About page
			build_about_page(req, res);
			break;

		case "/static/images/favicon.ico":
			// Favicon feed
			send_favicon(req, res);
			break;

		default:
			// 404 page
			build_404_page(req, res);
			break;
	}

}

const server = http.createServer(router);

server.listen(8080, () => {
  console.log(`Server running at http://localhost:8080/`);
});

