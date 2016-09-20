$(document).ready(function() {
  WALDO.taggerController.init();
});

var WALDO = WALDO || {};

WALDO.tagger = {
  init: function() {

  },

  createTempBox: function(x, y) {
    WALDO.tagger.tempBoxCoords = [x,y];
  },



};

WALDO.taggerView = {
  xOffset: 50,
  yOffset: 50,

  init: function() {

    WALDO.taggerView.clickListener();
  },

  clickListener: function() {
    $('.waldo-img').on('click', WALDO.taggerView.pictureClick);
  },

  pictureClick: function(e) {
    var x = e.offsetX - WALDO.taggerView.xOffset;
    var y = e.offsetY - WALDO.taggerView.yOffset;
 
    WALDO.taggerController.createTempTag(x,y);
  },

  render: function(coordsArr) {
    $box = $('<div>')
      .addClass('temp-tag')
      .css("top", coordsArr[1])
      .css("left", coordsArr[0]);
    $('body').append($box);
  }

}

WALDO.taggerController = {
  init : function() {
    WALDO.taggerView.init();
  },

  createTempTag: function(x, y) {
    WALDO.tagger.createTempBox(x, y);
    WALDO.taggerView.render(WALDO.tagger.tempBoxCoords);
  }
};

