(function($) {
	var CHAR_MAP = [33,34,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190];
	var ascii_to_int = function(string) { // right now assumes it will either be 1 or two chars long)
		if(string.length == 1)
			return CHAR_MAP.indexOf(string.charAt(0));
		if(string.length == 2)
			return CHAR_MAP.indexOf(string.charCodeAt(0)) * CHAR_MAP.length + CHAR_MAP.indexOf(string.charCodeAt(1));
    }

    var int_to_ascii = function(x, character_count) {
        if(x > CHAR_MAP.length*CHAR_MAP.length)
            return ("[ERR: TOO LARGE]");
        if(x < CHAR_MAP.length && character_count != 2)
            return String.fromCharCode(CHAR_MAP[x]);
        return String.fromCharCode(CHAR_MAP[Math.floor(x/CHAR_MAP.length)]) + String.fromCharCode(CHAR_MAP[x % CHAR_MAP.length]);
    }


    var parse_tweet = function(text) {
    	var message = "";
    	var checksum = "";
    	var checksum_index = text.lastIndexOf(' ') + 1;
    	var message_end_index = text.lastIndexOf('#') - 1;
    	if(checksum_index != -1 && (checksum_index + 7 <= text.length) && text[checksum_index] == int_to_ascii(1))
    		checksum = text.substr(checksum_index, 7);
    	if(message_end_index >= 1)
    		message = text.substr(0,message_end_index);
		return {
			'message': message,
			'checksum': checksum
		}
	}

	$.collector = function(el, identifier, options){
		var base = this;

		// Access to jQuery and DOM versions of element
		base.$el = $(el);
		base.el = el;

		// Add a reverse reference to the DOM object
		base.$el.data("collector", base);

		// Set up instance variables
		base.tweets = [];
		base.texts = [];
		base.refresh_url = '';
		base.total_texts = 0;


		base.init = function(){
			if( typeof( identifier ) === "undefined" || identifier === null ) identifier = "";

			base.identifier = identifier;

			base.options = $.extend({},$.collector.defaultOptions, options);

			base.$el.empty();

			var $instructions = $("<div />")
                .addClass("instructions")
                .appendTo(base.$el);

            var $headline = $("<h2 />")
                .text("Document " + base.identifier)
                .appendTo($instructions);

            var $details1 = $("<p />")
                .html("Below is a collective document.  It is being generated based on messages sent to Twitter.  You can share this document ")
                .appendTo($instructions);

            var $helpLink = $("<a />")
                .addClass("link")
                .attr("target", "_blank")
                .attr("href", window.location.href.split('?')[0] + "?cd=" + base.identifier)
                .text("using this link.")
                .appendTo($details1);

            var $details2 = $("<p />")
                .html("Green content is verified, red content is unverified, black content is currently missing.")
                .appendTo($instructions);


			var $tweets = $("<div />")
				.addClass("tweets")
				.appendTo(base.$el);
			base.$tweets = $tweets;

			base.load("http://search.twitter.com/search.json", 1);

		};

		base.load = function(url, max_depth) {
			$.ajax({
				dataType: "jsonp",
				url: url,
				data: {
					q: base.identifier,
					rpp: 100
				}
			})
			.done(function(data) {
				for(var x in data.results) {
					tweet = data.results[x];
					base.tweets[tweet.id_str] = tweet;
				}

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

		base.refresh = function() {
			var verify_tweets = function(tweetBuckets) {
				var approved_data = [];
				for(var x in tweetBuckets) {
					var bucket = tweetBuckets[x];
					for(var y in bucket) {
						var next_data = bucket[y];
						if(next_data.checksum.length==7) { // Sanity check
							if(!((x==0?tweetBuckets.length:x)-1 in approved_data)) {
								next_data.isVerified = 0;
								approved_data[x] = next_data;
							} else if (verify_checksums(approved_data[(x==0?tweetBuckets.length:x)-1], next_data)) {
								next_data.isVerified = 1;
								approved_data[x] = next_data;
							}
						}
					}
				}
				return approved_data;
			}

			var verify_checksums = function(d1,d2) {
				if(d1 == null || d2 == null || d1.checksum < 7 || d2.checksum < 7)
					return false;
				var m1 = d1["message"];
				var c_sum1 = d1["checksum"];
				var g_sum1 = generate_mod_checksum(m1);
				var m2 = d2["message"];
				var c_sum2 = d2["checksum"];
				var g_sum2 = generate_mod_checksum(m2);
				return c_sum1[0] == c_sum2[0] && g_sum1 == c_sum2[1] && g_sum2 == c_sum1[2] && c_sum1.substr(3,2) == c_sum2.substr(3,2);
			}

			var generate_mod_checksum = function(text) {
				total = 1;
				for(var x in text) {
					var ch = text[x];
					total = (total * ch.charCodeAt(0)) % 61
				}
				return int_to_ascii(total);
			}

			var tweetBuckets = [];
			for(var x in base.tweets) {
				var tweet = base.tweets[x];
				var parsed_tweet = parse_tweet(tweet.text);
				var index = ascii_to_int(parsed_tweet.checksum.substr(5,2));
				if(!(index in tweetBuckets))
					tweetBuckets[index] = []

				tweetBuckets[index].push(parsed_tweet);
			}

			var verified_tweets = verify_tweets(tweetBuckets);
			var slot_count = 0;

			for(var x in verified_tweets) {
				var tweet = verified_tweets[x];
				slot_count = ascii_to_int(tweet.checksum.substr(3,2));
			}

			for(var x = 0; x < slot_count ; ++x) {
				var $container = $("#cd_" + x);
				if($container.length == 0) {
					$container = $("<span />")
						.attr("id", "cd_" + x)
						.addClass("tweet")
						.addClass("empty")
						.html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ")
						.appendTo(base.$tweets);
				}
				if(x in verified_tweets) {
					var tweet = verified_tweets[x];
					if($container.text != tweet.message)
						$container.text(tweet.message + " ");

					$container.removeClass()
						.addClass(tweet.isVerified?"verified":"unverified");
				}
			}
		}

		// Run initializer
		base.init();
	};

	$.collector.defaultOptions = {
		caching: false
	};

	$.fn.collector = function(identifier, options){
		return this.each(function(){
			(new $.collector(this, identifier, options));
		});
	};
})(jQuery)