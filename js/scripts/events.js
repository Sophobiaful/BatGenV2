$(document).ready(function() {
	$('#openOptionsButton').click(function() {
		$('#moreOptionsArea').removeClass('closed');
	});
	$('#closeOptionsButton').click(function() {
		$('#moreOptionsArea').addClass('closed');
	});


	$('#addTrackVideo').click(function() {
		updateViewAndInfo(view, collection, new backboneModel_VideoField());
	});
	$('#addTrackAudio').click(function() {
		updateViewAndInfo(view, collection, new backboneModel_AudioField());
	});
	$('#addTrackSubtitle').click(function() {
		updateViewAndInfo(view, collection, new backboneModel_SubtitleField());
	});



	//Hotkeys.
	Mousetrap.bind('alt+1', function() {
		$('#addTrackVideo').click();
	});
	Mousetrap.bind('alt+2', function() {
		$('#addTrackAudio').click();
	});
	Mousetrap.bind('alt+3', function() {
		$('#addTrackSubtitle').click();
	});


	$('#batchFileTitle,#batchMKVLocation,#replaceUnderline').keyup(function() {
		updateBatchText(view['collection']);
	});


	$('#batchCounter').keyup(function() {
		updateBatchText(view['collection']);
	});

	$('#batchCounter10').change(function() {
		updateBatchText(view['collection']);
	});
	$('#batchCounter100').change(function() {
		updateBatchText(view['collection']);
	});
	$('#batchCounter1000').change(function() {
		updateBatchText(view['collection']);
	});

	$('#batchRemoveVideo,#batchRemoveAudio,#batchRemoveSubtitle,#forceMkvMerge').change(function() {
		updatePropFlag(view['collection']);
	});

	$('#buttonDownload').click(function() {
		var blob = new Blob([$('#downloadText').val()], {type: "text/plain;charset=utf-8"});
		saveAs(blob, "batgen.bat");
	});
	$('#buttonCopy').click(function() {
		$('#downloadText').prop('disabled', false);
		$('#downloadText').select();
		document.execCommand('copy');
		$('#downloadText').prop('disabled', true);
	});

	new Tooltip($('#infoRemoveTracks'), {
		placement: 'top',
		title: 'Removing all tracks causes an error. Make sure there will be at least one track left in the file once remuxing is complete.'
	});
});
