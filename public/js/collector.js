(function($) {
	$.collector = function(el, term, options){
		var base = this;

		// Access to jQuery and DOM versions of element
		base.$el = $(el);
		base.el = el;

		// Add a reverse reference to the DOM object
		base.$el.data("collector", base);

		// Set up instance variables
		base.tweets = [];
		base.refresh_url = '';

		base.init = function(){
			if( typeof( term ) === "undefined" || term === null ) term = "";

			base.term = term;

			base.options = $.extend({},$.collector.defaultOptions, options);

			base.load("http://search.twitter.com/search.json", 1);

		};

		base.load = function(url, max_depth) {
			console.log(url);
			$.ajax({
				dataType: "jsonp",
				url: url,
				data: {
					q: base.term,
					rpp: 100
				}
			})
			.done(function(data) {

				console.log(data);

				// Refresh the document
				base.refresh();

				// Load more, or set up refreshes
				if(max_depth > 0 && "next_page" in data) {
					base.load("http://search.twitter.com/search.json" + data.next_page, max_depth-1);
				} else if ("refresh_url" in data) {
					setTimeout(function() {
						base.load("http://search.twitter.com/search.json" + data.refresh_url);
					},15000);
				}
			})
		}

		base.refresh() = function() {

		}

		// Run initializer
		base.init();
	};

	$.collector.defaultOptions = {
		caching: false
	};

	$.fn.collector = function(term, options){
		return this.each(function(){
			(new $.collector(this, term, options));
		});
	};
})(jQuery)