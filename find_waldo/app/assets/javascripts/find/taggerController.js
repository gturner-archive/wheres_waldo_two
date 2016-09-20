var WALDO = WALDO || {};

WALDO.taggerController = {
  init : function() {
    WALDO.tagger.getLeaderboards().then( WALDO.taggerView.renderLeaderboards);
    WALDO.taggerView.init();
    var promise = WALDO.tagger.init();
    promise.then( function() {
      WALDO.taggerView.render(WALDO.tagger.tempBoxCoords, WALDO.tagger.getUnselected(), WALDO.tagger.permanent);
    });
    this.gameLoop();
  },

  gameLoop: function() {
    var int = setInterval(function() {
      WALDO.tagger.decrementTime();
      WALDO.taggerView.renderAndUpdateScore(WALDO.tagger.time);

      if (WALDO.tagger.checkGameOver()) {
        clearInterval(int);
        var name = prompt("You've won with a score of: " + WALDO.tagger.time + " Please Enter Your Name" );

        // create high score and clears all tags
        WALDO.tagger.createLeaderboard(name);
      }
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
