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
