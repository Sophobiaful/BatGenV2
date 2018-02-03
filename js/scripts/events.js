$(document).ready(function() {
	$('#addTrackVideo').click(function() { updateViewAndInfo(view, collection, new backboneModel_VideoField()); });
	$('#addTrackAudio').click(function() {	updateViewAndInfo(view, collection, new backboneModel_AudioField()); });
	$('#addTrackSubtitle').click(function() {	updateViewAndInfo(view, collection, new backboneModel_SubtitleField()); });


	$('#batchFileTitle').keyup(function() {
		updateBatchText(view['collection']);
	});
	$('#batchMKVLocation').keyup(function() {
		updateBatchText(view['collection']);
	});


	$('#batchCounter').change(function() {
		updateBatchText(view['collection']);
	});

	$('#batchCounter10').change(function() {
		updateBatchText(view['collection']);
	});
	$('#batchCounter100').change(function() {
		if ($('#batchCounter100').is(':checked')) {
			$('#batchCounter10').prop('checked',true);
		}
		updateBatchText(view['collection']);
	});
	$('#batchCounter1000').change(function() {
		if ($('#batchCounter1000').is(':checked')) {
			$('#batchCounter10').prop('checked',true);
			$('#batchCounter100').prop('checked',true);
		}
		updateBatchText(view['collection']);
	});


	$('#batchRemoveVideo').change(function() {
		updateBatchText(view['collection']);
	});
	$('#batchRemoveAudio').change(function() {
		updateBatchText(view['collection']);
	});
	$('#batchRemoveSubtitle').change(function() {
		updateBatchText(view['collection']);
	});

});
