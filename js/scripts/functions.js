function __replace(original, to_replace, with_replace) {
	var word = original.replace(new RegExp(to_replace,'g'), with_replace);
	return word;
}

function guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}
	return s4() + s4();
}

function createDropdownOptions(array, currentlySelected) {
	var html = '';
	for (var i = 0; i < array.length; i++) {
		if (array[i][0] === currentlySelected) {
			html += '<option value=' + array[i][0] + ' selected>' + array[i][1] + '</option>';
		}
		else {
			html += '<option value=' + array[i][0] + '>' + array[i][1] + '</option>';
		}
	}
	return html;
}

function updateViewAndInfo(sentView, sentCollection, trackToAdd) {
	sentCollection.add(trackToAdd);
	sentCollection.reOrderTrackNumbers();
	sentView.render();
}

function updateBatchText(sentCollection) {
	var fileTitle = $('#batchFileTitle').val();

	var batchScript = '';
	for (var i = 0; i < sentCollection.length; i++) {
		var curModel = sentCollection.models[i];
		batchScript += curModel.get('batch');
	}
	$('#downloadText').text(batchScript);
}
