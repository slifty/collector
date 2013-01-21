<html>
	<head>
		<title>The Collector</title>
		<link rel="stylesheet" href="css/main.css"></style>
		<script src="js/lib/jquery-1.9.0.min.js"></script>
		<script src="js/collector.js"></script>
		<script>
			function getParameterByName(name) {
				name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
				var regexS = "[\\?&]" + name + "=([^&#]*)";
				var regex = new RegExp(regexS);
				var results = regex.exec(window.location.search);
				if(results == null)
					return "";
				else
					return decodeURIComponent(results[1].replace(/\+/g, " "));
			}
			$(function() {
				$("#collectButton").click(function() {
					$("#results").collector($("#tagText").val());
					$("#questions").hide();
				});

				if(getParameterByName("cd")) {
					$("#results").collector(getParameterByName("cd"));
					$("#questions").hide();
				}
			});
		</script>
	</head>

	<body>
		<div id="content">
			<h1>The Collector</h1>
			<p>When you think of a document you probably think of a book, a file, or a page that you could print out.  It stands alone, it is licensed as a unit, and it is easy to take down, censor, or destroy.  This makes a document pretty weak.</p>
			<p>What if the document wasn't defined by one person, one file, or one website?  What if it was defined by a group of people spread across the world, controlled by a collective?</p>
			<p>This page will generate a collective document before your eyes.  More specifically, your browser is scanning Twitter for specially crafted tweets.  The tweets contain instructions for the creation of the new collective document.</p>
			<p>You can render collective documents anywhere on the open web using <a href="https://github.com/slifty/collector/blob/master/public/js/collector.js">this code</a>.  You can create a collective document of your own using <a href="https://github.com/slifty/replicator/blob/master/public/js/replicator.js">this code</a>.  If you don't feel like setting it up yourself you can just visit <a href="http://replicator.istheinternetabigtruck.com">The Replicator</a>.</p>
			<hr />
			<form>
				<ul id="questions">
					<li>
						<label for="tagText">Collective Document ID</label>
						<input id="tagText" type="text" /> (begins with "CD_")
					</li>
				</ul>
				<div id="results">
					<div id="collectButton">Render Collective Document</div>
				</div>
			</form>
		</div>
		<div id="attribution">This was built by <a href="http://slifty.com">Dan Schultz</a> (<a href="http://www.twitter.com/slifty">@slifty</a>) and Paul Schultz (<a href="https://twitter.com/paulwschultz">@paulwschultz</a>).  The code is <a href="https://github.com/slifty/collector">on Github.</a></div>
	</body>
</html>