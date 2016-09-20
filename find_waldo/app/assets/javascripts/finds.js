$(document).ready(function() {
  WALDO.taggerView.clickListener();
});

var WALDO = WALDO || {};

WALDO.tagger = {

};

WALDO.taggerView = {

  clickListener: function() {
    $('.waldo-img').on('click', pictureClick)
  },

  pictureClick: function(e) {
    var x = e.offsetX;
    var y = e.offsetY;
    WALDO.
  }

}

WALDO.taggerController = {

};
