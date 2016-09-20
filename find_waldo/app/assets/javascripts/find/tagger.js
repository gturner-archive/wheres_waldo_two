var WALDO = WALDO || {};

WALDO.tagger = {

  time: 200,

  names: [],

  selectedNames: [],

  permanent: [],

  tempBoxCoords: [],

  leaderboard: [],

  init: function() {
    this.getNames();
    return this.getTags();
  },

  checkGameOver: function() {
    if (WALDO.tagger.getUnselected().length === 0 || WALDO.tagger.time === 0) {
      return true;
    }
    return false;
  },

  clearTags: function() {
    var tags = this.permanent;
    for (var index in tags) {
      this.syncAjax(tags[index].id)
    }
  },

  decrementTime: function() {
    this.time -= 1;
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

  syncAjax: function(id) {
    $.ajax({
      async: false,
      url: '/finds',
      contentType: 'application/json',
      type: 'DELETE',
      dataType: 'json',
      data: JSON.stringify({id: id}),
      success: function() {
        console.log('this has been deleted');
      }
    });
  },

  deleteBox: function(id, charId) {
    for (var j = 0; j < this.selectedNames.length; j++) {
      var index = this.selectedNames.length - 1 - j;
      if (parseInt(charId) === this.selectedNames[index]) {
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
      success: function() {
        console.log('this has been deleted');
      }
    });
  },

  buildNames: function(response) {
    WALDO.tagger.names = response;
  },

  buildTags: function(response) {
    if (response) {
      WALDO.tagger.permanent = response;

      response.forEach(function (el) {
        WALDO.tagger.selectedNames.push(el.character.id);
      });
    }
  },

  buildLeaderboards: function(response) {
    WALDO.tagger.leaderboards = response;
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

  getLeaderboards: function() {
    return $.ajax({
      url: 'leaderboards',
      contentType: 'application/json',
      type: 'GET',
      dataType: 'json',
      success: WALDO.tagger.buildLeaderboards
    });

  },

  createTempBox: function(x, y) {
    if (WALDO.tagger.getUnselected().length) {
      WALDO.tagger.tempBoxCoords = [x,y];
    }
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

  createLeaderboard: function(name) {
    return $.ajax({
      url: '/leaderboards',
      contentType: 'application/json',
      type: 'POST',
      dataType: 'json',
      success: WALDO.tagger.clearTags(),
      data: JSON.stringify({ name: name,
                             score: WALDO.tagger.time })
    });
  },



  updatePermanent: function(response) {
    WALDO.tagger.permanent.push(response);
    WALDO.tagger.selectedNames.push(response.character.id)
  }

};
