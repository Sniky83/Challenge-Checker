import {sendApi} from './lib/api.js';

let base_url = 'http://localhost:3000/api/get/';

$(document).ready(function() {
	
	let hidden_vuln_type = $("#hidden_vuln_type").val().toUpperCase();
	
	sendApi(base_url+'vuln_type', function(data){
		data.forEach(element => {
			let vuln_type = element.vulnerability_type;
			$("#select_vuln").append(new Option(vuln_type, vuln_type));
			
			if(vuln_type === hidden_vuln_type)
			{
				//$('#select_vuln option[value='+hidden_vuln_type+']').prop('selected', true);
				$("#select_vuln").find('option').get(0).remove();
			}
		});
		
		let hidden_chall_id = $("#hidden_chall_id").val().toUpperCase();
	
		let selectedVuln = $("#select_vuln").val();
		
		if(selectedVuln != "")
		{	
			sendApi(base_url+'challenge_id/'+selectedVuln, function(data){
				data.forEach(element => {
					let challenge_id = element.challenge_id;
					$("#select_chall_id").append(new Option(challenge_id, challenge_id));
					
					if(challenge_id == hidden_chall_id)
					{
						//$('#select_chall_id option[value='+hidden_chall_id+']').prop('selected', true);
						$("#select_chall_id").find('option').get(0).remove();
					}
				});
			});
			
			$("#chall_id").show();
		}
	});
	
	let flag = $("#flag").val();
	if(flag === "1")
	{
		$("#bad-alert").show();
	}
	
	if(flag === "12")
	{
		$("#good-alert").show();
	}
	
	if(hidden_vuln_type == "")
	{
		$('#select_vuln').one("change", function() {
			$("#select_vuln").find('option').get(0).remove();
		});
	}
	
	if(hidden_chall_id == "")
	{
		$('#select_chall_id').one("change", function() {
			$("#select_chall_id").find('option').get(0).remove();
		});
	}
	
	$("#select_vuln").change(function() {
		getNumChall();
	});
});

function getNumChall()
{
	let firstOption = $("#select_chall_id").val();
	
	//A chaque changement de vuln on WIPE le select chall_id
	if(firstOption !== "")
	{
		$("#select_chall_id").children().remove();
	}
	else
	{
		$("#select_chall_id").find('option').not(':first').remove();
	}
	
	let selectedVuln = $("#select_vuln").val();
	
	if(selectedVuln !== "")
	{
		$("#chall_id").show();
	}
	
	sendApi(base_url+'challenge_id/'+selectedVuln, function(data) {
		data.forEach(element => {
			let challenge_id = element.challenge_id;
			$("#select_chall_id").append(new Option(challenge_id, challenge_id));
		});
	});
}