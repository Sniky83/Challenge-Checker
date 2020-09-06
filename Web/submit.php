<?php	
	if(
		isset($_POST['username']) && !empty($_POST['username']) &&
		isset($_POST['data']) && !empty($_POST['data']) &&
		isset($_POST['challenge_id']) && !empty($_POST['challenge_id']) &&
		isset($_POST['vulnerability_type']) && !empty($_POST['vulnerability_type'])
	)
	{
		$url = 'http://localhost:3000/api/new/ticket';

		$ch = curl_init($url);

		$data = array(
			'username' => $_POST['username'],
			'data' => $_POST['data'],
			'challenge_id' => intval($_POST['challenge_id']),
			'vulnerability_type' => $_POST['vulnerability_type']
		);
		$payload = json_encode($data);

		curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);

		curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));

		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

		$result = curl_exec($ch);

		curl_close($ch);
		
		$result = json_decode($result, true);
		
		$result = $result['message'];
		
		if($result === 'Informations correctement envoyées !')
		{
			$result_ok = 1;
		}
	}
	else if(isset($_POST['btn']))
	{
		$result = 'Veuillez remplir tous les champs !';
	}
?>

<!doctype html>
<html lang="fr">
<head>
	<meta charset="utf-8">

	<title>Envoyer un Ticket</title>
	<meta name="description" content="Envoyer un ticket sur l'API pour faire valider votre challenge.">
	<meta name="author" content="Sniky">
	<script src="./js/lib/jquery.min.js"></script>
	<link rel="stylesheet" href="./css/lib/bootstrap.min.css">
	<script type="module" src="./js/submit.js"></script>
	<link rel="stylesheet" href="./css/styles.css">
</head>

<body>
	<input type="hidden" id="hidden_vuln_type" value="<?php if(isset($_GET['vuln_type'])) echo htmlspecialchars($_GET['vuln_type'], ENT_QUOTES); if(isset($_POST['vulnerability_type'])) echo htmlspecialchars($_POST['vulnerability_type'], ENT_QUOTES); ?>">
	<input type="hidden" id="hidden_chall_id" value="<?php if(isset($_GET['chall_id'])) echo intval($_GET['chall_id']); if(isset($_POST['challenge_id'])) echo intval($_POST['challenge_id']); ?>">
	<input type="hidden" id="flag" value="<?php if(isset($result))echo '1';if(isset($result_ok))echo '2';?>">
	<div class="alert alert-success text-center hide" role="alert" id="good-alert">
		<?php if(isset($result_ok)) echo $result; ?>
	</div>
	<div class="alert alert-danger text-center hide" role="alert" id="bad-alert">
		<?php if(isset($result)) echo $result; ?>
	</div>
	<h1 class="text-center">Envoyer un Ticket</h1>
	<div class="d-flex justify-content-sm-center">
	<div class="col-md-6">
		<form method="post">
			<div class="form-group">
				<label for="vulnerability_type">Type de vulnérabilité :</label>
				<select name="vulnerability_type" id="select_vuln" class="browser-default custom-select" required>
					<option value="">--Veuillez choisir une option--</option>
				</select>
			</div>
			<div class="form-group">
				<div id="chall_id" class="hide">
					<label for="challenge_id">Numéro du challenge :</label>
					<select name="challenge_id" id="select_chall_id" class="browser-default custom-select" required>
						<option value="">--Veuillez choisir une option--</option>
					</select>
				</div>
			</div>
			<div class="form-group">
				<label for="username">Nom d'utilisateur :</label>
				<input type="text" name="username" value="<?php if(isset($_POST['username']))echo htmlspecialchars($_POST['username'], ENT_QUOTES); ?>" placeholder="ex: Sniky" minlength="3" maxlength="26" class="form-control" required>
			</div>
			<div class="form-group">
				<label for="data">Votre payload :</label>
				<textarea class="form-control" name="data" placeholder="ex: '><script>alert();</script>" minlength="11" maxlength="255" rows="5" required><?php if(isset($_POST['data']))echo htmlspecialchars($_POST['data'], ENT_QUOTES); ?></textarea>
			</div>
			<input type="submit" value="Envoyer" name="btn" class="btn btn-secondary col-12">
		</form>
	</div>
	</div>
</body>
</html>