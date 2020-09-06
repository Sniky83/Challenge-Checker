<!DOCTYPE html>
<html>
<head>
	<title>XSS</title>
	<meta charset="utf-8">
</head>
<body>
	<h1>Challenge XSS n°1</h1>
	<form method="GET">
		<input type="text" id="search" name="username" value="<?php if(isset($_GET['username']) && !empty($_GET['username'])) echo htmlspecialchars($_GET['username'], ENT_QUOTES); ?>">
		<input type="submit" value="Rechercher" onclick="search()">
	</form>
</body>
</html>

<script>
	function search()
	{	
		let username = "<?= $_GET['username']; ?>";
		console.log(username);
	}
</script>