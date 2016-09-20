$(document).ready(function() {
  WALDO.taggerController.init();
});

var WALDO = WALDO || {};

WALDO.tagger = {

  names: [],

  selectedNames: [],

  permanent: [],

  tempBoxCoords: [],

  init: function() {
    this.getNames();
    return this.getTags();
  },

  getUnselected: function() {
    var names = this.names.slice();
    for (var id in this.selectedNames) {
      for (var i = 0; i < names.length; i++) {
        var index = names.length - 1 - i;
        if (this.selectedNames[id] === names[index].id) {
          names.splice(index, 1);
        }
      }
    }
    return names;
  },

  deleteBox: function(id) {

    for (var j = 0; j < this.selectedNames.length; j++) {
      var index = this.selectedNames.length - 1;
      if (parseInt(id) === this.selectedNames[index]) {
        this.selectedNames.splice(index, 1);
      }
    }

    for (var i = this.permanent.length - 1; i >= 0; i--) {
      if (this.permanent[i].id === parseInt(id)) {
        this.permanent.splice(i, 1);
      }
    }

    return $.ajax({
      url: '/finds',
      contentType: 'application/json',
      type: 'DELETE',
      dataType: 'json',
      data: JSON.stringify({id: id}),
      success: WALDO.tagger.buildNames
    });
  },

  buildNames: function(response) {
    WALDO.tagger.names = response;
  },

  buildTags: function(response) {
    if (response) {
      WALDO.tagger.permanent = response;
    }
  },

  getNames: function() {
    $.ajax({
      url: '/character',
      contentType: 'application/json',
      type: 'GET',
      dataType: 'json',
      success: WALDO.tagger.buildNames
    });
  },

  getTags: function() {
    return $.ajax({
      url: '/',
      contentType: 'application/json',
      type: 'GET',
      dataType: 'json',
      success: WALDO.tagger.buildTags
    });

  },

  createTempBox: function(x, y) {
    WALDO.tagger.tempBoxCoords = [x,y];
  },

  createBox: function(name, id) {

    var person = {
      character_id: id,
      x: this.tempBoxCoords[0],
      y: this.tempBoxCoords[1]
    }

    this.tempBoxCoords = [];

    return $.ajax({
      url: '/finds',
      contentType: 'application/json',
      type: 'POST',
      dataType: 'json',
      success: WALDO.tagger.updatePermanent,
      data: JSON.stringify(person)
    });

  },

  updatePermanent: function(response) {
    WALDO.tagger.permanent.push(response);
    WALDO.tagger.selectedNames.push(response.character.id)
  }

};

WALDO.taggerView = {
  xOffset: 25,
  yOffset: 25,

  init: function() {
    WALDO.taggerView.pictureClickListener();
    WALDO.taggerView.nameClickListener();
    WALDO.taggerView.pictureHoverListener();
    WALDO.taggerView.deleteLinkListener();
  },

  pictureHoverListener: function () {
    $('body').on('mouseenter',WALDO.taggerView.showTags);
    $('body').on('mouseleave', WALDO.taggerView.hideTags);
  },

  deleteLinkListener: function() {
    $('body').on('click', '.delete-button', WALDO.taggerView.deleteLink)
  },

  deleteLink: function(e) {
    e.preventDefault();
    var id = $(e.target).attr('data-id');
    WALDO.taggerController.deleteTag(id);
  },

  showTags: function () {
    $('.perm-tag').show();
    $('.name-box').show();
  },

  hideTags: function() {
    $('.perm-tag').hide();
    $('.name-box').hide();
  },

  pictureClickListener: function() {
    $('.waldo-img').on('click', WALDO.taggerView.pictureClick);
  },

  pictureClick: function(e) {
    var x = e.offsetX - WALDO.taggerView.xOffset;
    var y = e.offsetY - WALDO.taggerView.yOffset;

    WALDO.taggerController.createTempTag(x,y);
  },

  nameClickListener: function() {
    $('body').on('click', '.name-item', WALDO.taggerView.nameClick);
  },

  nameClick: function(e) {
    var name = $(e.target).text();
    var id = $(e.target).attr('data-id')
    WALDO.taggerController.createTag(name, id);
  },


  render: function(coordsArr, namesArr, permArr) {
    $('.temp-tag').remove();
    $('.dropdown').remove();
    $('.name-box').remove();
    $('.perm-tag').remove();

    if (coordsArr[0]) {
      this.renderTemp(coordsArr, namesArr);
    }
    if (permArr[0]) {
      this.renderPermanent(permArr);
    }

  },

  renderTemp: function(coordsArr, namesArr) {
    var $dropdown = $('<div>')
    var $namesBox = $('<ul>').addClass('name-list')

    for (var i in namesArr) {
      this.buildListItems(namesArr[i], $namesBox);
    }

    $dropdown.append($namesBox);

    $dropdown.addClass('dropdown')
      .css("top", coordsArr[1] + WALDO.taggerView.yOffset * 2)
      .css("left", coordsArr[0]);

    var $box = $('<div>')
      .addClass('temp-tag')
      .css("top", coordsArr[1])
      .css("left", coordsArr[0]);
    $('body').append($box);
    $('body').append($dropdown);
  },

  buildListItems: function(character, $namesBox) {
    var $li = $('<li>');
    $li.text(character.name)
    $li.attr('data-id', character.id);
    $li.addClass('name-item');
    $namesBox.append($li);
  },

  renderPermanent: function(permArr) {
    for (var i in permArr) {
      var person = permArr[i];
      var $box = $('<div>')
        .addClass('perm-tag')
        .css("top", person.y)
        .css("left", person.x);
      var $nameBox = $('<div>')
        .addClass('name-box')
        .text(person.character.name)
        .css("top", person.y + WALDO.taggerView.yOffset * 2)
        .css("left", person.x)
      var $deleteLink = $('<a href="#">delete</a>')
        .addClass('delete-button')
        .attr('data-id', person.id);
      $('body').append($box);
      $nameBox.append($deleteLink);
      $('body').append($nameBox);
    }
  }

};

WALDO.taggerController = {
  init : function() {
    WALDO.taggerView.init();

    var promise = WALDO.tagger.init();
    promise.then( function() {
      WALDO.taggerView.render(WALDO.tagger.tempBoxCoords, WALDO.tagger.getUnselected(), WALDO.tagger.permanent);
    });
  },

  deleteTag: function(id) {
    WALDO.tagger.deleteBox(id);
    WALDO.taggerView.render(WALDO.tagger.tempBoxCoords, WALDO.tagger.getUnselected(), WALDO.tagger.permanent);
  },

  createTempTag: function(x, y) {
    WALDO.tagger.createTempBox(x, y);
    WALDO.taggerView.render(WALDO.tagger.tempBoxCoords, WALDO.tagger.getUnselected(), WALDO.tagger.permanent);
  },

  createTag: function(name, id) {
    var promise = WALDO.tagger.createBox(name, id);
    promise.then( function () {
      WALDO.taggerView.render(WALDO.tagger.tempBoxCoords, WALDO.tagger.getUnselected(), WALDO.tagger.permanent)
      });
  },
};
