function BatchGenerator(collection, location, prop, fileType, fileTitle, replaceUnderline, removeTrackVideo, removeTrackAudio, removeTrackSubtitle, counterInitialValue, counterTen, counterHundred, counterThousand, removeLeadingZeroSeason, removeLeadingZeroEpisode) {
	this.collection = collection;
	this.batchText = '';

	this.location = location;
	this.prop = prop;
	this.fileType = fileType;
	this.fileTitle = fileTitle;
	this.replaceUnderline = replaceUnderline;

	this.removeTrackVideo = removeTrackVideo;
	this.removeTrackAudio = removeTrackAudio;
	this.removeTrackSubtitle = removeTrackSubtitle;

	this.counterInitialValue = counterInitialValue;
	this.counterTen = counterTen;
	this.counterHundred = counterHundred;
	this.counterThousand = counterThousand;

	this.removeLeadingZeroSeason = removeLeadingZeroSeason;
	this.removeLeadingZeroEpisode = removeLeadingZeroEpisode;

	this.decideLocation = function() {
		var text = 'set mkvexe="';
		if (this.prop) {
			text += this.location + 'mkvpropedit.exe';
		}
		else {
			text += this.location + 'mkvmerge.exe';
		}
		text += '"\n';
		this.batchText += text;
	};
	this.decideCallFunction = function() {
		var text = '';
		if (this.prop) {
			text += 'call %mkvexe% "%fi%"';
		}
		else {
			text += 'call %mkvexe% -o "%output_folder%\\%ep%.mkv"';
		}
		batchText += text;
	};
	this.decideUnderlines = function() {
		var text = '';
		if (this.replaceUnderline) {
			text += 'set replacementText=^' + this.replaceUnderline + '\n';
			text += 'call set ep_name=%%ep_name:^_=%replacementText%%%\n';
		}
		this.batchText += text;
	};
	this.decideLeadingZeroes = function() {
		var text = '';
		if (this.removeLeadingZeroSeason) {
			text += 'set /a ep_seas = 1%ep_seas%-(11%ep_seas%-1%ep_seas%)/10\n';
		}
		if (this.removeLeadingZeroEpisode) {
			text += 'set /a ep_num = 1%ep_num%-(11%ep_num%-1%ep_num%)/10\n';
		}
		this.batchText += text;
	};
	this.decideRemoveTracks = function() {
		var text = '';
		if (this.removeTrackVideo) {
			text += ' --no-video';
		}
		if (this.removeTrackAudio) {
			text += ' --no-audio';
		}
		if (this.removeTrackSubtitle) {
			text += ' --no-subtitles';
		}
		this.batchText += text;
	};
	this.decideCounter = function() {
		var text = '';
		if (this.counterThousand) {
			text += 'if %counter% GTR %ep_thousands% (\n';
			text += '	set counter=%counter%\n';
			text += ') else if %counter% GTR %ep_hundreds% (\n';
			text += '	set counter=0%counter%\n';
			text += ') else if %counter% GTR %ep_tens% (\n';
			text += '	set counter=00%counter%\n';
			text += ') else (\n';
			text += '	set counter=000%counter%\n';
			text += ')\n';
		}
		else if (this.counterHundred) {
			text += 'if %counter% GTR %ep_hundreds% (\n';
			text += '	set counter=%counter%\n';
			text += ') else if %counter% GTR %ep_tens% (\n';
			text += '	set counter=0%counter%\n';
			text += ') else (\n';
			text += '	set counter=00%counter%\n';
			text += ')\n';
		}
		else if (this.counterTen) {
			text += 'if %counter% GTR %ep_tens% (\n';
			text += '	set counter=%counter%\n';
			text += ') else (\n';
			text += '	set counter=0%counter%\n';
			text += ')\n';
		}
		this.batchText += text;
	};
	this.decideMkvVariables = function() {
		var text = '';
		text += 'call %mkvexe% '
		if (this.prop) {
			text += '"%fi%"';
		}
		else {
			text += '-o "%output_folder%\\%ep%.mkv"';
		}
		this.batchText += text;
	};
	this.decideFileInformation = function() {
		var text = '';
		if (this.prop) {
			text += ' --edit info --set "title=' + this.fileTitle + '"\n';
		}
		else {
			text += ' "%fi%" ';
			if (this.collection.length > 0) {
				text += '--track-order ' + this.collection.printTrackOrder() + ' ';
			}
			text += '--title "' + this.fileTitle + '"\n';
		}
		this.batchText += text;
	};

	this.buildVariables = function() {
		this.batchText += 'setlocal DisableDelayedExpansion\n';
		this.decideLocation();
		this.batchText += 'set "output_folder=%cd%\\Muxing"\n';
		this.batchText += 'set counter=' + this.counterInitialValue + '\n';
		this.batchText += 'set ep_thousands=999\n';
		this.batchText += 'set ep_hundreds=99\n';
		this.batchText += 'set ep_tens=9\n';
	};
	this.buildCallLoop = function() {
		this.batchText += 'for /r %%a in (*.' + this.fileType + ') do (\n';
		this.batchText += '	set fi=%%a\n';
		this.batchText += '	set ep=%%~na\n';
		this.batchText += '	call :merge\n';
		this.batchText += ')\n';
		this.batchText += 'goto :eof;\n\n';
	};
	this.buildMkvLoop = function() {
		this.batchText += ':merge\n';
		this.batchText += 'for /F "tokens=1* delims=- " %%A in ("%ep%") do (\n';
		this.batchText += '	set "ep_name=%%B"\n';
		this.batchText += '	for /F "tokens=1,2 delims=ES" %%C in ("%%A") do (\n';
		this.batchText += '		set "ep_seas=%%C"\n';
		this.batchText += '		set "ep_num=%%D"\n';
		this.batchText += '	)\n';
		this.batchText += ')\n';
	};
	this.buildMetadata = function() {
		this.decideMkvVariables();
		this.batchText += this.collection.printBatch(this.prop, [removeTrackVideo, removeTrackAudio, removeTrackSubtitle]);
	};
	this.buildCounterIncrement = function() {
		this.batchText += 'set /a counter=10000%counter% %% 10000\n';
		this.batchText += 'set /a "counter=%counter%+1"\n';
	};
	this.buildEnding = function() {
		this.batchText += 'goto :eof';
	};

	this.buildBatch = function() {
		this.batchText = '';
		this.buildVariables();
		this.buildCallLoop();
		this.buildMkvLoop();
		this.decideUnderlines();
		this.decideLeadingZeroes();
		this.buildMetadata();
		this.decideRemoveTracks();
		this.decideFileInformation();
		this.buildCounterIncrement();
		this.decideCounter();
		this.buildEnding();
		return this.batchText;
	};
}
