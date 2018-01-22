$(document).ready(function() {
	//HTML that displays if the user does not have javascript enabled.
	$('#noJavascript').load('templates/misc/no_js_owl.html');
	//Home page. Will include more pages if needed later.
	$('#content').load('templates/pages/batch_generator.html');
});
