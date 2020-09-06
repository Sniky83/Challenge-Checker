export function sendApi(url, callback)
{
	$.ajax(url, {
		type: 'GET',
		dataType: 'json',
		success: function (data, status, xhr) {
			callback(data);
		}
	});
}