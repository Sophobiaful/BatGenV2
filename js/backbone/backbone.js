/*
	Template Variables
*/
var temp_Textbox = _.template($('#Textbox-template').html());
var temp_DDLanguage = _.template($('#DropdownLanguage-template').html());
var temp_DDDefault = _.template($('#DropdownDefault-template').html());
var temp_DDForced = _.template($('#DropdownForced-template').html());
var temp_Buttons = _.template($('#Buttons-template').html());

var temp_Video = _.template($('#VideoField-template').html());
var temp_Audio = _.template($('#AudioField-template').html());
var temp_Subtitle = _.template($('#SubtitleField-template').html());


/*
	Variables For Data Entry Forms
*/
var ddLanguageContents = [['und','Undefined'], ['eng','English'], ['jpn','Japanese'], ['chi', 'Chinese'], ['cze', 'Czech'], ['dan', 'Danish'], ['dut', 'Dutch'], ['fin', 'Finnish'], ['fre','French'], ['ger','German'], ['gre', 'Greek: Modern'], ['ita', 'Italian'], ['kor', 'Korean'], ['nob', 'Norwegian'], ['pol', 'Polish'], ['por','Portuguese'], ['spa','Spanish'], ['swe', 'Swedish'], ['tha', 'Thai']];
var ddDefaultContents = [['yes','Yes'], ['no','No']];
var ddForcedContents = [['yes','Yes'], ['no','No']];

/*
	Variables For Checks
*/
var propFlag = true;


/*
	Models
*/
//Base model. Used for the collection.
var backboneModel_Field = Backbone.Model.extend({
	initialize: function() { },
	defaults: {
		batch: 'error:001-basemodel-default',
		propBatch: 'error:002-basemodel-default',
		enabled: true
	},
	constructBatch: function() { },
	constructPropBatch: function() { },
	switchEnabled: function() {
		if (this.get('enabled')) {
			this.set({enabled:false});
		}
		else {
			this.set({enabled:true});
		}
	},
	outputEnabled: function() {
		if (this.get('enabled')) {
			return '';
		}
		else {
			return 'disabled';
		}
	}
});

//A model used for each 'video' type track/field.
var backboneModel_VideoField = backboneModel_Field.extend({
	initialize: function() {
		this.set({uid: guid()});
		this.constructBatch();
		this.constructPropBatch();
	},
	defaults: {
		uid: 0,
		type: 'video',
		trackNumber: 0,
		sortedTrackNumber: 0,
		title: '',
		language: 'und',
		default: 'yes',
		forced: 'yes',
		enabled: true,
		batch: 'error:003-video-default',
		propBatch: 'error:004-video-default'
	},
	constructBatch: function() {
		var bat = '--track-name "abTRACKba:abTITLEba" --language abTRACKba:abLANGUAGEba --default-track abTRACKba:abDEFAULTba --forced-track abTRACKba:abFORCEDba';
		bat = __replace(bat, 'abTRACKba',this.get('trackNumber'));
		bat = __replace(bat, 'abTITLEba',this.get('title'));
		bat = __replace(bat, 'abLANGUAGEba',this.get('language'));
		bat = __replace(bat, 'abDEFAULTba',this.get('default'));
		bat = __replace(bat, 'abFORCEDba',this.get('forced'));

		this.set({batch:bat});
	},
	constructPropBatch: function() {
		var bat = '--edit track:abTRACKba --set "name=abTITLEba" --set language=abLANGUAGEba --set flag-default=abDEFAULTba --set flag-forced=abFORCEDba';
		bat = __replace(bat, 'abTRACKba',this.get('trackNumber')+1);
		bat = __replace(bat, 'abTITLEba',this.get('title'));
		bat = __replace(bat, 'abLANGUAGEba',this.get('language'));
		bat = __replace(bat, 'abDEFAULTba',__changeYesNo(this.get('default')));
		bat = __replace(bat, 'abFORCEDba',__changeYesNo(this.get('forced')));

		this.set({propBatch:bat});
	}
});

