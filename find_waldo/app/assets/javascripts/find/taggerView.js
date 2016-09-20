var WALDO = WALDO || {};

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
    var charId = $(e.target).attr('data-character-id');
    WALDO.taggerController.deleteTag(id, charId);
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

    console.log(namesArr);
    if (coordsArr[0] && namesArr[0]) {
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
        .attr('data-id', person.id)
        .attr('data-character-id', person.character.id);
      $('body').append($box);
      $nameBox.append($deleteLink);
      $('body').append($nameBox);
    }
  },

  renderAndUpdateScore: function(score) {
    $('.time-counter').empty();
    $('.time-counter').text('Time Remaining: ' + score);
  },

  renderLeaderboards: function(board) {
    for (var i in board) {
      // var $score = board[i];
      var $highScore = $('<p>')
        .text("Name: " + board[i].name + " , Score: " + board[i].score);
      $(".score-board").append($highScore);
    }
  }

};
