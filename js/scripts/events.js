$(document).ready(function() {
	$('#addTrackVideo').click(function() { updateViewAndInfo(view, collection, new backboneModel_VideoField()); });
	$('#addTrackAudio').click(function() {	updateViewAndInfo(view, collection, new backboneModel_AudioField()); });
	$('#addTrackSubtitle').click(function() {	updateViewAndInfo(view, collection, new backboneModel_SubtitleField()); });

	$('#batchFileTitle').keyup(function() {
		updateBatchText(view['collection']);
	});

});
