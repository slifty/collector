<?php
	set_include_path('../');
	include_once('models/TwitterSearch.php');

	$tag = $_GET['t']?$_GET['t']:'';
	$results = array();

	if($tag != '') {
		$search = new TwitterSearch($tag);
		$results = $search->results();
	}
?>

<html>
	<head>
		<title>The Collector</title>
		<link rel="stylesheet" href="css/main.css"></style>
	</head>

	<body>
		<div id="content">
			<?php foreach($results as $tweet) { ?>
				<div class="segment" id="t-<?=$tweet->id?>"><?=$tweet->text?></div>
			<?php } ?>
		</div>
	</body>
</html>