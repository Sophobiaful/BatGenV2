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
		defaultTrack: 'yes',
		batch: 'error:002-video-default'
	},
	constructBatch: function() {
		var bat = '--track-name "abTRACKba:abTITLEba" --language abTRACKba:abLANGUAGEba --default-track abTRACKba:abDEFAULTba';
		bat = __replace(bat, 'abTRACKba',this.get('trackNumber'));
		bat = __replace(bat, 'abTITLEba',this.get('title'));
		bat = __replace(bat, 'abLANGUAGEba',this.get('language'));
		bat = __replace(bat, 'abDEFAULTba',this.get('defaultTrack'));

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
		defaultTrack: 'yes',
		batch: 'error:003-audio-default'
	},
	constructBatch: function() {
		var bat = '--track-name "abTRACKba:abTITLEba" --language abTRACKba:abLANGUAGEba --default-track abTRACKba:abDEFAULTba';
		bat = __replace(bat, 'abTRACKba',this.get('trackNumber'));
		bat = __replace(bat, 'abTITLEba',this.get('title'));
		bat = __replace(bat, 'abLANGUAGEba',this.get('language'));
		bat = __replace(bat, 'abDEFAULTba',this.get('defaultTrack'));

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
		defaultTrack: 'yes',
		forcedTrack: 'yes',
		batch: 'error:003-subtitle-default'
	},
	constructBatch: function() {
		var bat = '--track-name "abTRACKba:abTITLEba" --language abTRACKba:abLANGUAGEba --default-track abTRACKba:abDEFAULTba --forced-track abTRACKba:abFORCEDba';
		bat = __replace(bat, 'abTRACKba',this.get('trackNumber'));
		bat = __replace(bat, 'abTITLEba',this.get('title'));
		bat = __replace(bat, 'abLANGUAGEba',this.get('language'));
		bat = __replace(bat, 'abDEFAULTba',this.get('defaultTrack'));
		bat = __replace(bat, 'abFORCEDba',this.get('forcedTrack'));

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
	reOrderTrackNumbers: function() {
		for (var i = 0; i < this.length; i++) {
			console.log(i);
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
	events: {
		'keyup .listener-textbox':'textboxChanged'
	},
	render: function() {
		var html = '';
		for (var i = 0; i < this.collection.length; i++) {
			var curModel = this.collection.models[i];
			if (curModel.get('type') === 'video') {
				html += temp_Video({
					uid: curModel.get('uid'),
					textbox: {item:temp_Textbox, variables:{ title:'VIDEO', className:'video' }},
					ddDefault: {item:temp_DDDefault},
					ddLanguage: {item:temp_DDLanguage}
				});
			}
			else if (curModel.get('type') === 'audio') {
				html += temp_Audio({
					uid: curModel.get('uid'),
					textbox: {item:temp_Textbox, variables:{ title:'AUDIO', className:'audio' }},
					ddDefault: {item:temp_DDDefault},
					ddLanguage: {item:temp_DDLanguage}
				});
			}
			else if (curModel.get('type') === 'subtitle') {
				html += temp_Subtitle({
					uid: curModel.get('uid'),
					textbox: {item:temp_Textbox, variables:{ title:'SUBTITLE', className:'subtitle' }},
					ddDefault: {item:temp_DDDefault},
					ddLanguage: {item:temp_DDLanguage},
					ddForced: {item:temp_DDForced}
				});
			}
		}
		this.$el.html(html);
		this.updateBatchText();
	},
	textboxChanged: function(e) {
		console.log($(e.currentTarget).parent().parent().attr('data-uid'));
	},
	updateBatchText: function() {
		var batchScript = '';
		for (var i = 0; i < this.collection.length; i++) {
			var curModel = this.collection.models[i];
			batchScript += curModel.get('batch');
		}
		$('#downloadText').text(batchScript);
	}
});

var view = new backboneView_Fields({collection:collection});







/*
$('body').append(template_human({
  hea: {item:template_header, variables:{eyes:'green',headGear:'top hat', penis:'cheese'}},
  body: template_body,
  foot: template_footer
}));
*/