//A model used for each 'audio' type track/field.
var backboneModel_AudioField = backboneModel_Field.extend({
	initialize: function() {
		this.set({uid: guid()});
		this.constructBatch();
		this.constructPropBatch();
	},
	defaults: {
		uid: 0,
		type: 'audio',
		trackNumber: 0,
		sortedTrackNumber: 0,
		title: '',
		language: 'und',
		default: 'yes',
		forced: 'yes',
		enabled: true,
		batch: 'error:003-audio-default',
		propBatch: 'error:004-audio-default'
	},
	constructBatch: function() {
		var bat = '--track-name "abTRACKba:abTITLEba" --language abTRACKba:abLANGUAGEba --default-track abTRACKba:abDEFAULTba --forced-track abTRACKba:abFORCEDba';
		bat = __replace(bat, 'abTRACKba',this.get('trackNumber'));
		bat = __replace(bat, 'abTITLEba',this.get('title'));
		bat = __replace(bat, 'abLANGUAGEba',this.get('language'));
		bat = __replace(bat, 'abDEFAULTba',this.get('default'));
		bat = __replace(bat, 'abFORCEDba',this.get('forced'));

		this.set({batch:bat});
	},
	constructPropBatch: function() {
		var bat = '--edit track:abTRACKba --set "name=abTITLEba" --set language=abLANGUAGEba --set flag-default=abDEFAULTba --set flag-forced=abFORCEDba';
		bat = __replace(bat, 'abTRACKba',this.get('trackNumber')+1);
		bat = __replace(bat, 'abTITLEba',this.get('title'));
		bat = __replace(bat, 'abLANGUAGEba',this.get('language'));
		bat = __replace(bat, 'abDEFAULTba',__changeYesNo(this.get('default')));
		bat = __replace(bat, 'abFORCEDba',__changeYesNo(this.get('forced')));

		this.set({propBatch:bat});
	}
});

//A model used for each 'subtitle' type track/field. Contains the difference of having a forced track field.
var backboneModel_SubtitleField = backboneModel_Field.extend({
	initialize: function() {
		this.set({uid: guid()});
		this.constructBatch();
		this.constructPropBatch();
	},
	defaults: {
		uid: 0,
		type: 'subtitle',
		trackNumber: 0,
		sortedTrackNumber: 0,
		title: '',
		language: 'und',
		default: 'yes',
		forced: 'yes',
		enabled: true,
		batch: 'error:003-subtitle-default',
		propBatch: 'error:004-subtitle-default'

	},
	constructBatch: function() {
		var bat = '--track-name "abTRACKba:abTITLEba" --language abTRACKba:abLANGUAGEba --default-track abTRACKba:abDEFAULTba --forced-track abTRACKba:abFORCEDba';
		bat = __replace(bat, 'abTRACKba',this.get('trackNumber'));
		bat = __replace(bat, 'abTITLEba',this.get('title'));
		bat = __replace(bat, 'abLANGUAGEba',this.get('language'));
		bat = __replace(bat, 'abDEFAULTba',this.get('default'));
		bat = __replace(bat, 'abFORCEDba',this.get('forced'));

		this.set({batch:bat});
	},
	constructPropBatch: function() {
		var bat = '--edit track:abTRACKba --set "name=abTITLEba" --set language=abLANGUAGEba --set flag-default=abDEFAULTba --set flag-forced=abFORCEDba';
		bat = __replace(bat, 'abTRACKba',this.get('trackNumber')+1);
		bat = __replace(bat, 'abTITLEba',this.get('title'));
		bat = __replace(bat, 'abLANGUAGEba',this.get('language'));
		bat = __replace(bat, 'abDEFAULTba',__changeYesNo(this.get('default')));
		bat = __replace(bat, 'abFORCEDba',__changeYesNo(this.get('forced')));

		this.set({propBatch:bat});
	}
});



