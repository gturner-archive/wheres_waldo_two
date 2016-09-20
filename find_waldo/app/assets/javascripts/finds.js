$(document).ready(function() {
  WALDO.taggerController.init();
});

var WALDO = WALDO || {};

WALDO.tagger = {

  names: ['Graham', 'Adrian'],

  init: function() {

  },

  createTempBox: function(x, y) {
    WALDO.tagger.tempBoxCoords = [x,y];
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

  nameClickListener = function(e) {
    $('.name-item').on('click', WALDO.taggerView.nameClick);
  },

  nameClick: function() {

  },


  //REFACTOR
  render: function(coordsArr, names) {
    $('.temp-tag').remove();
    $('.dropdown').remove();

    var $dropdown = $('<div>')
    var $namesBox = $('<ul>').addClass('name-list')

    for (var i in names) {
      var $li = $('<li>')
      $li.text(names[i]);
      $li.addClass('name-item')
      $namesBox.append($li)
    }

    $dropdown.append($namesBox);

    $dropdown.addClass('dropdown')
      .css("top", coordsArr[1] + WALDO.taggerView.yOffset * 2)
      .css("left", coordsArr[0]);

    $box = $('<div>')
      .addClass('temp-tag')
      .css("top", coordsArr[1])
      .css("left", coordsArr[0]);
    $('body').append($box);
    $('body').append($dropdown);
  }

}

WALDO.taggerController = {
  init : function() {
    WALDO.taggerView.init();
  },

  createTempTag: function(x, y) {
    WALDO.tagger.createTempBox(x, y);
    WALDO.taggerView.render(WALDO.tagger.tempBoxCoords, WALDO.tagger.names);
  }
};
