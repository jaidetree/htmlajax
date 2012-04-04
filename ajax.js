$(document).ready(function(){
		// It's definitely possible to make the pages load automatically
		// without being defined here. However, it's more secure to be
		// explicit so it can't be used to just load any file... as easily. :D
		var page = '', // The page we get
			pages = { 
			'home': { 
				'html': 'home.html' // The html file to load.
			},
			'about': {
				'html': 'about.html'
			},
			'support': {
				'html': 'support.html'
			},
			'news': {
				'html': 'news.html'
			},
			'help': {
				'html': 'help.html',
				'head': [ // Array of things to put in the header
					'help.css',
				]
			},
			'not_found': { 'html': 'error.html'}
		},
		error_page = "not_found",
		file = null;

	// Load the page the browser is loading. So if you sent someone a link to 
	// file.html#!/about it will load the about page. This also allows for 
	// bookmarking.
	load_page(get_page());

	// Get the page determines what file to load.
	// Returns pages[index] hash which contains the html
	// and head properties.
	function get_page() {
		// Get the url hash. THe #!/data part of the URL address example.html#!/data
		// also replaces the hashbang (#!) which is used for indexing and state
		// saving by the browser.
		page = window.location.hash.replace('#!/','');

		if( ! page )
		{
			return pages['home'];
		}

		if( ! pages[ page ] )
		{
			return pages['not_found'];
		}
		
		return pages[ page ];
	}

	// Loads in that page, uses .page as the body selector.
	// Also loads/removes the header files in the [head]
	// of our pages dictionary.
	// Note it removes files in your head after the last one specified
	function load_page(page) {
		var file = page['html'];
		;
		$.get('./' + file, function(data, textStatus, jqXHR){
			// removes any elements in head that are after your last script include
			$('head :gt(' + $('script:eq(1)').index() + ')').remove(); 
											
			// Loads the content into the <section class="page"> tag
			$('.page').html(data);

			// Work with our headers.
			if( page['head'] )
			{
				for(var i in page['head'])
				{
					var resource = page['head'][i],
						html;
					// auto detect if it's a css or js file.
					if( resource.match(/\.css.*$/) )
					{
						html = document.createElement('link');
						html.setAttribute('rel', 'stylesheet');
						html.setAttribute('type', 'text/css');
						html.setAttribute('href', './' + resource);
						$('head').append(html);
					}
					else if( resource.match(/\.js.*$/) )
					{
						html = document.createElement('script');
						html.setAttribute('type', 'text/javascript');
						html.setAttribute('src', './' . resource);
						$('head').append(html);
					}
				}
			}
		}, 'html');
	}
	
	// Handles data when the hash (#) on the URL changes.
	// like page.html#!/about 
	$(window).on('hashchange', function(){ 
		var page = get_page();
		load_page(page);
	});
});