/*
	COLLECTIONS
*/
//Holds all the information for all the user's fields.
var backboneCollection_Fields = Backbone.Collection.extend({
	model: backboneModel_Field,
	initialize: function() {
		this.on('remove', function(model) {
			this.reOrderTrackNumbers();
		});
		this.on('change', function(model) {
			model.constructBatch();
			model.constructPropBatch();
		});
	},
	reOrderSortedTrackOrder: function(order) {
		for (var i = 0; i < this.length; i++) {
			var curModel = this.models[i];
			if (curModel.get('enabled')) {
				curModel.set('sortedTrackNumber', order[i]);
				curModel.constructBatch();
				curModel.constructPropBatch();
			}
		}
	},
	checkIfDisabled: function() {
		for (var i = 0; i < this.length; i++) {
			var curModel = this.models[i];
			if (!curModel.get('enabled')) {
				return true;
			}
		}
		return false;
	},
	checkIfOutOfORder: function() {
		for (var i = 0; i < this.length; i++) {
			var curModel = this.models[i];
			if (curModel.get('trackNumber') != curModel.get('sortedTrackNumber')) {
				return true;
			}
		}
		return false;
	},
	printBatch: function(prop, removeFlags) {
		var text = '';
		if (prop) {
			text = this.printMkvProp();
		}
		else {
			text = this.printMkvMerge(removeFlags[0], removeFlags[1], removeFlags[2]);
		}
		return text;
	},
	printMkvMerge: function(deleteAllVideo, deleteAllAudio, deleteAllSubtitle) {
		var removeVideo = false;
		var removeAudio = false;
		var removeSubtitle = false;
		var batchScript = '';

		for (var i = 0; i < this.length; i++) {
			var curModel = this.models[i];
			if (curModel.get('enabled')) {
				batchScript += ' ' + curModel.get('batch');
			}
			else {
				if (curModel.get('type') === 'video') { removeVideo = true; }
				if (curModel.get('type') === 'audio') { removeAudio = true; }
				if (curModel.get('type') === 'subtitle') { removeSubtitle = true; }
			}
		}

		if (removeVideo && !deleteAllVideo) {
			batchScript += ' -d !';
			for (var i = 0; i < this.length; i++) {
				var curModel = this.models[i];
				if (curModel.get('type') === 'video' && curModel.get('enabled') === false) {
					batchScript += curModel.get('trackNumber') + ',';
				}
			}
			batchScript = batchScript.slice(0,-1);
		}
		if (removeAudio && !deleteAllAudio) {
			batchScript += ' -a !';
			for (var i = 0; i < this.length; i++) {
				var curModel = this.models[i];
				if (curModel.get('type') === 'audio' && curModel.get('enabled') === false) {
					batchScript += curModel.get('trackNumber') + ',';
				}
			}
			batchScript = batchScript.slice(0,-1);
		}
		if (removeSubtitle && !deleteAllSubtitle) {
			batchScript += ' -s !';
			for (var i = 0; i < this.length; i++) {
				var curModel = this.models[i];
				if (curModel.get('type') === 'subtitle' && curModel.get('enabled') === false) {
					batchScript += curModel.get('trackNumber') + ',';
				}
			}
			batchScript = batchScript.slice(0,-1);
		}
		return batchScript;
	},
	printMkvProp: function() {
		var batchScript = '';
		for (var i = 0; i < this.length; i++) {
			var curModel = this.models[i];
			if (curModel.get('enabled')) {
				batchScript += ' ' + curModel.get('propBatch');
			}
			else {}
		}
		return batchScript;
	},
	printTrackOrder: function() {
		var order = '';
		for (var i = 0; i < this.length; i++) {
			if (this.models[i].get('enabled')) {
				order += '0:' + this.models[i].get('sortedTrackNumber') + ',';
			}
		}
		order = order.slice(0,-1);
		return order;
	},
	reOrderTrackNumbers: function() {
		for (var i = 0; i < this.length; i++) {
			var currentModel = this.models[i];

			currentModel.set('trackNumber', i);
			currentModel.set('sortedTrackNumber', i);
			currentModel.constructBatch();
			currentModel.constructPropBatch();
		}
	}
});

//Creates out collection of fields.
var collection = new backboneCollection_Fields();

