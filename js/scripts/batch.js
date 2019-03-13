var batchGenerator = {
	collection: null,

	location: '',
	prop: false,

	removeTrackVideo: false,
	removeTrackAudio: false,
	removeTrackSubtitle: false,

	counterInitialValue: 0,
	counterTen: false,
	counterHundred: false,
	counterThousand: false,

	removeLeadingZeroSeason: false,
	removeLeadingZeroEpisode: false,

	replaceUnderline: '',

	fileTitle: '',


	setLocation: new function() {
		var text = 'set mkv="';
		if (this.prop) {
			text += this.location + 'mkvpropedit.exe';
		}
		else {
			text += this.location + 'mkvmerge.exe';
		}
		text += '"\n';
		return text;
	},
	setfileInformation: new function() {
		var text = '';
		if (this.prop) {
			text += ' --edit info --set "title=' + fileTitle + '"\n';
		}
		else {

		}
		return text;
	},
	setReplaceUnderlines: new function() {
		var text = '';
		if (this.replaceUnderline) {
			text += 'set replacementText=^' + this.replaceUnderline + '\n';
			text += 'call set ep_name=%%ep_name:^_=%replacementText%%%\n';
		}
		return text;
	},
	setRemoveLeadingZeros: new function() {
		var text = '';
		if (this.removeLeadingZeroSeason) {
			text += 'set /a ep_seas = 1%ep_seas%-(11%ep_seas%-1%ep_seas%)/10\n';
		}
		if (this.removeLeadingZeroEpisode) {
			text += 'set /a ep_num = 1%ep_num%-(11%ep_num%-1%ep_num%)/10\n';
		}
		return text;
	},
	setRemoveTracks: new function() {
		var text = '';
		if (this.removeTrackVideo) {
			text += ' --no-video';
		}
		if (this.removeTrackAudio) {
			text += ' --no-audio';
		}
		if (this.removeTrackSubtitle) {
			text += ' --no-subtitle';
		}
		return text;
	},
	setCounter: new function() {
		var text = '';
		if (this.counterThousand) {
			text += 'set /a counter=10000%counter% %% 10000\n';
			text += 'set /a "counter=%counter%+1"\n';

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
			text += 'set /a counter=10000%counter% %% 10000\n'
			text += 'set /a "counter=%counter%+1"\n';

			text += 'if %counter% GTR %ep_hundreds% (\n';
			text += '	set counter=%counter%\n';
			text += ') else if %counter% GTR %ep_tens% (\n';
			text += '	set counter=0%counter%\n';
			text += ') else (\n';
			text += '	set counter=00%counter%\n';
			text += ')\n';
		}
		else if (this.counterTen) {
			text += 'set /a counter=10000%counter% %% 10000\n'
			text += 'set /a "counter=%counter%+1"\n';

			text += 'if %counter% GTR %ep_tens% (\n';
			text += '	set counter=%counter%\n';
			text += ') else (\n';
			text += '	set counter=0%counter%\n';
			text += ')\n';
		}
		return text;
	},
	buildBatch: new function() {

	}
};
