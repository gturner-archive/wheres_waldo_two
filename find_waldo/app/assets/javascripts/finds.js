$(document).ready(function() {
  WALDO.taggerController.init();
});

var WALDO = WALDO || {};

WALDO.tagger = {

  names: ['Graham', 'Adrian'],

  permanent: [],

  init: function() {

  },

  createTempBox: function(x, y) {
    WALDO.tagger.tempBoxCoords = [x,y];
  },

  createBox: function(name) {
    var person = {
      name: name,
      x: this.tempBoxCoords[0],
      y: this.tempBoxCoords[1]
    }
    this.permanent.push(person);
    this.tempBoxCoords = [];
  },



};

WALDO.taggerView = {
  xOffset: 25,
  yOffset: 25,

  init: function() {
    WALDO.taggerView.pictureClickListener();
    WALDO.taggerView.nameClickListener();
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
    WALDO.taggerController.createTag(name);
  },


  //REFACTOR
  render: function(coordsArr, namesArr, permArr) {
    $('.temp-tag').remove();
    $('.dropdown').remove();

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

  buildListItems: function(name, $namesBox) {
    var $li = $('<li>');
    $li.text(name);
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
        .text(person.name)
        .css("top", person.y + WALDO.taggerView.yOffset * 2)
        .css("left", person.x)
      $('body').append($box);
      $('body').append($nameBox);
    }
  }

};

WALDO.taggerController = {
  init : function() {
    WALDO.taggerView.init();
  },

  createTempTag: function(x, y) {
    WALDO.tagger.createTempBox(x, y);
    WALDO.taggerView.render(WALDO.tagger.tempBoxCoords, WALDO.tagger.names, WALDO.tagger.permanent);
  },

  createTag: function(name) {
    WALDO.tagger.createBox(name);
    WALDO.taggerView.render(WALDO.tagger.tempBoxCoords, WALDO.tagger.names, WALDO.tagger.permanent);
  },
};