/*
	VIEWS
*/
var backboneView_Fields = Backbone.View.extend({
	el: $('#userEntryFields'),
	initialize: function() {
		this.listenTo(this.collection, 'change', this.render());
		this.render();
	},
	focusModel: {},
	events: {
		'keyup .listener-textbox':'titleChanged',
		'change .listener-ddLanguage':'languageChanged',
		'change .listener-ddDefault':'defaultChanged',
		'change .listener-ddForced':'forcedChanged',
		'focus .listener-textbox,.listener-ddLanguage,.listener-ddDefault,.listener-ddForced':'gainedFocus',
		'click .listener-deleteTrack':'enableDeleteTrack',
		'click .listener-removeTrack':'removeTrack'
	},
	render: function() {
		var html = '';
		var numbers = '';
		for (var i = 0; i < this.collection.length; i++) {
			var curModel = this.collection.models[i];
			if (curModel.get('enabled')) {
				numbers += '<div class="hover-cursor no-select" data-track="' + curModel.get('trackNumber') + '">' + (curModel.get('trackNumber') + 1) + '</div> ';
			}
			else {
				numbers += '<div class="hidden" data-track="' + curModel.get('trackNumber') + '">' + (curModel.get('trackNumber') + 1) + '</div> ';
			}
			html += "<div>" + (i+1) + "</div>";
			if (curModel.get('type') === 'video') {
				html += temp_Video({
					uid: curModel.get('uid'),
					textbox: {
						item:temp_Textbox,
						variables:{
							label:'VIDEO',
							className:'video',
							modelTitle:curModel.get('title'),
							disabled:curModel.outputEnabled()
						 }
					 },
					ddDefault: {
						item:temp_DDDefault,
						variables:{
							options: createDropdownOptions(ddDefaultContents, curModel.get('default')),
							disabled:curModel.outputEnabled()
						}
					},
					ddLanguage: {
						item:temp_DDLanguage,
						variables:{
							options:createDropdownOptions(ddLanguageContents, curModel.get('language')),
							disabled:curModel.outputEnabled()
						}
					},
					ddForced: {
						item:temp_DDForced,
						variables:{
							options:createDropdownOptions(ddForcedContents, curModel.get('forced')), disabled:curModel.outputEnabled() }},
					buttons: {
						item:temp_Buttons
					}
				});
			}
			else if (curModel.get('type') === 'audio') {
				html += temp_Audio({
					uid: curModel.get('uid'),
					textbox: {
						item:temp_Textbox,
						variables:{
							label:'AUDIO',
							className:'audio',
							modelTitle:curModel.get('title'),
							disabled:curModel.outputEnabled()
						}
					},
					ddDefault: {
						item:temp_DDDefault,
						variables:{
							options: createDropdownOptions(ddDefaultContents, curModel.get('default')),
							disabled:curModel.outputEnabled()
						}
					},
					ddLanguage: {
						item:temp_DDLanguage,
						variables:{
							options:createDropdownOptions(ddLanguageContents, curModel.get('language')),
							disabled:curModel.outputEnabled()
						}
					},
					ddForced: {
						item:temp_DDForced,
						variables:{
							options:createDropdownOptions(ddForcedContents, curModel.get('forced')), disabled:curModel.outputEnabled() }},
					buttons: {
						item:temp_Buttons
					}
				});
			}
			else if (curModel.get('type') === 'subtitle') {
				html += temp_Subtitle({
					uid: curModel.get('uid'),
					textbox: {
						item:temp_Textbox,
						variables:{
							label:'SUBTITLE',
							className:'subtitle',
							modelTitle:curModel.get('title'),
							disabled:curModel.outputEnabled()
						}
					},
					ddDefault: {
						item:temp_DDDefault,
						variables:{
							options: createDropdownOptions(ddDefaultContents, curModel.get('default')),
							disabled:curModel.outputEnabled()
						}
					},
					ddLanguage: {
						item:temp_DDLanguage,
						variables:{
							options:createDropdownOptions(ddLanguageContents, curModel.get('language')),
							disabled:curModel.outputEnabled()
						}
					},
					ddForced: {
						item:temp_DDForced,
						variables:{
							options:createDropdownOptions(ddForcedContents, curModel.get('forced')), disabled:curModel.outputEnabled() }},
					buttons: {item:temp_Buttons}
				});
			}

		}
		html += '<div id="trackArrangeNumbers" class="container-arranged-numbers">' + numbers + '</div>';
		this.$el.html(html);
		var parent = this;
		var sortable = Sortable.create(document.getElementById('trackArrangeNumbers'), {
			onEnd: function() {
				parent.arrangeNumbers();
				updateBatchText(view['collection']);
			}
		});
		updateBatchText(this.collection);
	},
	//Update the model when the user types.
	titleChanged: function(e) {
		var text = $(e.currentTarget).val();
		this.focusModel.set('title', text);
		updateBatchText(this.collection);
	},
	languageChanged: function(e) {
		var selected = $(e.currentTarget).val();
		this.focusModel.set('language', selected);
		updateBatchText(this.collection);
	},
	defaultChanged: function(e) {
		var selected = $(e.currentTarget).val();
		this.focusModel.set('default', selected);
		updateBatchText(this.collection);
	},
	forcedChanged: function(e) {
		var selected = $(e.currentTarget).val();
		this.focusModel.set('forced', selected);
		updateBatchText(this.collection);
	},
	//Changes the track order.
	arrangeNumbers: function() {
		var element = $('#trackArrangeNumbers');
		var numberArray = [];
		element.children('div').each(function() {
			numberArray.push($(this).attr('data-track'));
		});
		this.collection.reOrderSortedTrackOrder(numberArray);
		updatePropFlag(view['collection']);
	},
	//Everytime the user selects a new input field, set the local variable to represent the model.
	//Saves resources instead of searching for the model every key press the user makes.
	gainedFocus: function(e) {
		this.focusModel = 'fill';
		var uid = $(e.currentTarget).parent().parent().attr('data-uid');
		for (var i = 0; i < this.collection.length; i++) {
			var curModel = this.collection.models[i];
			if (curModel.get('uid') === uid) {
				this.focusModel = curModel;
				break;
			}
		}
	},
	//Sets a model to be disabled. Disabled tracks will be deleted from the file.
	enableDeleteTrack: function(e) {
		var uid = $(e.currentTarget).parent().attr('data-uid');
		for (var i = 0; i < this.collection.length; i++) {
			var curModel = this.collection.models[i];
			if (curModel.get('uid') === uid) {
				curModel.switchEnabled();
				this.render();
				break;
			}
		}
	},
	//Watch this. Seems to work but I need to test still.
	removeTrack: function(e) {
		var uid = $(e.currentTarget).parent().attr('data-uid');
		for (var i = 0; i < this.collection.length; i++) {
			var curModel = this.collection.models[i];
			if (curModel.get('uid') === uid) {
				this.collection.remove(curModel);
				this.render();
				break;
			}
		}
	}
});

var view = new backboneView_Fields({collection:collection});
