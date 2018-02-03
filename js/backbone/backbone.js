/*
	Template Variables
*/
var temp_Textbox = _.template($('#Textbox-template').html());
var temp_DDLanguage = _.template($('#DropdownLanguage-template').html());
var temp_DDDefault = _.template($('#DropdownDefault-template').html());
var temp_DDForced = _.template($('#DropdownForced-template').html());

var temp_Video = _.template($('#VideoField-template').html());
var temp_Audio = _.template($('#AudioField-template').html());
var temp_Subtitle = _.template($('#SubtitleField-template').html());


/*
	Variables
*/
var ddLanguageContents = [['und','Undefined'], ['eng','English'], ['jap','Japanese'], ['fre','French'], ['ger','German'], ['spa','Spanish']];
var ddDefaultContents = [['yes','Yes'], ['no','No']];
var ddForcedContents = [['yes','Yes'], ['no','No']];


/*
	Models
*/
//Base model. Used for the collection.
var backboneModel_Field = Backbone.Model.extend({
	initialize: function() { },
	defaults: {
		batch: 'error:001-basemodel-default'
	},
	constructBatch: function() { }
});

//A model used for each 'video' type track/field.
var backboneModel_VideoField = backboneModel_Field.extend({
	initialize: function() {
		this.set({uid: guid()});
		this.constructBatch();
	},
	defaults: {
		uid: 0,
		type: 'video',
		trackNumber: 0,
		title: '',
		language: 'und',
		default: 'yes',
		batch: 'error:002-video-default'
	},
	constructBatch: function() {
		var bat = '--track-name "abTRACKba:abTITLEba" --language abTRACKba:abLANGUAGEba --default-track abTRACKba:abDEFAULTba';
		bat = __replace(bat, 'abTRACKba',this.get('trackNumber'));
		bat = __replace(bat, 'abTITLEba',this.get('title'));
		bat = __replace(bat, 'abLANGUAGEba',this.get('language'));
		bat = __replace(bat, 'abDEFAULTba',this.get('default'));

		this.set({batch:bat});
	}
});

//A model used for each 'audio' type track/field.
var backboneModel_AudioField = backboneModel_Field.extend({
	initialize: function() {
		this.set({uid: guid()});
		this.constructBatch();
	},
	defaults: {
		uid: 0,
		type: 'audio',
		trackNumber: 0,
		title: '',
		language: 'und',
		default: 'yes',
		batch: 'error:003-audio-default'
	},
	constructBatch: function() {
		var bat = '--track-name "abTRACKba:abTITLEba" --language abTRACKba:abLANGUAGEba --default-track abTRACKba:abDEFAULTba';
		bat = __replace(bat, 'abTRACKba',this.get('trackNumber'));
		bat = __replace(bat, 'abTITLEba',this.get('title'));
		bat = __replace(bat, 'abLANGUAGEba',this.get('language'));
		bat = __replace(bat, 'abDEFAULTba',this.get('default'));

		this.set({batch:bat});
	}
});

//A model used for each 'subtitle' type track/field. Contains the difference of having a forced track field.
var backboneModel_SubtitleField = backboneModel_Field.extend({
	initialize: function() {
		this.set({uid: guid()});
		this.constructBatch();
	},
	defaults: {
		uid: 0,
		type: 'subtitle',
		trackNumber: 0,
		title: '',
		language: 'und',
		default: 'yes',
		forced: 'yes',
		batch: 'error:003-subtitle-default'
	},
	constructBatch: function() {
		var bat = '--track-name "abTRACKba:abTITLEba" --language abTRACKba:abLANGUAGEba --default-track abTRACKba:abDEFAULTba --forced-track abTRACKba:abFORCEDba';
		bat = __replace(bat, 'abTRACKba',this.get('trackNumber'));
		bat = __replace(bat, 'abTITLEba',this.get('title'));
		bat = __replace(bat, 'abLANGUAGEba',this.get('language'));
		bat = __replace(bat, 'abDEFAULTba',this.get('default'));
		bat = __replace(bat, 'abFORCEDba',this.get('forced'));

		this.set({batch:bat});
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
		});
	},
	printTrackOrder: function() {
		var order = '';
		for (var i = 0; i < this.length; i++) {
			order += '0:' + this.models[i].get('trackNumber') + ',';
		}
		order = order.slice(0,-1);
		return order;
	},
	reOrderTrackNumbers: function() {
		for (var i = 0; i < this.length; i++) {
			currentModel = this.models[i];

			currentModel.set('trackNumber', i);
			currentModel.constructBatch();
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
		'focus .listener-textbox,.listener-ddLanguage,.listener-ddDefault,.listener-ddForced':'gainedFocus'
	},
	render: function() {
		var html = '';
		for (var i = 0; i < this.collection.length; i++) {
			var curModel = this.collection.models[i];
			if (curModel.get('type') === 'video') {
				html += temp_Video({
					uid: curModel.get('uid'),
					textbox: {item:temp_Textbox, variables:{ label:'VIDEO', className:'video', modelTitle:curModel.get('title') }},
					ddDefault: {item:temp_DDDefault, variables:{ options: createDropdownOptions(ddDefaultContents, curModel.get('default')) }},
					ddLanguage: {item:temp_DDLanguage, variables:{ options:createDropdownOptions(ddLanguageContents, curModel.get('language')) }}
				});
			}
			else if (curModel.get('type') === 'audio') {
				html += temp_Audio({
					uid: curModel.get('uid'),
					textbox: {item:temp_Textbox, variables:{ label:'AUDIO', className:'audio', modelTitle:curModel.get('title') }},
					ddDefault: {item:temp_DDDefault, variables:{ options: createDropdownOptions(ddDefaultContents, curModel.get('default')) }},
					ddLanguage: {item:temp_DDLanguage, variables:{ options:createDropdownOptions(ddLanguageContents, curModel.get('language')) }}
				});
			}
			else if (curModel.get('type') === 'subtitle') {
				html += temp_Subtitle({
					uid: curModel.get('uid'),
					textbox: {item:temp_Textbox, variables:{ label:'SUBTITLE', className:'subtitle', modelTitle:curModel.get('title') }},
					ddDefault: {item:temp_DDDefault, variables:{ options: createDropdownOptions(ddDefaultContents, curModel.get('default')) }},
					ddLanguage: {item:temp_DDLanguage, variables:{ options:createDropdownOptions(ddLanguageContents, curModel.get('language')) }},
					ddForced: {item:temp_DDForced, variables:{ options:createDropdownOptions(ddForcedContents, curModel.get('forced')) }}
				});
			}
		}
		this.$el.html(html);
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
	}
});

var view = new backboneView_Fields({collection:collection});
