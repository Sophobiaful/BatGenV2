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

//Creates the complete batch text.
function updateBatchText(sentCollection) {
	var mkvLocation = $('#batchMKVLocation').val();
	var fileTitle = $('#batchFileTitle').val();

	var counter = $('#batchCounter').val();
	var counter10 = $('#batchCounter10').is(':checked');
	var counter100 = $('#batchCounter100').is(':checked');
	var counter1000 = $('#batchCounter1000').is(':checked');

	var removeVideo = $('#batchRemoveVideo').is(':checked');
	var removeAudio = $('#batchRemoveAudio').is(':checked');
	var removeSubtitle = $('#batchRemoveSubtitle').is(':checked');


	var batchScript = '';

	batchScript += 'setlocal DisableDelayedExpansion\n\
set mkvmerge="' + mkvLocation + '"\n\
set "output_folder=%cd%\\Muxing"\n\
set counter=' + counter + '\n\
set ep_thousands=999\n\
set ep_hundreds=99\n\
set ep_tens=9\n\
for /r %%a in (*.mkv) do (\n\
	set fi=%%a\n\
	set ep=%%~na\n\
	call :merge\n\
)\n\
goto :eof;\n\n\
:merge\n\
for /F "tokens=1* delims=- " %%A in ("%ep%") do (\n\
	set "ep_name=%%B"\n\
	for /F "tokens=1,2 delims=ES" %%C in ("%%A") do (\n\
		set "ep_seas=%%C"\n\
		set "ep_num=%%D"\n\
	)\n\
)\n\
call %mkvmerge% -o "%output_folder%\\%ep%.mkv"';

	batchScript += sentCollection.printBatch(removeVideo, removeAudio, removeSubtitle);

	if (removeVideo) {
		batchScript += ' --no-video';
	}
	if (removeAudio) {
		batchScript += ' --no-audio';
	}
	if (removeSubtitle) {
		batchScript += ' --no-subtitle';
	}

	batchScript += ' "%fi%" ';
	if (sentCollection.length > 0) {
		batchScript += '--track-order ' + sentCollection.printTrackOrder() + ' ';
	}
	batchScript += '--title "' + fileTitle + '"\n\
set /a counter=10000%counter% %% 10000\n\
set /a "counter=%counter%+1"\n';

	if (counter1000) {
		batchScript += 'if %counter% GTR %ep_thousands% (\n\
	set counter=%counter%\n\
) else if %counter% GTR %ep_hundreds% (\n\
	set counter=0%counter%\n\
) else if %counter% GTR %ep_tens% (\n\
	set counter=00%counter%\n\
) else (\n\
	set counter=000%counter%\n\
)\n';
	} else if (counter100) {
		batchScript += 'if %counter% GTR %ep_hundreds% (\n\
	set counter=%counter%\n\
) else if %counter% GTR %ep_tens% (\n\
	set counter=0%counter%\n\
) else (\n\
	set counter=00%counter%\n\
)\n';
	} else if (counter10) {
		batchScript += 'if %counter% GTR %ep_tens% (\n\
	set counter=%counter%\n\
) else (\n\
	set counter=0%counter%\n\
)\n';
	}

	batchScript += 'goto :eof';

	$('#downloadText').text(batchScript);
}
