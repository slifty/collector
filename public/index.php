<html>
	<head>
		<title>The Collector</title>
		<link rel="stylesheet" href="css/main.css"></style>
		<script src="js/lib/jquery-1.9.0.min.js"></script>
		<script src="js/collector.js"></script>
		<script>
			$(function() {
				$("#results").collector("test");
			});
		</script>
	</head>

	<body>
		<div id="content">
			<h1>The Collector</h1>
			<p>This service will aggregate a series of tweets within a hash tag to genearte a single document made up of those tweets.  Results may vary depending on the hash tag.  If you would like to orchestrate the generation of a specific collective document check out The Replicator.</p>
			<form>
				<ul>
					<li>
						<label for="tagText">#</label>
						<input id="tagText" type="text" />
					</li>
					<li>
						<input id="collectButton" type="button" value="Collect" />
					</li>
				</ul>
			</form>
			<div id="results"></div>
		</div>
	</body>
</html>