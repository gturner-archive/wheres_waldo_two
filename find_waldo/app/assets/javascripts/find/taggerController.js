WALDO = WALDO || {};

WALDO.taggerController = {
  init : function() {
    WALDO.taggerView.init();
    var promise = WALDO.tagger.init();
    promise.then( function() {
      WALDO.taggerView.render(WALDO.tagger.tempBoxCoords, WALDO.tagger.getUnselected(), WALDO.tagger.permanent);
    });

    setInterval(function() {
      WALDO.tagger.decrementTime();
      WALDO.taggerView.renderAndUpdateScore(WALDO.tagger.time);

    }, 1000);
  },

  deleteTag: function(id, charId) {
    WALDO.tagger.deleteBox(id, charId);
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